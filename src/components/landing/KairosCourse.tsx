import { BookOpen, Globe, History, Users } from 'lucide-react'

const dimensions = [
  {
    icon: BookOpen,
    title: 'Biblică',
    description: 'Fundamentul scriptural al misiunii lui Dumnezeu',
  },
  {
    icon: History,
    title: 'Istorică',
    description: 'Evoluția mișcării misionare de-a lungul secolelor',
  },
  {
    icon: Globe,
    title: 'Strategică',
    description: 'Abordări eficiente pentru împlinirea Marii Trimiteri',
  },
  {
    icon: Users,
    title: 'Culturală',
    description: 'Înțelegerea și comunicarea între culturi diferite',
  },
]

export function KairosCourse() {
  return (
    <section id="course" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              Teoria
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Cursul Kairos
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Concentrându-se pe dimensiunea{' '}
              <strong>biblică</strong>, <strong>istorică</strong>,{' '}
              <strong>strategică</strong> și <strong>culturală</strong>{' '}
              a misiunii, Kairos este un curs interactiv care cuprinde nouă sesiuni.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {dimensions.map((dim) => (
                <div
                  key={dim.title}
                  className="flex items-start gap-3 p-4 rounded-lg bg-gray-50"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <dim.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{dim.title}</h3>
                    <p className="text-sm text-gray-600">{dim.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="/images/kairos-course.avif"
              alt="Studiu Kairos"
              className="rounded-xl shadow-lg w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
