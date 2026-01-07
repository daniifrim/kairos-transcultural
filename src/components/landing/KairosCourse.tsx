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
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Cursul Kairos
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Concentrându-se pe dimensiunea{' '}
              <strong>biblică</strong>, <strong>istorică</strong>,{' '}
              <strong>strategică</strong> și <strong>culturală</strong>{' '}
              a misiunii, Kairos este un curs interactiv care cuprinde nouă sesiuni.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {dimensions.map((dim) => (
                <div
                  key={dim.title}
                  className="p-4 rounded-lg border border-border/60 bg-muted/50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <dim.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{dim.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{dim.description}</p>
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
