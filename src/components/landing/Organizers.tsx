import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

const organizers = [
  {
    name: 'Florin Bucur',
    title: 'Coordonator bază misionară, Uganda',
    description:
      'Misionar responsabil de baza misionară din Uganda, cu peste 12 ani de experiență pe teren.',
    phone: '+447463913927',
    image: '/images/florin.png',
  },
  {
    name: 'Ionuț Bălan',
    title: 'Mobilizare APME & facilitator Kairos',
    description:
      'Lider în echipa de mobilizare APME, inițiator și principal facilitator al cursului Kairos în Uganda.',
    phone: '+40755673079',
    image: '/images/ionut.png',
  },
]

export function Organizers() {
  return (
    <section id="organizers" className="py-16 px-4 bg-white">
      <div id="signup"></div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Contact
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Organizatorii principali
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ia legătura cu persoanele cheie pentru a-ți exprima interesul pentru curs și călătoria în Uganda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {organizers.map((person) => (
            <div
              key={person.name}
              className="bg-gray-50 rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row gap-6"
            >
              <div className="md:w-1/3">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={person.image}
                    alt={`Portret ${person.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{person.name}</h3>
                  <p className="text-sm text-primary font-medium mt-1">{person.title}</p>
                  <p className="text-gray-600 mt-3">{person.description}</p>
                </div>

                <div>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                    asChild
                  >
                    <a
                      href={`https://wa.me/${person.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Contactează {person.name}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}