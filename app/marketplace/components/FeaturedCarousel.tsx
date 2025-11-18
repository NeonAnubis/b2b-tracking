'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const featuredBanners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
    title: 'New Electronics Collection',
    subtitle: 'Latest tech gadgets and accessories',
    link: '/marketplace?category=Electronics'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80',
    title: 'Fashion Forward',
    subtitle: 'Discover timeless style pieces',
    link: '/marketplace?category=Fashion'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1920&q=80',
    title: 'Transform Your Space',
    subtitle: 'Premium home & living essentials',
    link: '/marketplace?category=Home%20%26%20Living'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80',
    title: 'Active Lifestyle',
    subtitle: 'Gear up for your next adventure',
    link: '/marketplace?category=Sports%20%26%20Outdoors'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80',
    title: 'Beauty & Wellness',
    subtitle: 'Self-care essentials for you',
    link: '/marketplace?category=Beauty%20%26%20Health'
  }
]

export default function FeaturedCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const handleBannerClick = (banner: typeof featuredBanners[0]) => {
    // Track banner click
    if (typeof window !== 'undefined' && (window as any).b2bTracker) {
      (window as any).b2bTracker.track('banner_click', {
        bannerId: banner.id,
        title: banner.title,
        category: banner.link
      })
    }
  }

  return (
    <section className="relative w-full bg-gray-50 py-0">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {featuredBanners.map((banner) => (
            <div key={banner.id} className="flex-[0_0_100%] min-w-0">
              <div className="relative h-[500px] w-full group cursor-pointer">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                  <div className="max-w-7xl mx-auto px-8 w-full">
                    <div className="max-w-xl">
                      <h2 className="text-5xl font-bold text-white mb-4 group-hover:translate-x-2 transition-transform">
                        {banner.title}
                      </h2>
                      <p className="text-2xl text-gray-200 mb-8">
                        {banner.subtitle}
                      </p>
                      <button
                        onClick={() => {
                          handleBannerClick(banner)
                          window.location.href = banner.link
                        }}
                        className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all transform hover:scale-105"
                      >
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {featuredBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === selectedIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
