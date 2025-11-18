import Script from 'next/script'
import MarketplaceLayout from './components/MarketplaceLayout'

export default function MarketplacePage() {
  return (
    <>
      <Script
        src="/b2b-tracker.js"
        data-tracking-id="marketplace-demo-001"
        strategy="afterInteractive"
      />
      <MarketplaceLayout />
    </>
  )
}
