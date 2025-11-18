import Script from 'next/script'
import ProductDetailContent from './ProductDetailContent'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params as required by Next.js 14.2+
  const { id } = await params

  return (
    <>
      <Script
        src="/b2b-tracker.js"
        data-tracking-id="marketplace-demo-001"
        strategy="afterInteractive"
      />
      <ProductDetailContent productId={parseInt(id)} />
    </>
  )
}
