import { ChevronRight, Trophy, Users } from 'lucide-react'
import { TOURNAMENTS } from '../data/site'
import { Reveal, SectionTitle } from './ui'

export default function Tournaments({ onRegister }) {
  return (
    <section id="tournaments" className="border-t border-line py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Compete" title="Upcoming tournaments" />
        <div className="grid gap-6 md:grid-cols-3">
          {TOURNAMENTS.map((t, i) => (
            <Reveal
              key={t.title}
              style={{ transitionDelay: `${i * 80}ms` }}
              className="group flex flex-col rounded-2xl border border-line bg-panel p-7 transition hover:-translate-y-1 hover:border-brand/60"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-lg bg-brand px-3 py-2 text-center font-display text-lg font-bold uppercase leading-tight text-white">
                  {t.date}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    t.status === 'Open' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-extrabold uppercase text-white">{t.title}</h3>
              <div className="mt-4 space-y-2 text-sm text-zinc-400">
                <p className="flex items-center gap-2"><Users size={16} />{t.format}</p>
                <p className="flex items-center gap-2"><Trophy size={16} className="text-brand" />{t.prize}</p>
              </div>
              <button
                onClick={() => onRegister(t)}
                className="mt-8 inline-flex items-center gap-1.5 self-start text-sm font-extrabold uppercase tracking-[0.15em] text-brand"
              >
                Register team
                <ChevronRight size={16} className="transition group-hover:translate-x-1" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
