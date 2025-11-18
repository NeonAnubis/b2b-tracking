import Script from 'next/script'
import ProductDetailContent from './ProductDetailContent'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Script
        src="/b2b-tracker.js"
        data-tracking-id="marketplace-demo-001"
        strategy="afterInteractive"
      />
      <ProductDetailContent productId={parseInt(params.id)} />
    </>
  )
}
