import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getOrCreateSession, stitchSessionToLead } from '@/lib/identity-stitching'

// Validation schema
const trackingEventSchema = z.object({
  trackingId: z.string(), // Allow any string for demo purposes
  anonymousId: z.string().uuid(),
  sessionId: z.string().uuid(),
  eventType: z.string(),
  eventData: z.record(z.any()).optional(),
  pageUrl: z.string().optional(), // Make URL validation optional for demo
  pageTitle: z.string().optional(),
  referrer: z.string().optional(),
  timestamp: z.string().optional(), // Make datetime validation optional
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = trackingEventSchema.parse(body)

    // Extract metadata from request
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      'unknown'
    const userAgent = request.headers.get('user-agent') || undefined

    // Get or create session
    const { sessionId, leadId: existingLeadId } = await getOrCreateSession(
      validatedData.sessionId,
      validatedData.anonymousId,
      {
        ipAddress,
        userAgent,
        referrer: validatedData.referrer,
        utmSource: validatedData.utmSource,
        utmMedium: validatedData.utmMedium,
        utmCampaign: validatedData.utmCampaign,
      }
    )

    let leadId = existingLeadId

    // Handle identity reveal events
    if (validatedData.eventType === 'identify' && validatedData.eventData?.email) {
      const stitchResult = await stitchSessionToLead(
        validatedData.anonymousId,
        validatedData.eventData.email,
        {
          firstName: validatedData.eventData.firstName,
          lastName: validatedData.eventData.lastName,
          company: validatedData.eventData.company,
          phone: validatedData.eventData.phone,
        }
      )
      leadId = stitchResult.leadId
    }

    // Create event record
    const event = await prisma.event.create({
      data: {
        sessionId,
        leadId,
        eventType: validatedData.eventType,
        eventData: validatedData.eventData as any,
        pageUrl: validatedData.pageUrl,
        pageTitle: validatedData.pageTitle,
      }
    })

    return NextResponse.json({
      success: true,
      eventId: event.id,
      sessionId,
      leadId,
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('[Track API] Error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
