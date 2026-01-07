'use client'

import { useEffect, useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const images = [
  { src: '/images/gallery/5e9c8aba-a499-41a1-9071-f0a9d395839c.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/1a79bad6-ed3a-43b8-9038-55ce8c35d47c.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/c8ae913b-3dc7-4937-bb7b-24b88ea0c631.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/110ab4e3-b146-4c50-b190-349a8ccb12cd.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/3dd5b201-17e4-44c6-a526-ee5c4a791f5b.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/dd3f4be1-c91b-40c2-bdbc-2b22a6e7700c.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/260f6c05-8027-42a1-ab63-fec1236ceed0.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/3ce8e60b-07a7-458c-9442-b27c5b967ea4.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/b674e5f2-44cf-4ff2-a445-fb012012f212.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/eeb51b17-851b-4dab-85b8-d1060163241a.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/c4fb9722-81ee-4f9a-bc9e-b4e9a60e1d88.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/f5c74fa1-49af-4bb3-8766-af9542fb55b5.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/20240429_092500.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/IMG20251214154138.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/IMG20251214164539.jpg', alt: 'Kairos Transcultural 2023' },
  { src: '/images/gallery/IMG20251214164738.jpg', alt: 'Kairos Transcultural 2023' },
]

export function ImageCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }
    
    // Use requestAnimationFrame to defer initial state sync
    const frameId = requestAnimationFrame(onSelect)
    emblaApi.on('select', onSelect)
    
    return () => {
      cancelAnimationFrame(frameId)
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  // Auto-play
  useEffect(() => {
    if (!emblaApi) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [emblaApi])

  return (
    <section id="gallery" className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider text-center mb-2">
          Galerie
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-foreground">
          Imagini din edițiile anterioare
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Imagini din Kairos Transcultural 2023, 2024 și 2025
        </p>

        <div className="relative">
          {/* Carousel */}
          <div className="overflow-hidden rounded-xl" ref={emblaRef}>
            <div className="flex">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 relative aspect-[16/9]"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
            onClick={scrollPrev}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
            onClick={scrollNext}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
