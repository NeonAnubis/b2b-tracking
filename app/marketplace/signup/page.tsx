import Script from 'next/script'
import SignUpContent from './SignUpContent'

export default function SignUpPage() {
  return (
    <>
      <Script
        src="/b2b-tracker.js"
        data-tracking-id="marketplace-demo-001"
        strategy="afterInteractive"
      />
      <SignUpContent />
    </>
  )
}
