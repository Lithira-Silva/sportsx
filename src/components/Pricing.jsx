import { Check, Clock, MapPin, Phone } from 'lucide-react'
import { BRAND, PLANS } from '../data/site'
import { Reveal, SectionTitle } from './ui'

const INFO = [
  { icon: Clock, title: 'Opening hours', text: 'Every day · 06:00 – 24:00' },
  { icon: MapPin, title: 'Location', text: BRAND.address },
  { icon: Phone, title: 'Call us', text: BRAND.phone },
]

export default function Pricing({ onSelect }) {
  return (
    <section id="pricing" className="border-t border-line bg-[#0e0e11] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Simple pricing" title="Pricing & info" center />

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal
              key={p.name}
              style={{ transitionDelay: `${i * 80}ms` }}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                p.featured ? 'border-brand bg-gradient-to-b from-brand/15 to-panel lg:-translate-y-3' : 'border-line bg-panel'
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">
                  Best value
                </span>
              )}
              <h3 className="text-lg font-extrabold uppercase tracking-wider text-white">{p.name}</h3>
              <p className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold text-white">
                  {p.price ? `Rs. ${p.price.toLocaleString()}` : 'Let’s talk'}
                </span>
                {p.price && <span className="text-zinc-400">{p.unit}</span>}
              </p>
              <ul className="mt-8 space-y-3 text-sm text-zinc-300">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check size={16} className="shrink-0 text-brand" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onSelect(p)}
                className={`mt-10 rounded-md py-3.5 font-extrabold uppercase tracking-wider transition ${
                  p.featured ? 'bg-brand text-white hover:bg-brand-600' : 'border border-line text-white hover:border-white/40'
                }`}
              >
                {p.price ? 'Get started' : 'Contact us'}
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 grid gap-4 sm:grid-cols-3">
          {INFO.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4 rounded-xl border border-line bg-panel p-5">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand/15 text-brand">
                <Icon size={20} />
              </span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">{title}</span>
                <span className="block font-semibold text-white">{text}</span>
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
