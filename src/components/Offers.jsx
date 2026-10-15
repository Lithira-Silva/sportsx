import { ChevronRight, Crown, Grid3x3, ShoppingBag, Target } from 'lucide-react'
import { OFFERS } from '../data/site'
import { Reveal, SectionTitle } from './ui'

const ICONS = { grid: Grid3x3, target: Target, bag: ShoppingBag, crown: Crown }

export default function Offers() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="What we offer" />
        <div className="grid gap-6 md:grid-cols-2">
          {OFFERS.map((o, i) => {
            const Icon = ICONS[o.icon]
            return (
              <Reveal
                key={o.title}
                style={{ transitionDelay: `${i * 80}ms` }}
                className="group relative overflow-hidden rounded-2xl border border-line bg-panel p-8 transition-colors duration-300 hover:border-brand/60 sm:p-9"
              >
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <span className="grid h-14 w-14 place-items-center rounded-lg bg-brand/15 text-brand transition group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
                  <Icon size={24} />
                </span>
                <h3 className="mt-8 text-2xl font-extrabold uppercase tracking-tight text-white">{o.title}</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">{o.text}</p>
                <a
                  href={o.href}
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-[0.15em] text-brand"
                >
                  Explore
                  <ChevronRight size={16} className="transition group-hover:translate-x-1" />
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
