import Script from 'next/script'
import SignInContent from './SignInContent'

export default function SignInPage() {
  return (
    <>
      <Script
        src="/b2b-tracker.js"
        data-tracking-id="marketplace-demo-001"
        strategy="afterInteractive"
      />
      <SignInContent />
    </>
  )
}
