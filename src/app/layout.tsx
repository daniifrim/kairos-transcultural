import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { Navbar } from "@/components/landing"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
})

export const metadata: Metadata = {
  title: "Kairos Transcultural 2026 | Uganda",
  description:
    "Două săptămâni în care poți să descoperi Misiunea lui Dumnezeu pentru Biserica Sa prin cursul Kairos și o experiență transculturală în triburile din Uganda.",
  keywords: [
    "Kairos",
    "misiune",
    "Uganda",
    "transcultural",
    "curs misionar",
    "Batwa",
  ],
  authors: [{ name: "Kairos Transcultural" }],
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
  },
  openGraph: {
    title: "Kairos Transcultural 2026 | Uganda",
    description:
      "Două săptămâni în care poți să descoperi Misiunea lui Dumnezeu pentru Biserica Sa prin cursul Kairos și o experiență transculturală în triburile din Uganda.",
    type: "website",
    locale: "ro_RO",
    images: [
      {
        url: '/images/hero-boat.jpg',
        width: 1920,
        height: 1080,
        alt: 'Kairos Transcultural 2026 - Uganda Mission',
      },
    ],
    siteName: "Kairos Transcultural",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Kairos Transcultural 2026 | Uganda",
    description:
      "Două săptămâni în care poți să descoperi Misiunea lui Dumnezeu pentru Biserica Sa prin cursul Kairos și o experiență transculturală în triburile din Uganda.",
    images: ['/images/hero-boat.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Suppress hydration warnings from browser extensions like Dashlane
                const originalError = console.error;
                console.error = function(...args) {
                  const message = args[0];
                  if (typeof message === 'string' && 
                      (message.includes('data-dashlane') || 
                       message.includes('hydration') ||
                       message.includes('Dashlane'))) {
                    return;
                  }
                  originalError.apply(console, args);
                };
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
