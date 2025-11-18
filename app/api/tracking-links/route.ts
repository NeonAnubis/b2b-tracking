import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createTrackingLink } from '@/lib/identity-stitching'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const createLinkSchema = z.object({
  leadId: z.number(),
  destinationUrl: z.string().url(),
  campaignId: z.string().optional(),
  campaignName: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createLinkSchema.parse(body)

    const result = await createTrackingLink(
      validatedData.leadId,
      validatedData.destinationUrl,
      validatedData.campaignId,
      validatedData.campaignName
    )

    return NextResponse.json({
      success: true,
      ...result,
    }, { status: 201 })

  } catch (error) {
    console.error('[Tracking Links API] Error:', error)

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
