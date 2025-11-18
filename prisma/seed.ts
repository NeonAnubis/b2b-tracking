import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create sample leads
  const lead1 = await prisma.lead.create({
    data: {
      email: 'john.doe@acmecorp.com',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme Corp',
      phone: '+1-555-0100',
    }
  })

  const lead2 = await prisma.lead.create({
    data: {
      email: 'sarah.wilson@techstart.io',
      firstName: 'Sarah',
      lastName: 'Wilson',
      company: 'TechStart',
    }
  })

  const lead3 = await prisma.lead.create({
    data: {
      email: 'mike.chen@growthco.com',
      firstName: 'Mike',
      lastName: 'Chen',
      company: 'Growth Co',
    }
  })

  console.log('Created 3 leads')

  // Create sessions for lead 1
  const session1 = await prisma.session.create({
    data: {
      id: uuidv4(),
      anonymousId: uuidv4(),
      leadId: lead1.id,
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      referrer: 'https://google.com',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'brand-search',
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    }
  })

  const session2 = await prisma.session.create({
    data: {
      id: uuidv4(),
      anonymousId: uuidv4(),
      leadId: lead1.id,
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      utmSource: 'email',
      utmMedium: 'newsletter',
      utmCampaign: 'monthly-update',
      startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    }
  })

  // Create sessions for lead 2
  const session3 = await prisma.session.create({
    data: {
      id: uuidv4(),
      anonymousId: uuidv4(),
      leadId: lead2.id,
      ipAddress: '10.0.0.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      referrer: 'https://linkedin.com',
      utmSource: 'linkedin',
      utmMedium: 'social',
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    }
  })

  console.log('Created sessions')

  // Create events for lead 1
  await prisma.event.createMany({
    data: [
      {
        sessionId: session1.id,
        leadId: lead1.id,
        eventType: 'page_view',
        pageUrl: 'https://example.com/landing',
        pageTitle: 'Welcome to Our SaaS Platform',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        sessionId: session1.id,
        leadId: lead1.id,
        eventType: 'page_view',
        pageUrl: 'https://example.com/pricing',
        pageTitle: 'Pricing Plans',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60000),
      },
      {
        sessionId: session1.id,
        leadId: lead1.id,
        eventType: 'page_view',
        pageUrl: 'https://example.com/features',
        pageTitle: 'Product Features',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 120000),
      },
      {
        sessionId: session2.id,
        leadId: lead1.id,
        eventType: 'email_click',
        pageUrl: 'https://example.com/blog/new-features',
        pageTitle: 'New Features Announcement',
        eventData: {
          campaignId: 'newsletter-may-2024',
          linkText: 'Read More'
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        sessionId: session2.id,
        leadId: lead1.id,
        eventType: 'call_booked',
        eventData: {
          eventName: 'Product Demo',
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 1800000).toISOString(),
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 300000),
      },
    ]
  })

  // Create events for lead 2
  await prisma.event.createMany({
    data: [
      {
        sessionId: session3.id,
        leadId: lead2.id,
        eventType: 'page_view',
        pageUrl: 'https://example.com/case-studies',
        pageTitle: 'Customer Success Stories',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        sessionId: session3.id,
        leadId: lead2.id,
        eventType: 'link_click',
        pageUrl: 'https://example.com/case-studies',
        eventData: {
          href: 'https://example.com/demo-video',
          text: 'Watch Demo Video'
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 180000),
      },
      {
        sessionId: session3.id,
        leadId: lead2.id,
        eventType: 'form_submit',
        pageUrl: 'https://example.com/contact',
        pageTitle: 'Contact Us',
        eventData: {
          formId: 'contact-form',
          fields: ['name', 'email', 'company', 'message']
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 300000),
      },
    ]
  })

  // Create events for lead 3 (minimal activity)
  const session4 = await prisma.session.create({
    data: {
      id: uuidv4(),
      anonymousId: uuidv4(),
      leadId: lead3.id,
      ipAddress: '172.16.0.1',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)',
      startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    }
  })

  await prisma.event.create({
    data: {
      sessionId: session4.id,
      leadId: lead3.id,
      eventType: 'page_view',
      pageUrl: 'https://example.com/homepage',
      pageTitle: 'Home',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    }
  })

  console.log('Created events')

  // Create tracking links
  await prisma.trackingLink.createMany({
    data: [
      {
        leadId: lead1.id,
        destinationUrl: 'https://example.com/special-offer',
        campaignId: 'summer-promo-2024',
        campaignName: 'Summer Promotion',
        clicks: 3,
        uniqueClicks: 2,
      },
      {
        leadId: lead2.id,
        destinationUrl: 'https://example.com/webinar',
        campaignId: 'webinar-invite',
        campaignName: 'Product Webinar Invitation',
        clicks: 1,
        uniqueClicks: 1,
      },
    ]
  })

  console.log('Created tracking links')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
