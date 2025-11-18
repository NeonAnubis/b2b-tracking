import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatDate, timeAgo } from '@/lib/utils'
import { User, Users } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getLeadsWithActivity() {
  const leads = await prisma.lead.findMany({
    include: {
      events: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      sessions: {
        orderBy: { startedAt: 'desc' },
        take: 3,
        include: {
          events: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          }
        }
      },
      _count: {
        select: {
          events: true,
          sessions: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  })

  return leads
}

async function getAnonymousSessions() {
  const anonymousSessions = await prisma.session.findMany({
    where: {
      leadId: null, // Only anonymous sessions
    },
    include: {
      events: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: {
        select: {
          events: true,
        }
      }
    },
    orderBy: {
      startedAt: 'desc',
    },
    take: 20, // Show recent 20 anonymous sessions
  })

  return anonymousSessions
}

async function getDashboardStats() {
  const [totalLeads, totalEvents, totalSessions, recentLeads, anonymousSessions] = await Promise.all([
    prisma.lead.count(),
    prisma.event.count(),
    prisma.session.count(),
    prisma.lead.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    }),
    prisma.session.count({
      where: {
        leadId: null, // Count anonymous sessions
      }
    })
  ])

  return { totalLeads, totalEvents, totalSessions, recentLeads, anonymousSessions }
}

export default async function DashboardPage() {
  const [leads, anonymousSessions, stats] = await Promise.all([
    getLeadsWithActivity(),
    getAnonymousSessions(),
    getDashboardStats(),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">B2B Funnel Tracker</h1>
              <p className="text-sm text-gray-600">Track prospect activity across your sales funnel</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Leads</CardDescription>
              <CardTitle className="text-3xl">{stats.totalLeads}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>New This Week</CardDescription>
              <CardTitle className="text-3xl">{stats.recentLeads}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Anonymous Sessions</CardDescription>
              <CardTitle className="text-3xl">{stats.anonymousSessions}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Events</CardDescription>
              <CardTitle className="text-3xl">{stats.totalEvents.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Sessions</CardDescription>
              <CardTitle className="text-3xl">{stats.totalSessions.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Leads List */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <CardTitle>Identified Leads</CardTitle>
            </div>
            <CardDescription>
              Prospects who have revealed their identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No identified leads yet</p>
                  <p className="text-sm text-gray-400">
                    Leads will appear here when visitors identify themselves
                  </p>
                </div>
              ) : (
                leads.map((lead) => {
                  const lastEvent = lead.events[0]
                  const lastActivity = lastEvent?.createdAt || lead.createdAt

                  return (
                    <div key={lead.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="block p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                  {lead.firstName?.[0] || lead.email[0].toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {lead.firstName && lead.lastName
                                    ? `${lead.firstName} ${lead.lastName}`
                                    : lead.email}
                                </h3>
                                <p className="text-sm text-gray-600">{lead.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600 ml-13">
                              <span>{lead._count.events} events</span>
                              <span>{lead._count.sessions} sessions</span>
                              {lead.company && (
                                <span className="text-gray-500">{lead.company}</span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-2">
                              {timeAgo(lastActivity)}
                            </p>
                            {lastEvent && (
                              <Badge variant="secondary">
                                {lastEvent.eventType.replace('_', ' ')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Link>

                      {/* Session Timeline */}
                      {lead.sessions.length > 0 && (
                        <div className="border-t border-gray-200 bg-gray-50 p-4">
                          <h4 className="text-xs font-semibold text-gray-700 mb-3">Recent Sessions</h4>
                          <div className="space-y-3">
                            {lead.sessions.map((session) => (
                              <div key={session.id} className="bg-white rounded p-3 text-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-gray-500">
                                    {timeAgo(session.startedAt)}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {session.events.length} events
                                  </Badge>
                                </div>
                                {session.events.length > 0 && (
                                  <div className="space-y-1">
                                    {session.events.slice(0, 3).map((event) => (
                                      <div key={event.id} className="flex items-center gap-2 text-xs text-gray-600">
                                        <Badge variant="secondary" className="text-xs">
                                          {event.eventType.replace('_', ' ')}
                                        </Badge>
                                        {event.pageTitle && (
                                          <span className="truncate">{event.pageTitle}</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Anonymous Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <CardTitle>Anonymous Visitors</CardTitle>
            </div>
            <CardDescription>
              Visitor sessions before identification - grouped by session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anonymousSessions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No anonymous sessions</p>
                  <p className="text-sm text-gray-400">
                    Anonymous visitor activity will appear here
                  </p>
                </div>
              ) : (
                anonymousSessions.map((session) => {
                  return (
                    <div
                      key={session.id}
                      className="p-4 border border-gray-200 rounded-lg bg-white"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <Users className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Anonymous Visitor
                              </h3>
                              <p className="text-xs text-gray-500 font-mono">
                                {session.anonymousId.slice(0, 8)}...
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 ml-13">
                            <span>{session._count.events} events</span>
                            {session.utmSource && (
                              <Badge variant="outline" className="text-xs">
                                {session.utmSource}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {timeAgo(session.startedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Event Timeline for this session */}
                      {session.events.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-700 mb-3">Session Timeline</h4>
                          <div className="space-y-2">
                            {session.events.map((event) => (
                              <div key={event.id} className="flex items-start gap-3 text-sm">
                                <div className="flex-shrink-0 w-32 text-xs text-gray-500">
                                  {formatDate(event.createdAt)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {event.eventType.replace('_', ' ')}
                                    </Badge>
                                    {event.pageTitle && (
                                      <span className="text-xs text-gray-600 truncate">
                                        {event.pageTitle}
                                      </span>
                                    )}
                                  </div>
                                  {event.pageUrl && (
                                    <p className="text-xs text-gray-500 truncate mt-1">
                                      {event.pageUrl}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                            {session._count.events > session.events.length && (
                              <p className="text-xs text-gray-500 italic">
                                +{session._count.events - session.events.length} more events...
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Session Metadata */}
                      {(session.ipAddress || session.userAgent || session.referrer) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-700 mb-2">Session Info</h4>
                          <div className="space-y-1 text-xs text-gray-600">
                            {session.ipAddress && (
                              <p>IP: {session.ipAddress}</p>
                            )}
                            {session.referrer && (
                              <p className="truncate">Referrer: {session.referrer}</p>
                            )}
                            {(session.utmSource || session.utmMedium || session.utmCampaign) && (
                              <div className="flex gap-2 mt-2">
                                {session.utmSource && (
                                  <Badge variant="outline" className="text-xs">
                                    Source: {session.utmSource}
                                  </Badge>
                                )}
                                {session.utmMedium && (
                                  <Badge variant="outline" className="text-xs">
                                    Medium: {session.utmMedium}
                                  </Badge>
                                )}
                                {session.utmCampaign && (
                                  <Badge variant="outline" className="text-xs">
                                    Campaign: {session.utmCampaign}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
