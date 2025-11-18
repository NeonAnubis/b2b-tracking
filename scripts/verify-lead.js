const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Get the lead we just created
  const lead = await prisma.lead.findUnique({
    where: { id: 4 },
    include: {
      events: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (lead) {
    console.log('\n✅ Lead Created Successfully!')
    console.log('================================')
    console.log('Email:', lead.email)
    console.log('Name:', lead.firstName, lead.lastName)
    console.log('Company:', lead.company)
    console.log('\nEvent Timeline:')
    lead.events.forEach((event, i) => {
      console.log(`${i + 1}. ${event.eventType}`)
      if (event.eventData) {
        console.log('   Data:', JSON.stringify(event.eventData))
      }
    })
    console.log('\n✅ All events successfully stitched to lead!')
  } else {
    console.log('❌ Lead not found')
  }

  await prisma.$disconnect()
}

main().catch(console.error)
