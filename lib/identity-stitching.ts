import { prisma } from './prisma'
import { sessionCache } from './redis'

/**
 * Core Identity Stitching Logic
 *
 * This handles the merging of anonymous sessions with identified leads
 * when a user reveals their identity (form submit, booking, email click, etc.)
 */

export interface StitchingResult {
  leadId: number
  isNewLead: boolean
  stitchedSessions: number
}

/**
 * Stitch an anonymous session to a known lead by email
 * This is called when a user identifies themselves (e.g., form submission, Calendly booking)
 */
export async function stitchSessionToLead(
  anonymousId: string,
  email: string,
  additionalData?: {
    firstName?: string
    lastName?: string
    company?: string
    phone?: string
  }
): Promise<StitchingResult> {
  // Normalize email
  const normalizedEmail = email.toLowerCase().trim()

  // Find or create lead
  let lead = await prisma.lead.findUnique({
    where: { email: normalizedEmail }
  })

  const isNewLead = !lead

  if (!lead) {
    // Create new lead
    lead = await prisma.lead.create({
      data: {
        email: normalizedEmail,
        firstName: additionalData?.firstName,
        lastName: additionalData?.lastName,
        company: additionalData?.company,
        phone: additionalData?.phone,
      }
    })
  } else if (additionalData) {
    // Update existing lead with new information (only if fields are empty)
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        firstName: lead.firstName || additionalData.firstName,
        lastName: lead.lastName || additionalData.lastName,
        company: lead.company || additionalData.company,
        phone: lead.phone || additionalData.phone,
      }
    })
  }

  // Find all sessions with this anonymous ID that aren't already stitched
  const sessionsToStitch = await prisma.session.findMany({
    where: {
      anonymousId,
      leadId: null
    }
  })

  // Stitch all sessions to the lead
  if (sessionsToStitch.length > 0) {
    await prisma.session.updateMany({
      where: {
        anonymousId,
        leadId: null
      },
      data: {
        leadId: lead.id
      }
    })

    // Also update all events from these sessions
    const sessionIds = sessionsToStitch.map(s => s.id)
    await prisma.event.updateMany({
      where: {
        sessionId: { in: sessionIds },
        leadId: null
      },
      data: {
        leadId: lead.id
      }
    })
  }

  // Cache the anonymous ID -> lead ID mapping for fast lookups
  try {
    await sessionCache.setAnonymousMapping(anonymousId, lead.id)
  } catch (error) {
    console.warn('[Identity Stitching] Redis cache unavailable (non-critical)')
  }

  return {
    leadId: lead.id,
    isNewLead,
    stitchedSessions: sessionsToStitch.length
  }
}

/**
 * Stitch a tracking link click to a lead
 * This is called when a user clicks a tracking link (email campaign)
 */
export async function stitchTrackingLinkToLead(
  token: string,
  anonymousId: string,
  sessionId: string
): Promise<{ leadId: number; destinationUrl: string } | null> {
  // Find the tracking link
  const trackingLink = await prisma.trackingLink.findUnique({
    where: { token }
  })

  if (!trackingLink) {
    return null
  }

  // Update the session with the lead ID
  await prisma.session.update({
    where: { id: sessionId },
    data: { leadId: trackingLink.leadId }
  })

  // Update events in this session
  await prisma.event.updateMany({
    where: {
      sessionId,
      leadId: null
    },
    data: {
      leadId: trackingLink.leadId
    }
  })

  // Update tracking link analytics
  await prisma.trackingLink.update({
    where: { id: trackingLink.id },
    data: {
      clicks: { increment: 1 }
    }
  })

  // Cache the mapping
  try {
    await sessionCache.setAnonymousMapping(anonymousId, trackingLink.leadId)
  } catch (error) {
    console.warn('[Tracking Link] Redis cache unavailable (non-critical)')
  }

  return {
    leadId: trackingLink.leadId,
    destinationUrl: trackingLink.destinationUrl
  }
}

/**
 * Get or create a session
 * This handles both anonymous and identified sessions
 */
export async function getOrCreateSession(
  sessionId: string,
  anonymousId: string,
  metadata: {
    ipAddress?: string
    userAgent?: string
    referrer?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
  }
): Promise<{ sessionId: string; leadId: number | null }> {
  // Check if session exists
  let session = await prisma.session.findUnique({
    where: { id: sessionId }
  })

  if (session) {
    return {
      sessionId: session.id,
      leadId: session.leadId
    }
  }

  // Check if this anonymous ID is already mapped to a lead
  let leadId: number | null = null

  try {
    const cachedLeadId = await sessionCache.getAnonymousMapping(anonymousId)
    if (cachedLeadId) {
      leadId = typeof cachedLeadId === 'number' ? cachedLeadId : parseInt(cachedLeadId as string)
    }
  } catch (error) {
    console.warn('[Session] Redis cache unavailable, checking database')
  }

  if (!leadId) {
    // Check database for existing session with this anonymous ID
    const existingSession = await prisma.session.findFirst({
      where: { anonymousId },
      orderBy: { startedAt: 'desc' }
    })

    if (existingSession?.leadId) {
      leadId = existingSession.leadId
      try {
        await sessionCache.setAnonymousMapping(anonymousId, leadId)
      } catch (error) {
        console.warn('[Session] Could not cache lead mapping')
      }
    }
  }

  // Create or update session (upsert to handle duplicate session IDs)
  session = await prisma.session.upsert({
    where: { id: sessionId },
    update: {
      // If session exists, just return it without updating
    },
    create: {
      id: sessionId,
      anonymousId,
      leadId,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      referrer: metadata.referrer,
      utmSource: metadata.utmSource,
      utmMedium: metadata.utmMedium,
      utmCampaign: metadata.utmCampaign,
    }
  })

  return {
    sessionId: session.id,
    leadId: session.leadId
  }
}

/**
 * Create a tracking link for a lead
 */
export async function createTrackingLink(
  leadId: number,
  destinationUrl: string,
  campaignId?: string,
  campaignName?: string
): Promise<{ token: string; trackingUrl: string }> {
  const trackingLink = await prisma.trackingLink.create({
    data: {
      leadId,
      destinationUrl,
      campaignId,
      campaignName,
    }
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const trackingUrl = `${baseUrl}/r/${trackingLink.token}`

  return {
    token: trackingLink.token,
    trackingUrl
  }
}
