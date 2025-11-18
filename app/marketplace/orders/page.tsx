import Script from 'next/script'
import OrdersContent from './OrdersContent'

export const metadata = {
  title: 'My Orders - MarketHub',
  description: 'View and track your orders on MarketHub'
}

export default function OrdersPage() {
  return (
    <>
      <Script
        src="/b2b-tracker.js"
        data-tracking-id="marketplace-demo-001"
        strategy="afterInteractive"
      />
      <OrdersContent />
    </>
  )
}
