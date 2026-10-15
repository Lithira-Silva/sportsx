import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronDown, ChevronRight, Clock, MapPin, Phone, ShieldCheck, Target, Trophy, Zap } from 'lucide-react'
import Membership from '../components/Membership'
import { Container, PageHero, Reveal, SectionTitle } from '../components/ui'
import { BRAND, FACILITY_CARDS, FAQS } from '../data/site'

const ICONS = { trophy: Trophy, target: Target, zap: Zap }

const INFO = [
  { icon: Clock, label: `Opening hours: ${BRAND.hours}` },
  { icon: ShieldCheck, label: 'Verified safety standards' },
  { icon: MapPin, label: BRAND.address },
  { icon: Phone, label: BRAND.phone },
]

function Faq({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-line bg-panel">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold text-white"
      >
        {q}
        <ChevronDown size={20} className={`shrink-0 text-brand transition ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <p className="overflow-hidden px-6 text-zinc-400">
          <span className="block pb-5">{a}</span>
        </p>
      </div>
    </div>
  )
}

export default function Pricing() {
  return (
    <>
      <PageHero
        center
        badge="Professional standards"
        badgeIcon={ShieldCheck}
        title="Pricing &"
        accent="Facilities"
        text="Discover our world-class indoor cricket facilities. Whether you're a professional sharpening your skills or a group of friends wanting a competitive game, we have the perfect pitch for you."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            {FACILITY_CARDS.map((c, i) => {
              const Icon = ICONS[c.icon]
              return (
                <Reveal
                  key={c.title}
                  style={{ transitionDelay: `${i * 90}ms` }}
                  className={`relative flex flex-col rounded-[2rem] border p-8 ${
                    c.featured ? 'border-brand/60 bg-gradient-to-b from-brand/10 to-panel shadow-2xl shadow-brand/10' : 'border-line bg-panel'
                  }`}
                >
                  {c.featured && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg shadow-brand/40">
                      Most popular
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`grid h-16 w-16 place-items-center rounded-2xl border ${
                        c.featured ? 'border-brand/30 bg-brand/15 text-brand' : 'border-line bg-ink text-zinc-300'
                      }`}
                    >
                      <Icon size={30} />
                    </span>
                    <div className="text-right">
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">{c.rateLabel}</p>
                      <p className="mt-1 font-display text-4xl font-bold text-white">
                        RS. <span className={c.featured ? 'text-brand' : ''}>{c.price.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-bold uppercase tracking-tight text-white">{c.title}</h3>
                  <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand">{c.sub}</p>
                  <p className="mt-5 text-sm leading-relaxed text-zinc-400">{c.text}</p>
                  <ul className="mt-7 space-y-3.5">
                    {c.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm font-semibold text-zinc-200">
                        <CheckCircle2 size={17} className={`shrink-0 ${c.featured ? 'text-brand' : 'text-zinc-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/book"
                    className={`group mt-10 inline-flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-black uppercase tracking-[0.15em] transition ${
                      c.featured
                        ? 'bg-brand text-white shadow-xl shadow-brand/30 hover:bg-brand-600'
                        : 'border border-line text-white hover:border-white/40 hover:bg-white/5'
                    }`}
                  >
                    Instant booking <ChevronRight size={16} className="transition group-hover:translate-x-1" />
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      <Membership cta={{ label: 'Get your coin card', to: '/signup' }} />

      <section id="info" className="border-y border-line">
        <Container className="grid grid-cols-2 lg:grid-cols-4">
          {INFO.map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-3 px-4 py-10 text-center ${i ? 'lg:border-l' : ''} ${
                i % 2 ? 'border-l' : ''
              } ${i < 2 ? 'border-b lg:border-b-0' : ''} border-line`}
            >
              <Icon size={22} className="text-zinc-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400">{label}</span>
            </div>
          ))}
        </Container>
      </section>

      <section id="faq" className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <SectionTitle eyebrow="Good to know" title="FAQs" center />
          <div className="space-y-3">
            {FAQS.map((f) => (
              <Faq key={f.q} {...f} />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
