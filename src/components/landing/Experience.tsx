export function Experience() {
  return (
    <section id="experience" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative order-2 md:order-1">
            <img
              src="/images/batwa-tribe.avif"
              alt="Experiență transculturală în tribul Batwa"
              className="rounded-xl shadow-lg w-full object-cover aspect-[4/3]"
            />
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              Practica
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Experiență transculturală în tribul Batwa
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Cum poți înțelege o lume pe care nu ai văzut-o?
            </p>
            <p className="text-lg text-muted-foreground">
              Experiența transculturală în triburile Batwa din Uganda te va ajuta 
              să aprofundezi toate cele învățate în cursul Kairos. Vei avea 
              oportunitatea de a te conecta cu o comunitate unică, de a învăța 
              despre cultura lor și de a experimenta misiunea în mod practic.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
