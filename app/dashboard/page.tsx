import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatDate, timeAgo } from '@/lib/utils'

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

async function getDashboardStats() {
  const [totalLeads, totalEvents, totalSessions, recentLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.event.count(),
    prisma.session.count(),
    prisma.lead.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    })
  ])

  return { totalLeads, totalEvents, totalSessions, recentLeads }
}

export default async function DashboardPage() {
  const [leads, stats] = await Promise.all([
    getLeadsWithActivity(),
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>
              View and track prospect activity across your funnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No leads tracked yet</p>
                  <p className="text-sm text-gray-400">
                    Install the tracking script on your website to start tracking leads
                  </p>
                </div>
              ) : (
                leads.map((lead) => {
                  const lastEvent = lead.events[0]
                  const lastActivity = lastEvent?.createdAt || lead.createdAt

                  return (
                    <Link
                      key={lead.id}
                      href={`/leads/${lead.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
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
