import { useMemo, useState } from 'react'
import { CalendarDays, Check, Clock, Coins, Trash2 } from 'lucide-react'
import { HOURS, PITCHES } from '../data/site'
import { Reveal, SectionTitle } from './ui'

const DAYS_AHEAD = 7
const fmtHour = (h) => `${String(h % 24).padStart(2, '0')}:00`
const dateKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

// Demo availability until a backend exists: stable pseudo-random "booked" slots.
function isBooked(pitchId, key, hour) {
  let h = 0
  for (const c of `${pitchId}${key}${hour}`) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h % 100 < 28
}

export default function Booking({ onConfirm }) {
  const days = useMemo(() => {
    const base = new Date()
    base.setHours(0, 0, 0, 0)
    return Array.from({ length: DAYS_AHEAD }, (_, i) => {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      return d
    })
  }, [])

  const [pitch, setPitch] = useState(PITCHES[0])
  const [day, setDay] = useState(days[0])
  const [selected, setSelected] = useState([])

  const key = dateKey(day)
  const isToday = key === dateKey(days[0])
  const nowHour = new Date().getHours()

  const reset = (fn) => (v) => {
    fn(v)
    setSelected([])
  }

  const toggle = (h) =>
    setSelected((s) => (s.includes(h) ? s.filter((x) => x !== h) : [...s, h].sort((a, b) => a - b)))

  const total = selected.length * pitch.rate

  return (
    <section id="book" className="border-y border-line bg-gradient-to-b from-ink to-[#0e0e11] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Live availability"
          title="Book your pitch"
          sub="Pick a lane, choose your day and tap the hours you want. Booked slots are greyed out."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <Reveal className="rounded-2xl border border-line bg-panel p-5 sm:p-8">
            {/* Pitch */}
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">1 · Select lane</p>
            <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Lane">
              {PITCHES.map((p) => (
                <button
                  key={p.id}
                  role="radio"
                  aria-checked={pitch.id === p.id}
                  onClick={() => reset(setPitch)(p)}
                  className={`rounded-xl border p-4 text-left transition ${
                    pitch.id === p.id
                      ? 'border-brand bg-brand/10 ring-1 ring-brand'
                      : 'border-line bg-panel-2 hover:border-zinc-600'
                  }`}
                >
                  <span className="block font-extrabold uppercase text-white">{p.name}</span>
                  <span className="mt-1 block text-sm text-zinc-400">
                    {p.type} · Rs. {p.rate.toLocaleString()}/hr
                  </span>
                </button>
              ))}
            </div>

            {/* Date */}
            <p className="mb-3 mt-9 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">2 · Choose date</p>
            <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2">
              {days.map((d, i) => {
                const active = dateKey(d) === key
                return (
                  <button
                    key={d.toISOString()}
                    onClick={() => reset(setDay)(d)}
                    aria-pressed={active}
                    className={`flex min-w-[72px] flex-col items-center rounded-xl border px-3 py-3 transition ${
                      active ? 'border-brand bg-brand text-white' : 'border-line bg-panel-2 text-zinc-300 hover:border-zinc-600'
                    }`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                      {i === 0 ? 'Today' : d.toLocaleDateString('en', { weekday: 'short' })}
                    </span>
                    <span className="font-display text-2xl font-bold">{d.getDate()}</span>
                    <span className="text-[11px] uppercase opacity-70">{d.toLocaleDateString('en', { month: 'short' })}</span>
                  </button>
                )
              })}
            </div>

            {/* Slots */}
            <div className="mb-3 mt-9 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">3 · Pick time slots</p>
              <div className="flex gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm border border-line bg-panel-2" />Open</span>
                <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-brand" />Selected</span>
                <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-zinc-800" />Booked</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
              {HOURS.map((h) => {
                const past = isToday && h <= nowHour
                const booked = isBooked(pitch.id, key, h)
                const disabled = past || booked
                const on = selected.includes(h)
                return (
                  <button
                    key={h}
                    disabled={disabled}
                    onClick={() => toggle(h)}
                    aria-pressed={on}
                    className={`rounded-lg border py-3 text-sm font-bold tabular-nums transition ${
                      disabled
                        ? 'cursor-not-allowed border-transparent bg-zinc-800/70 text-zinc-600 line-through'
                        : on
                          ? 'border-brand bg-brand text-white shadow-lg shadow-brand/25'
                          : 'border-line bg-panel-2 text-zinc-200 hover:border-brand/60 hover:text-white'
                    }`}
                  >
                    {fmtHour(h)}
                  </button>
                )
              })}
            </div>
          </Reveal>

          {/* Summary */}
          <Reveal className="h-fit rounded-2xl border border-line bg-panel p-6 sm:p-8 lg:sticky lg:top-24">
            <h3 className="font-display text-2xl font-bold uppercase text-white">Booking summary</h3>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-zinc-400"><Check size={16} />Lane</dt>
                <dd className="font-semibold text-white">{pitch.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-zinc-400"><CalendarDays size={16} />Date</dt>
                <dd className="font-semibold text-white">
                  {day.toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-zinc-400"><Clock size={16} />Slots</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {selected.length === 0 && <span className="text-zinc-500">No slots selected yet</span>}
                  {selected.map((h) => (
                    <button
                      key={h}
                      onClick={() => toggle(h)}
                      className="group flex items-center gap-1.5 rounded-md bg-brand/15 px-2.5 py-1 text-xs font-bold text-brand hover:bg-brand/25"
                      aria-label={`Remove ${fmtHour(h)}`}
                    >
                      {fmtHour(h)}–{fmtHour(h + 1)}
                      <Trash2 size={12} className="opacity-60 group-hover:opacity-100" />
                    </button>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="my-6 h-px bg-line" />

            <div className="flex items-end justify-between">
              <span className="text-sm text-zinc-400">Total ({selected.length} hr)</span>
              <span className="font-display text-4xl font-bold text-white">Rs. {total.toLocaleString()}</span>
            </div>
            {selected.length > 0 && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
                <Coins size={14} className="text-brand" />
                Or {selected.length} Elite coin{selected.length > 1 ? 's' : ''} for members
              </p>
            )}

            <button
              disabled={selected.length === 0}
              onClick={() => {
                onConfirm({ pitch, day, slots: selected, total })
                setSelected([])
              }}
              className="mt-7 w-full rounded-md bg-brand py-4 font-extrabold uppercase tracking-wider text-white shadow-xl shadow-brand/25 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
            >
              {selected.length === 0 ? 'Select a slot' : 'Confirm booking'}
            </button>
            <p className="mt-4 text-center text-xs text-zinc-500">Free cancellation up to 24 hours before your slot.</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
