import { FileText, Calendar, Euro, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

const details = [
  {
    icon: Calendar,
    title: 'Perioada',
    description: 'Două săptămâni intensive în Uganda',
  },
  {
    icon: Clock,
    title: 'Program',
    description: 'Cursul Kairos + Experiență practică în triburile Batwa',
  },
  {
    icon: Euro,
    title: 'Investiție',
    description: 'Detalii complete despre costuri în documentul de informații',
  },
]

export function PracticalDetails() {
  return (
    <section id="details" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Logistică
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Detalii Practice
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Toate informațiile importante despre costuri, program și pregătire
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {details.map((detail) => (
            <div
              key={detail.title}
              className="p-6 rounded-xl shadow-sm border border-border/60 bg-muted/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <detail.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {detail.title}
                </h3>
              </div>
              <p className="text-muted-foreground">{detail.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="gap-2"
            asChild
          >
            <a
              href="https://docs.google.com/document/d/1HEFN-WL13Zfssj022pHLFh-V_ogp6T0SWgFdlMthHw8/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText className="w-5 h-5" />
              Document cu Informații Complete
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
