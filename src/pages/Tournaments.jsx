import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ChevronRight, Trophy, Users, Wallet, X } from 'lucide-react'
import { Container, PageHero, Reveal, btn } from '../components/ui'
import { useApp } from '../context/AppContext'
import { TOURNAMENTS } from '../data/site'
import { fmtDate, todayISO } from '../lib/booking'

const SQUAD = 7 // 6-a-side + 1 substitute

const RULES = [
  { icon: Users, title: 'Squad of 7', text: '6 players on the field plus 1 substitute.' },
  { icon: CalendarDays, title: 'Fixtures', text: 'Group stage and knockouts under floodlights.' },
  { icon: Wallet, title: 'Entry fee', text: 'Paid at registration to secure your team slot.' },
]

function RegisterModal({ t, onClose }) {
  const { user, notify } = useApp()
  const [players, setPlayers] = useState(() => Array(SQUAD).fill(''))

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const field =
    'w-full rounded-lg border border-line bg-ink px-4 py-3 text-white placeholder:text-zinc-600 outline-none transition focus:border-brand'

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-labelledby="reg-title">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          notify(`Team registered for ${t.title}. We'll contact you to confirm payment.`)
          onClose()
        }}
        className="animate-fade-up relative my-8 w-full max-w-2xl rounded-2xl border border-line bg-panel p-7 shadow-2xl sm:p-9"
      >
        <button type="button" onClick={onClose} className="absolute right-5 top-5 text-zinc-400 hover:text-white" aria-label="Close">
          <X size={22} />
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Team registration</p>
        <h2 id="reg-title" className="mt-2 font-display text-3xl font-bold uppercase text-white">{t.title}</h2>
        <p className="mt-1 text-sm text-zinc-400">
          {fmtDate(t.date)} · Entry Rs. {t.fee.toLocaleString()}
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <input required className={field} placeholder="Team name" />
          <input required className={field} placeholder="Captain name" defaultValue={user?.name ?? ''} />
          <input required type="tel" className={field} placeholder="Captain mobile" />
          <input required type="email" className={field} placeholder="Email" defaultValue={user?.email ?? ''} />
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Squad ({SQUAD} players)</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {players.map((p, i) => (
            <input
              key={i}
              required={i < 6}
              value={p}
              onChange={(e) => setPlayers((ps) => ps.map((x, j) => (j === i ? e.target.value : x)))}
              className={field}
              placeholder={i === 6 ? 'Substitute (optional)' : `Player ${i + 1}`}
            />
          ))}
        </div>

        <button className={`${btn.primary} mt-8 w-full`}>Submit registration</button>
      </form>
    </div>
  )
}

export default function Tournaments() {
  const [active, setActive] = useState(null)
  const open = TOURNAMENTS.filter((t) => t.date >= todayISO() && t.slotsLeft > 0)

  return (
    <>
      <PageHero
        badge="Official championship arena"
        badgeIcon={Trophy}
        title="Indoor cricket"
        accent="Tournaments"
        text="Assemble your squad of 7 (6-a-side + 1 substitute), register your team online, and compete for prestige and cash prize purses under professional floodlights."
      >
        <div className="animate-fade-up mt-10 grid gap-4 sm:grid-cols-3" style={{ animationDelay: '240ms' }}>
          {RULES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4 rounded-xl border border-line bg-panel/70 p-5 backdrop-blur">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand">
                <Icon size={18} />
              </span>
              <span>
                <span className="block text-sm font-extrabold uppercase text-white">{title}</span>
                <span className="block text-sm text-zinc-400">{text}</span>
              </span>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <div>
              <h2 className="font-display text-3xl font-bold uppercase text-white">Open tournaments</h2>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                Select an active tournament to register your team
              </p>
            </div>
            <span className="rounded-full border border-brand/40 bg-brand/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand">
              {open.length} active event{open.length === 1 ? '' : 's'}
            </span>
          </div>

          {open.length === 0 ? (
            <Reveal className="flex flex-col items-center rounded-3xl border border-line bg-panel px-6 py-20 text-center">
              <Trophy size={56} className="text-zinc-700" />
              <h3 className="mt-6 text-xl font-extrabold uppercase tracking-wider text-white">No open tournaments right now</h3>
              <p className="mt-2 max-w-md text-sm text-zinc-500">
                New tournament registrations open regularly. Stay tuned or book practice pitches in advance!
              </p>
              <Link to="/book" className={`${btn.primary} mt-8 text-sm`}>
                Book practice pitch <ChevronRight size={18} />
              </Link>
            </Reveal>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {open.map((t, i) => {
                const d = new Date(`${t.date}T00:00:00`)
                return (
                  <Reveal
                    key={t.id}
                    style={{ transitionDelay: `${i * 80}ms` }}
                    className="group flex flex-col gap-6 rounded-2xl border border-line bg-panel p-6 transition hover:border-brand/60 sm:flex-row sm:p-8"
                  >
                    <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/30">
                      <span className="text-xs font-bold uppercase tracking-widest">{d.toLocaleDateString('en', { month: 'short' })}</span>
                      <span className="font-display text-4xl font-bold leading-none">{d.getDate()}</span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-extrabold uppercase text-white">{t.title}</h3>
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                            t.slotsLeft <= 5 ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
                          }`}
                        >
                          {t.slotsLeft} slots left
                        </span>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
                        <p className="flex items-center gap-2"><Users size={16} />{t.format}</p>
                        <p className="flex items-center gap-2"><Trophy size={16} className="text-brand" />Prize {t.prize}</p>
                        <p className="flex items-center gap-2"><Wallet size={16} />Entry Rs. {t.fee.toLocaleString()}</p>
                        <p className="flex items-center gap-2"><CalendarDays size={16} />{fmtDate(t.date, { weekday: 'long' })}</p>
                      </div>
                      <button onClick={() => setActive(t)} className={`${btn.primary} mt-6 self-start px-6 py-3 text-sm`}>
                        Register team <ChevronRight size={16} />
                      </button>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          )}
        </Container>
      </section>

      {active && <RegisterModal t={active} onClose={() => setActive(null)} />}
    </>
  )
}
