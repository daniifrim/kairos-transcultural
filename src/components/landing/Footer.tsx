'use client'

import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 px-4" style={{ backgroundColor: '#F6ECE6' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold mb-10" style={{ color: '#E16600' }}>Kairos Transcultural</h3>
          
          {/* Partner Logos */}
          <div className="flex flex-wrap justify-center items-center gap-12 mb-8">
            <img
              src="/images/apme-logo.png"
              alt="APME"
              className="h-16 object-contain"
            />
            <img
              src="/images/tlf-logo.png"
              alt="TLF"
              className="h-16 object-contain"
            />
          </div>

          <div className="text-sm" style={{ color: '#E16600' }}>
            <p>© {new Date().getFullYear()} Kairos Transcultural. Toate drepturile rezervate.</p>
            <a 
              href="/admin" 
              className="text-xs hover:underline block mt-2"
              style={{ color: '#E16600' }}
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}