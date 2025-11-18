import Script from 'next/script'
import CategoriesContent from './CategoriesContent'

export default function CategoriesPage() {
  return (
    <>
      <Script
        src="/b2b-tracker.js"
        data-tracking-id="marketplace-demo-001"
        strategy="afterInteractive"
      />
      <CategoriesContent />
    </>
  )
}
