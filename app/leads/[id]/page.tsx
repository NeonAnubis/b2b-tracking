import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDate, timeAgo } from '@/lib/utils'
import { ArrowLeft, Mail, Building, Phone, Globe, MousePointerClick, Calendar, FileText, ExternalLink } from 'lucide-react'
import { notFound } from 'next/navigation'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getLeadWithActivity(id: number) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      events: {
        orderBy: { createdAt: 'desc' },
        include: {
          session: {
            select: {
              ipAddress: true,
              userAgent: true,
              referrer: true,
              utmSource: true,
              utmMedium: true,
              utmCampaign: true,
            }
          }
        }
      },
      sessions: {
        orderBy: { startedAt: 'desc' },
      },
      trackingLinks: {
        orderBy: { createdAt: 'desc' },
      }
    }
  })

  return lead
}

function getEventIcon(eventType: string) {
  switch (eventType) {
    case 'page_view':
      return <Globe className="w-4 h-4" />
    case 'link_click':
      return <MousePointerClick className="w-4 h-4" />
    case 'call_booked':
      return <Calendar className="w-4 h-4" />
    case 'form_submit':
      return <FileText className="w-4 h-4" />
    case 'email_click':
      return <Mail className="w-4 h-4" />
    default:
      return <MousePointerClick className="w-4 h-4" />
  }
}

function getEventColor(eventType: string) {
  switch (eventType) {
    case 'page_view':
      return 'bg-blue-100 text-blue-700'
    case 'link_click':
      return 'bg-purple-100 text-purple-700'
    case 'call_booked':
      return 'bg-green-100 text-green-700'
    case 'form_submit':
      return 'bg-orange-100 text-orange-700'
    case 'email_click':
      return 'bg-pink-100 text-pink-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default async function LeadProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Await params as required by Next.js 14.2+
  const { id } = await params

  const leadId = parseInt(id)
  if (isNaN(leadId)) {
    notFound()
  }

  const lead = await getLeadWithActivity(leadId)

  if (!lead) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {lead.firstName && lead.lastName
                  ? `${lead.firstName} ${lead.lastName}`
                  : 'Lead Profile'}
              </h1>
              <p className="text-sm text-gray-600">Lead ID: {lead.id}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Lead Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Lead Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-2xl">
                      {lead.firstName?.[0] || lead.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {lead.firstName && lead.lastName
                        ? `${lead.firstName} ${lead.lastName}`
                        : 'Anonymous Lead'}
                    </p>
                    <p className="text-sm text-gray-500">
                      First seen {timeAgo(lead.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  {lead.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{lead.email}</span>
                    </div>
                  )}

                  {lead.company && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{lead.company}</span>
                    </div>
                  )}

                  {lead.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{lead.phone}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-sm text-gray-900 mb-3">Activity Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{lead.events.length}</p>
                      <p className="text-xs text-gray-600">Total Events</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{lead.sessions.length}</p>
                      <p className="text-xs text-gray-600">Sessions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                {lead.events.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No activity recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {lead.events.map((event, index) => {
                      const eventData = event.eventData as any

                      return (
                        <div key={event.id} className="relative">
                          {/* Timeline line */}
                          {index !== lead.events.length - 1 && (
                            <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
                          )}

                          <div className="flex gap-4">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(event.eventType)}`}>
                              {getEventIcon(event.eventType)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-8">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-gray-900 capitalize">
                                    {event.eventType.replace('_', ' ')}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(event.createdAt)}
                                  </p>
                                </div>
                                <Badge variant="outline">
                                  {event.eventType}
                                </Badge>
                              </div>

                              {/* Event Details */}
                              <div className="bg-gray-50 rounded-lg p-4 mt-2 space-y-2">
                                {event.pageUrl && (
                                  <div className="flex items-start gap-2">
                                    <ExternalLink className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <a
                                      href={event.pageUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-primary hover:underline break-all"
                                    >
                                      {event.pageTitle || event.pageUrl}
                                    </a>
                                  </div>
                                )}

                                {event.eventType === 'link_click' && eventData?.href && (
                                  <div className="text-sm">
                                    <span className="text-gray-600">Clicked: </span>
                                    <span className="font-mono text-xs">{eventData.href}</span>
                                  </div>
                                )}

                                {event.eventType === 'call_booked' && eventData?.startTime && (
                                  <div className="text-sm">
                                    <span className="text-gray-600">Scheduled for: </span>
                                    <span className="font-semibold">
                                      {formatDate(eventData.startTime)}
                                    </span>
                                  </div>
                                )}

                                {event.session?.utmSource && (
                                  <div className="flex gap-2 text-xs mt-2">
                                    <Badge variant="secondary">
                                      Source: {event.session.utmSource}
                                    </Badge>
                                    {event.session.utmMedium && (
                                      <Badge variant="secondary">
                                        Medium: {event.session.utmMedium}
                                      </Badge>
                                    )}
                                    {event.session.utmCampaign && (
                                      <Badge variant="secondary">
                                        Campaign: {event.session.utmCampaign}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
