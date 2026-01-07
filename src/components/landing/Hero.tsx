'use client'

import { Button } from '@/components/ui/button'
import { MessageCircle, Info } from 'lucide-react'
import Link from 'next/link'

interface HeroProps {
  confirmedCount: number
  capacity: number
  isFull: boolean
}

export function Hero({ confirmedCount, capacity, isFull }: HeroProps) {
  return (
    <section id="hero" className="min-h-[80vh] flex flex-col lg:flex-row">
      {/* Image - First on mobile (50vh), right side on desktop */}
      <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto lg:min-h-full order-first lg:order-last">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/hero-boat.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 lg:bg-gradient-to-l lg:from-black/30 lg:via-transparent lg:to-black/50" />
        </div>
      </div>

      {/* Content - Second on mobile, left side on desktop */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white order-last lg:order-first">
        <div className="max-w-xl w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Kairos Transcultural 2026
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Două săptămâni în care poți{' '}
            <span className="text-primary font-semibold">
              să descoperi Misiunea lui Dumnezeu pentru Biserica Sa
            </span>{' '}
            prin cursul Kairos și o experiență transculturală în triburile din Uganda.
          </p>

          {/* Counter */}
          <div className="mb-8">
            <div className="inline-block bg-primary/10 border-2 border-primary/30 rounded-lg px-6 py-3">
              <p className="text-lg font-semibold text-foreground">
                Locuri ocupate:{' '}
                <span className={`${isFull ? 'text-destructive' : 'text-primary'}`}>
                  {confirmedCount}
                </span>
                <span className="text-muted-foreground"> / {capacity}</span>
              </p>
            </div>
          </div>

          {/* CTAs */}
          {isFull ? (
            <div className="bg-destructive text-white px-8 py-4 rounded-lg inline-block">
              <p className="text-xl font-bold">Locuri epuizate</p>
              <p className="text-sm opacity-90">Toate locurile au fost ocupate</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
              >
                <Link href="#signup">
                  Înscrie-te acum
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                asChild
              >
                <a
                  href="https://docs.google.com/document/d/1HEFN-WL13Zfssj022pHLFh-V_ogp6T0SWgFdlMthHw8/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Info className="w-5 h-5 mr-2" />
                  Mai multe informații
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
