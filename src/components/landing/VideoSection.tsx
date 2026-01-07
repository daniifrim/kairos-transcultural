export function VideoSection() {
  return (
    <section id="video" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider text-center mb-2">
          Experimentează Misiunea în Mod Practic
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
          Kairos Transcultural
        </h3>
        
        <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Experimentează frumusețea și profunzimea misiunii creștine. Apropie-te de o 
          cultură diferită, câștigă o înțelegere mai profundă a aspectelor teoretice și 
          practice ale muncii de misiune și conectează-te cu oameni care se închină în 
          moduri unice și inspiratoare.
        </p>

        {/* YouTube Video Embed */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/MX4TwS69Rxk?rel=0"
            title="Kairos Transcultural Promo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
