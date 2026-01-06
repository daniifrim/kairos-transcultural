import { Heart, Target, Users, Compass } from 'lucide-react'

const impacts = [
  {
    icon: Heart,
    title: 'Transformare personală',
    description: 'O schimbare profundă în perspectiva ta asupra misiunii',
  },
  {
    icon: Target,
    title: 'Claritate în chemarea',
    description: 'Înțelege locul tău în planul lui Dumnezeu',
  },
  {
    icon: Users,
    title: 'Comunitate',
    description: 'Conectează-te cu alți creștini pasionați de misiune',
  },
  {
    icon: Compass,
    title: 'Direcție',
    description: 'Pași concreți pentru implicare în misiune',
  },
]

export function Impact() {
  return (
    <section id="impact" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Impactul cursului Kairos
        </h2>
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-8">
          Alinează-ți viața cu Dumnezeu și misiunea Sa
        </p>
        
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Kairos este un curs interactiv ce cuprinde{' '}
          <strong>nouă sesiuni despre misiunea creștină mondială și locală</strong>. 
          Este conceput pentru a educa, inspira și provoca creștinii la o participare 
          activă și semnificativă la viziunea lui Dumnezeu de răscumpărare a întregii omeniri.
        </p>

        <div className="mb-12 max-w-4xl mx-auto">
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl shadow-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/AWqUW11QDco"
              title="Impactul cursului Kairos"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impacts.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
