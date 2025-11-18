import Script from 'next/script'
import CartContent from './CartContent'

export default function CartPage() {
  return (
    <>
      <Script
        src="/b2b-tracker.js"
        data-tracking-id="marketplace-demo-001"
        strategy="afterInteractive"
      />
      <CartContent />
    </>
  )
}
