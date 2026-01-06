'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Cum mă poate ajuta cursul Kairos creștin fiind?',
    answer:
      'Cursul Kairos te ajută să înțelegi planul lui Dumnezeu pentru lume și locul tău în acest plan. Vei descoperi fundamentul biblic al misiunii, vei învăța despre istoria mișcării misionare și vei primi instrumente practice pentru a te implica în misiune, indiferent de vocația ta profesională.',
  },
  {
    question: 'Cursul Kairos e doar pentru cei care vor să fie misionari?',
    answer:
      'Nu! Cursul Kairos este pentru toți creștinii care doresc să înțeleagă mai bine misiunea lui Dumnezeu. Indiferent dacă ești doctor, inginer, profesor sau lucrezi în orice alt domeniu, vei descoperi cum poți participa la misiunea lui Dumnezeu din locul în care ești.',
  },
  {
    question: 'Cum ar fi util acest curs pentru biserica din care fac parte?',
    answer:
      'Cursul Kairos poate transforma viziunea bisericii tale despre misiune. Participanții revin cu o înțelegere profundă și o pasiune reînnoită, devenind catalizatori pentru implicarea întregii comunități în misiunea globală și locală.',
  },
  {
    question: 'Ce include experiența transculturală în Uganda?',
    answer:
      'Experiența include cursrul Kairos, vizite în comunitățile Batwa, participarea la activități misionare practice și oportunități de a experimenta direct ce înseamnă misiunea transculturală.',
  },
  {
    question: 'Care sunt cerințele pentru participare?',
    answer:
      'Participanții trebuie să aibă pașaport valid, să completeze formularul de înscriere și să fie dispuși să participe activ la toate sesiunile cursului și la experiența transculturală. Vârsta minimă este de 18 ani.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-16 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">
          Întrebări Frecvente
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-lg px-6 shadow-sm border-none"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4 text-gray-900">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
