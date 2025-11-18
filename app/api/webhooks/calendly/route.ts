import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { stitchSessionToLead } from '@/lib/identity-stitching'

/**
 * Calendly Webhook Handler
 *
 * Handles events from Calendly (invitee.created, invitee.canceled)
 * Documentation: https://developer.calendly.com/api-docs/webhooks
 */

const calendlyWebhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    email: z.string().email(),
    name: z.string().optional(),
    event_type: z.string().optional(),
    scheduled_event: z.object({
      uri: z.string(),
      name: z.string().optional(),
      start_time: z.string(),
      end_time: z.string(),
    }).optional(),
    cancel_url: z.string().optional(),
    reschedule_url: z.string().optional(),
    tracking: z.object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_content: z.string().optional(),
      utm_term: z.string().optional(),
      anonymous_id: z.string().optional(),
      session_id: z.string().optional(),
    }).optional(),
  })
})

export async function POST(request: NextRequest) {
  try {
    // Parse webhook payload
    const body = await request.json()
    console.log('[Calendly Webhook] Received:', body.event)

    const validatedData = calendlyWebhookSchema.parse(body)

    const { event, payload } = validatedData

    // Extract name parts
    const nameParts = payload.name?.split(' ') || []
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || undefined

    // Extract tracking data (passed via UTM parameters or Calendly tracking fields)
    const anonymousId = payload.tracking?.anonymous_id
    const sessionId = payload.tracking?.session_id

    // Handle different event types
    switch (event) {
      case 'invitee.created':
        // Call was booked
        if (anonymousId) {
          // Stitch session to lead
          const stitchResult = await stitchSessionToLead(
            anonymousId,
            payload.email,
            {
              firstName,
              lastName,
            }
          )

          // Create call_booked event
          if (sessionId) {
            await prisma.event.create({
              data: {
                sessionId,
                leadId: stitchResult.leadId,
                eventType: 'call_booked',
                eventData: {
                  eventTypeUri: payload.event_type,
                  scheduledEventUri: payload.scheduled_event?.uri,
                  eventName: payload.scheduled_event?.name,
                  startTime: payload.scheduled_event?.start_time,
                  endTime: payload.scheduled_event?.end_time,
                  rescheduleUrl: payload.reschedule_url,
                  cancelUrl: payload.cancel_url,
                },
              }
            })
          } else {
            // No session ID - create orphaned event
            await prisma.event.create({
              data: {
                sessionId: anonymousId, // Use anonymous ID as fallback
                leadId: stitchResult.leadId,
                eventType: 'call_booked',
                eventData: {
                  eventTypeUri: payload.event_type,
                  scheduledEventUri: payload.scheduled_event?.uri,
                  eventName: payload.scheduled_event?.name,
                  startTime: payload.scheduled_event?.start_time,
                  endTime: payload.scheduled_event?.end_time,
                },
              }
            })
          }

          console.log('[Calendly Webhook] Stitched lead:', stitchResult.leadId)
        } else {
          // No anonymous ID - find or create lead directly
          let lead = await prisma.lead.findUnique({
            where: { email: payload.email.toLowerCase() }
          })

          if (!lead) {
            lead = await prisma.lead.create({
              data: {
                email: payload.email.toLowerCase(),
                firstName,
                lastName,
              }
            })
          }

          console.log('[Calendly Webhook] Created/found lead:', lead.id)
        }
        break

      case 'invitee.canceled':
        // Call was canceled
        if (anonymousId && sessionId) {
          const session = await prisma.session.findUnique({
            where: { id: sessionId }
          })

          if (session?.leadId) {
            await prisma.event.create({
              data: {
                sessionId,
                leadId: session.leadId,
                eventType: 'call_canceled',
                eventData: {
                  scheduledEventUri: payload.scheduled_event?.uri,
                  canceledAt: new Date().toISOString(),
                },
              }
            })
          }
        }
        break

      default:
        console.log('[Calendly Webhook] Unhandled event type:', event)
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('[Calendly Webhook] Error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid webhook payload',
        details: error.errors,
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}
