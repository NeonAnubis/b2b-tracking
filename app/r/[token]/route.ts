import { NextRequest, NextResponse } from 'next/server'
import { stitchTrackingLinkToLead } from '@/lib/identity-stitching'
import { v4 as uuidv4 } from 'uuid'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Redirect Tracking Endpoint
 *
 * Handles tracking link clicks from emails and other sources
 * Pattern: /r/[token]?anonymousId=xxx&sessionId=xxx
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Await params as required by Next.js 14.2+
    const { token } = await params
    const { searchParams } = new URL(request.url)

    // Get or generate identifiers
    let anonymousId = searchParams.get('aid')
    let sessionId = searchParams.get('sid')

    // Generate new IDs if not provided (first-time click from email)
    if (!anonymousId) {
      anonymousId = uuidv4()
    }
    if (!sessionId) {
      sessionId = uuidv4()
    }

    // Stitch the tracking link to lead
    const result = await stitchTrackingLinkToLead(
      token,
      anonymousId,
      sessionId
    )

    if (!result) {
      // Invalid token - redirect to homepage
      return NextResponse.redirect(
        new URL('/', request.url),
        { status: 302 }
      )
    }

    // Build destination URL with identifiers embedded
    const destinationUrl = new URL(result.destinationUrl)
    destinationUrl.searchParams.set('_aid', anonymousId)
    destinationUrl.searchParams.set('_sid', sessionId)
    destinationUrl.searchParams.set('_source', 'email')

    // Set cookies for cross-domain tracking
    const response = NextResponse.redirect(destinationUrl.toString(), { status: 302 })

    // Set anonymous ID cookie (1 year)
    response.cookies.set('__b2b_aid', anonymousId, {
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    })

    return response

  } catch (error) {
    console.error('[Redirect] Error:', error)

    // Fallback to homepage on error
    return NextResponse.redirect(
      new URL('/', request.url),
      { status: 302 }
    )
  }
}
