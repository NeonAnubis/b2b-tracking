import Script from 'next/script'
import CheckoutContent from './CheckoutContent'

export default function CheckoutPage() {
  return (
    <>
      <Script
        src="/b2b-tracker.js"
        data-tracking-id="marketplace-demo-001"
        strategy="afterInteractive"
      />
      <CheckoutContent />
    </>
  )
}
