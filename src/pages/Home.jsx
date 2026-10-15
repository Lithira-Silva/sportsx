import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck, Clock, Trophy, Wallet } from 'lucide-react'
import Hero from '../components/Hero'
import Offers from '../components/Offers'
import Membership from '../components/Membership'
import Gallery from '../components/Gallery'
import { Container, Reveal, SectionTitle, btn } from '../components/ui'
import { BRAND, STEPS } from '../data/site'

const QUICK = [
  { icon: CalendarCheck, label: 'Book a pitch', text: 'Live availability', to: '/book' },
  { icon: Trophy, label: 'Tournaments', text: 'Register your squad', to: '/tournaments' },
  { icon: Wallet, label: 'Pricing', text: 'From Rs. 1,500/hr', to: '/pricing' },
  { icon: Clock, label: 'Open daily', text: BRAND.hours, to: '/pricing#info' },
]

export default function Home() {
  return (
    <>
      <Hero />

      {/* Quick access bar overlapping the hero */}
      <Container className="relative z-10 -mt-12">
        <Reveal className="grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-panel/90 shadow-2xl backdrop-blur-xl lg:grid-cols-4">
          {QUICK.map(({ icon: Icon, label, text, to }, i) => (
            <Link
              key={label}
              to={to}
              className={`group flex items-center gap-4 p-5 transition hover:bg-white/[0.03] sm:p-6 ${
                i % 2 ? '' : 'border-r border-line'
              } ${i < 2 ? 'border-b border-line lg:border-b-0' : ''} ${i === 1 ? 'lg:border-r' : ''}`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand transition group-hover:bg-brand group-hover:text-white">
                <Icon size={20} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-extrabold uppercase tracking-wide text-white">{label}</span>
                <span className="block truncate text-xs text-zinc-400">{text}</span>
              </span>
            </Link>
          ))}
        </Reveal>
      </Container>

      <Offers />

      {/* How it works */}
      <section className="border-y border-line bg-[#0e0e11] py-24 sm:py-28">
        <Container>
          <SectionTitle
            eyebrow="Simple as 1-2-3"
            title="How booking works"
            action={
              <Link to="/book" className={btn.primary}>
                Start booking <ArrowRight size={18} />
              </Link>
            }
          />
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal
                key={s.n}
                style={{ transitionDelay: `${i * 90}ms` }}
                className="relative rounded-2xl border border-line bg-panel p-8"
              >
                <span className="font-display text-6xl font-bold text-brand/25">{s.n}</span>
                <h3 className="mt-4 text-xl font-extrabold uppercase text-white">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">{s.text}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 text-brand md:block" size={26} />
                )}
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Membership />
      <Gallery />
    </>
  )
}
