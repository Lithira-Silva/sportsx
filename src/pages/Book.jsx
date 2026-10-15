import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  LayoutGrid,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  X,
} from 'lucide-react'
import { Container, PageHero, btn } from '../components/ui'
import { useApp } from '../context/AppContext'
import { ADDONS, RATES } from '../data/site'
import {
  CLOSE,
  FACILITY_TYPES,
  LANES,
  OPEN,
  PITCHES,
  STEP,
  TIMES,
  facilityCost,
  findConflicts,
  fmtDate,
  fmtHourShort,
  fmtTime,
  seedBookings,
  selectionTracks,
  shiftDate,
  todayISO,
} from '../lib/booking'

const ROW = 28 // px per 30 minutes
const DRAFT_KEY = 'sx.draft'
const MAX_DAYS = 30
const DURATIONS = [60, 90, 120, 180]

const nowMinutes = () => {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}

function defaultDraft() {
  const next = Math.max(OPEN, Math.ceil((nowMinutes() + 1) / STEP) * STEP)
  const date = next + 60 > CLOSE ? shiftDate(todayISO(), 1) : todayISO()
  const start = date === todayISO() ? next : 18 * 60
  return { date, start, end: Math.min(start + 120, CLOSE), type: 'A', lanes: ['L1'], addons: {} }
}

function loadDraft() {
  try {
    const d = JSON.parse(sessionStorage.getItem(DRAFT_KEY))
    if (d && d.date >= todayISO() && PITCHES.some((p) => p.id === d.type || d.type === 'lanes')) return d
  } catch {
    /* ignore */
  }
  return defaultDraft()
}

// Horizontal position of a track inside its pitch column (lanes split Pitch B in thirds).
const trackBox = (track) => {
  const i = LANES.indexOf(track)
  return i === -1 ? { left: '0%', width: '100%' } : { left: `${(i * 100) / 3}%`, width: `${100 / 3}%` }
}
const trackPitch = (track) => (LANES.includes(track) ? 'B' : track)
const laneName = (l) => `Lane ${l.slice(1)}`

/* ---------- Pitch layout ---------- */

function Turf({ children }) {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#13241a_0%,#0c1510_70%)]">
      {/* mowing stripes */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.025)_0_28px,transparent_28px_56px)]" />
      {children}
    </div>
  )
}

function PitchStrip() {
  return (
    <div className="absolute left-1/2 top-[14%] h-[54%] w-[22%] -translate-x-1/2 rounded-sm bg-[#3a3122]/70">
      <span className="absolute inset-x-[-30%] top-[10%] h-px bg-white/40" />
      <span className="absolute inset-x-[-30%] bottom-[10%] h-px bg-white/40" />
      <span className="absolute left-1/2 top-[4%] h-[6%] w-[30%] -translate-x-1/2 border-x border-white/50" />
      <span className="absolute bottom-[4%] left-1/2 h-[6%] w-[30%] -translate-x-1/2 border-x border-white/50" />
    </div>
  )
}

function PitchLayout({ type, lanes, freeTracks, onType, onToggleLane }) {
  return (
    <div className="rounded-2xl border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <h2 className="flex items-center gap-3 font-display text-xl font-bold uppercase tracking-wide text-white">
          <LayoutGrid size={18} className="text-brand" /> Pitch layout
        </h2>
        <span className="text-xs font-medium text-zinc-500">Tap a pitch to select · Pitch B splits into 3 lanes</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 p-3 sm:gap-4 sm:p-6">
        {PITCHES.map((p) => {
          const lanesMode = p.id === 'B' && type === 'lanes'
          const active = type === p.id || lanesMode
          const free = lanesMode ? lanes.every((l) => freeTracks.includes(l)) : freeTracks.includes(p.id)
          return (
            <div
              key={p.id}
              className={`group relative h-48 overflow-hidden rounded-xl border-2 transition sm:h-72 xl:h-80 ${
                active ? 'border-brand shadow-xl shadow-brand/15' : 'border-line hover:border-zinc-600'
              }`}
            >
              <button
                onClick={() => onType(p.id)}
                aria-pressed={active}
                aria-label={`Select ${p.name}`}
                className="absolute inset-0"
              >
                <Turf>{!lanesMode && <PitchStrip />}</Turf>
              </button>

              {lanesMode && (
                <div className="absolute inset-x-1.5 top-1.5 bottom-16 grid grid-cols-3 gap-1 sm:inset-x-3 sm:top-3 sm:bottom-24 sm:gap-2">
                  {LANES.map((l, i) => {
                    const on = lanes.includes(l)
                    return (
                      <button
                        key={l}
                        onClick={() => onToggleLane(l)}
                        aria-pressed={on}
                        className={`flex flex-col items-center justify-center rounded-lg border-2 transition ${
                          on ? 'border-brand bg-brand/25 text-white' : 'border-white/10 bg-black/30 text-zinc-400 hover:border-white/30'
                        }`}
                      >
                        <span className="hidden text-[10px] font-bold uppercase tracking-widest sm:block">Lane</span>
                        <span className="font-display text-xl font-bold sm:text-3xl">{i + 1}</span>
                        <span className={`mt-1 grid h-5 w-5 place-items-center rounded-full ${on ? 'bg-brand' : 'border border-white/20'}`}>
                          {on && <Check size={12} />}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {active && !lanesMode && (
                <span className="pointer-events-none absolute right-2 top-2 grid h-6 w-6 sm:right-3 sm:top-3 sm:h-7 sm:w-7 place-items-center rounded-full bg-brand text-white shadow-lg">
                  <Check size={16} />
                </span>
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start justify-between gap-1.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 pt-8 sm:flex-row sm:items-end sm:p-4 sm:pt-10">
                <div>
                  <p className={`font-display text-lg font-bold uppercase sm:text-3xl ${active ? 'text-white' : 'text-zinc-300'}`}>{p.name}</p>
                  <p className="hidden text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 sm:block">{p.sub}</p>
                </div>
                {active && (
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                      free ? 'bg-emerald-500/20 text-emerald-300' : 'bg-brand/25 text-red-300'
                    }`}
                  >
                    {free ? 'Available' : 'Clash'}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Schedule ---------- */

const TONES = {
  booked: 'border-brand bg-brand/15 text-red-200',
  mine: 'border-emerald-400 bg-emerald-500/15 text-emerald-200',
  select: 'border-white bg-white/15 text-white ring-1 ring-inset ring-white/40',
  clash: 'border-amber-400 bg-amber-500/20 text-amber-100 ring-1 ring-inset ring-amber-400/50',
}

function Block({ track, start, end, tone, label }) {
  const h = ((end - start) / STEP) * ROW
  const narrow = LANES.includes(track)
  return (
    <div
      className={`pointer-events-none absolute overflow-hidden rounded-md border-l-[3px] px-2 py-1 ${TONES[tone]}`}
      style={{ top: ((start - OPEN) / STEP) * ROW + 2, height: h - 4, left: `calc(${trackBox(track).left} + 3px)`, width: `calc(${trackBox(track).width} - 6px)` }}
    >
      <p className="truncate text-[11px] font-extrabold uppercase leading-tight">{narrow ? laneName(track).replace('Lane ', 'L') : label}</p>
      {h > 40 && (
        <p className="truncate text-[10px] font-semibold opacity-80">
          {fmtTime(start).replace(':00', '')} – {fmtTime(end).replace(':00', '')}
        </p>
      )}
    </div>
  )
}

function Schedule({ date, setDate, bookings, selection, clash, laneMode, onPick }) {
  const scrollRef = useRef(null)
  const isToday = date === todayISO()
  const now = nowMinutes()
  const rows = (CLOSE - OPEN) / STEP
  const hours = TIMES.filter((t) => t % 60 === 0 && t < CLOSE)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: Math.max(0, ((selection.start - OPEN) / STEP) * ROW - ROW * 3), behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  const handleClick = (pitch, e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const minute = OPEN + Math.floor((e.clientY - rect.top) / ROW) * STEP
    const lane = LANES[Math.min(2, Math.floor(((e.clientX - rect.left) / rect.width) * 3))]
    onPick(pitch === 'B' && laneMode ? lane : pitch, minute)
  }

  return (
    <div className="rounded-2xl border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <h2 className="flex items-center gap-3 font-display text-xl font-bold uppercase tracking-wide text-white">
          <Clock size={18} className="text-brand" /> Live schedule
        </h2>
        <div className="flex items-center rounded-lg border border-line bg-ink p-1">
          <button
            onClick={() => setDate(shiftDate(date, -1))}
            disabled={isToday}
            aria-label="Previous day"
            className="grid h-8 w-8 place-items-center rounded-md text-zinc-300 transition hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-36 px-2 text-center text-sm font-bold text-white">
            {isToday ? 'Today, ' : ''}
            {fmtDate(date, { weekday: isToday ? undefined : 'short', day: 'numeric', month: 'short' })}
          </span>
          <button
            onClick={() => setDate(shiftDate(date, 1))}
            disabled={date >= shiftDate(todayISO(), MAX_DAYS)}
            aria-label="Next day"
            className="grid h-8 w-8 place-items-center rounded-md text-zinc-300 transition hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 pt-4 text-xs font-medium text-zinc-400 sm:px-6">
        {[
          ['border-brand bg-brand/20', 'Booked'],
          ['border-emerald-400 bg-emerald-500/20', 'Your booking'],
          ['border-white bg-white/20', 'Your selection'],
          ['border-zinc-600 bg-[repeating-linear-gradient(135deg,#3f3f46_0_2px,transparent_2px_5px)]', 'Past'],
        ].map(([c, l]) => (
          <span key={l} className="flex items-center gap-2">
            <i className={`h-3 w-3 rounded-sm border-l-[3px] ${c}`} />
            {l}
          </span>
        ))}
        <span className="ml-auto hidden text-zinc-500 md:block">Click an empty slot to move your selection there</span>
      </div>

      <div className="p-4 sm:p-6">
        <div ref={scrollRef} className="max-h-[620px] overflow-auto rounded-xl border border-line bg-ink">
          <div className="min-w-[520px]">
            {/* header */}
            <div className="sticky top-0 z-20 grid grid-cols-[64px_repeat(3,1fr)] border-b border-line bg-[#111114]/95 backdrop-blur">
              <div />
              {PITCHES.map((p) => (
                <div key={p.id} className="border-l border-line px-2 py-3 text-center">
                  <p className="text-sm font-extrabold uppercase tracking-wide text-white">{p.name}</p>
                  {p.splittable ? (
                    <div className="mt-1 grid grid-cols-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      {LANES.map((l) => (
                        <span key={l}>{l}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Full pitch</p>
                  )}
                </div>
              ))}
            </div>

            <div className="relative grid grid-cols-[64px_repeat(3,1fr)]" style={{ height: rows * ROW }}>
              {/* time labels */}
              <div className="relative">
                {hours.map((t) => (
                  <span
                    key={t}
                    className="absolute right-3 text-[11px] font-semibold tabular-nums text-zinc-500"
                    style={{ top: ((t - OPEN) / STEP) * ROW + 4 }}
                  >
                    {fmtHourShort(t)}
                  </span>
                ))}
              </div>

              {PITCHES.map((p) => {
                const items = bookings.filter((b) => trackPitch(b.facility) === p.id)
                const sel = selection.tracks.filter((t) => trackPitch(t) === p.id)
                return (
                  <div
                    key={p.id}
                    onClick={(e) => handleClick(p.id, e)}
                    className="relative cursor-pointer border-l border-line transition-colors hover:bg-white/[0.015]"
                    style={{
                      backgroundImage: `repeating-linear-gradient(to bottom, rgba(255,255,255,0.07) 0 1px, transparent 1px ${ROW}px, rgba(255,255,255,0.025) ${ROW}px ${ROW + 1}px, transparent ${ROW + 1}px ${ROW * 2}px)`,
                    }}
                  >
                    {p.splittable && (
                      <>
                        <span className="pointer-events-none absolute inset-y-0 left-1/3 border-l border-dashed border-white/[0.06]" />
                        <span className="pointer-events-none absolute inset-y-0 left-2/3 border-l border-dashed border-white/[0.06]" />
                      </>
                    )}
                    {isToday && now > OPEN && (
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.035)_0_2px,transparent_2px_8px)]"
                        style={{ height: Math.min(((now - OPEN) / STEP) * ROW, rows * ROW) }}
                      />
                    )}
                    {items.map((b) => (
                      <Block
                        key={b.id}
                        track={b.facility}
                        start={b.start}
                        end={b.end}
                        tone={b.mine ? 'mine' : 'booked'}
                        label={b.mine ? 'Your booking' : 'Booked'}
                      />
                    ))}
                    {selection.end > selection.start &&
                      sel.map((t) => (
                        <Block
                          key={`sel-${t}`}
                          track={t}
                          start={selection.start}
                          end={selection.end}
                          tone={clash ? 'clash' : 'select'}
                          label={clash ? 'Clash' : 'Selected'}
                        />
                      ))}
                  </div>
                )
              })}

              {/* current time line */}
              {isToday && now > OPEN && now < CLOSE && (
                <div
                  className="pointer-events-none absolute left-[64px] right-0 z-10 border-t-2 border-brand"
                  style={{ top: ((now - OPEN) / STEP) * ROW }}
                >
                  <span className="absolute -left-1.5 -top-[7px] h-3 w-3 rounded-full bg-brand" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Checkout modal ---------- */

function Checkout({ summary, onClose, onPaid }) {
  const [stage, setStage] = useState('review') // review | paying | done
  const [ref] = useState(() => `SX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && stage !== 'paying' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, stage])

  const pay = () => {
    setStage('paying')
    setTimeout(() => {
      onPaid(ref)
      setStage('done')
    }, 1400)
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => stage !== 'paying' && onClose()} />
      <div className="animate-fade-up relative w-full max-w-lg rounded-2xl border border-line bg-panel p-7 shadow-2xl sm:p-9">
        {stage !== 'paying' && (
          <button onClick={onClose} className="absolute right-5 top-5 text-zinc-400 hover:text-white" aria-label="Close">
            <X size={22} />
          </button>
        )}

        {stage === 'done' ? (
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
              <Check size={32} />
            </span>
            <h2 id="checkout-title" className="mt-6 font-display text-3xl font-bold uppercase text-white">Booking confirmed</h2>
            <p className="mt-2 text-zinc-400">
              Reference <span className="font-bold text-white">{ref}</span>. A confirmation has been sent to your email.
            </p>
            <div className="mt-6 rounded-xl border border-line bg-panel-2 p-4 text-left text-sm">
              <p className="font-bold text-white">{summary.facility}</p>
              <p className="text-zinc-400">
                {fmtDate(summary.date)} · {fmtTime(summary.start)} – {fmtTime(summary.end)}
              </p>
            </div>
            <button onClick={onClose} className={`${btn.primary} mt-8 w-full`}>Done</button>
          </div>
        ) : (
          <>
            <h2 id="checkout-title" className="font-display text-3xl font-bold uppercase text-white">Review & pay</h2>
            <p className="mt-1 text-sm text-zinc-400">Check your booking details before payment.</p>
            <dl className="mt-6 space-y-3 rounded-xl border border-line bg-panel-2 p-5 text-sm">
              {[
                ['Facility', summary.facility],
                ['Date', fmtDate(summary.date)],
                ['Time', `${fmtTime(summary.start)} – ${fmtTime(summary.end)} (${summary.hours} hr)`],
                ...summary.lines.map((l) => [l.label, `Rs. ${l.amount.toLocaleString()}`]),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-zinc-400">{k}</dt>
                  <dd className="text-right font-semibold text-white">{v}</dd>
                </div>
              ))}
              <div className="flex items-end justify-between border-t border-line pt-4">
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total</dt>
                <dd className="font-display text-3xl font-bold text-white">Rs. {summary.total.toLocaleString()}</dd>
              </div>
            </dl>
            <p className="mt-4 flex items-start gap-2 text-xs text-zinc-500">
              <ShieldCheck size={16} className="shrink-0 text-brand" />
              Payments are processed securely. All bookings are non-refundable.
            </p>
            <button onClick={pay} disabled={stage === 'paying'} className={`${btn.primary} mt-7 w-full`}>
              {stage === 'paying' ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Processing…
                </>
              ) : (
                `Pay Rs. ${summary.total.toLocaleString()}`
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ---------- Parameters panel ---------- */

function Section({ step, title, extra, children }) {
  return (
    <div className="border-t border-line px-5 py-5 first:border-t-0 sm:px-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.15em] text-zinc-300">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-brand/15 text-[10px] text-brand">{step}</span>
          {title}
        </p>
        {extra}
      </div>
      {children}
    </div>
  )
}

function TimeSelect({ id, label, value, options, onChange }) {
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full appearance-none rounded-lg border border-line bg-ink py-3 pl-3.5 pr-8 text-sm font-bold text-white outline-none transition hover:border-zinc-600 focus:border-brand"
        >
          {options.map((t) => (
            <option key={t} value={t} className="bg-panel">
              {fmtTime(t)}
            </option>
          ))}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" />
      </div>
    </div>
  )
}

/* ---------- Page ---------- */

export default function Book() {
  const navigate = useNavigate()
  const { user, bookings: myBookings, addBookings, notify } = useApp()
  const [draft, setDraft] = useState(loadDraft)
  const [showAddons, setShowAddons] = useState(false)
  const [checkout, setCheckout] = useState(null)
  const dateInput = useRef(null)

  const { date, start, end, type, lanes, addons } = draft
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    } catch {
      /* ignore */
    }
  }, [draft])

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => shiftDate(todayISO(), i)), [])

  const bookings = useMemo(
    () => [...seedBookings(date), ...myBookings.filter((b) => b.date === date).map((b) => ({ ...b, mine: true }))],
    [date, myBookings],
  )

  const tracks = selectionTracks(type, lanes)
  const range = { start, end }
  const conflicts = end > start ? findConflicts(bookings, tracks, range) : []
  const freeTracks = end > start ? ['A', 'B', 'C', ...LANES].filter((t) => findConflicts(bookings, [t], range).length === 0) : []
  const isPast = date === todayISO() && start < nowMinutes()

  let error = null
  if (end <= start) error = 'End time must be after the start time.'
  else if (type === 'lanes' && lanes.length === 0) error = 'Select at least one lane.'
  else if (isPast) error = 'That start time has already passed. Pick a later slot.'
  else if (conflicts.length) error = 'This time clashes with an existing booking. Try another time or pitch.'

  const hours = Math.max(0, (end - start) / 60)
  const facilityLabel =
    type === 'lanes' ? `Pitch B · ${lanes.map(laneName).join(', ')}` : `${FACILITY_TYPES.find((f) => f.id === type).label} (Full)`

  const lines = [{ label: `${type === 'lanes' ? `${lanes.length} lane${lanes.length === 1 ? '' : 's'}` : 'Full pitch'} × ${hours} hr`, amount: facilityCost(type, lanes, hours) }]
  ADDONS.forEach((a) => {
    const qty = addons[a.id] || 0
    if (qty) lines.push({ label: a.perHour ? `${a.name} × ${hours} hr` : `${a.name} × ${qty}`, amount: a.perHour ? a.price * hours : a.price * qty })
  })
  const total = lines.reduce((s, l) => s + l.amount, 0)
  const addonCount = Object.values(addons).filter(Boolean).length

  const pick = (track, minute) => {
    const s = Math.min(minute, CLOSE - STEP)
    const e = Math.min(s + Math.max(end - start, 60), CLOSE)
    if (LANES.includes(track)) set({ type: 'lanes', lanes: type === 'lanes' && lanes.includes(track) ? lanes : [...(type === 'lanes' ? lanes : []), track].sort(), start: s, end: e })
    else set({ type: track, start: s, end: e })
  }

  const chooseType = (t) => set({ type: t, lanes: t === 'lanes' && lanes.length === 0 ? ['L1'] : lanes })
  const toggleLane = (l) => set({ lanes: lanes.includes(l) ? lanes.filter((x) => x !== l) : [...lanes, l].sort() })

  const confirm = () => {
    if (error) return
    if (!user) {
      notify('Please log in to complete your booking', 'error')
      navigate('/login', { state: { from: '/book', notice: 'Secure your session to verify booking.' } })
      return
    }
    setCheckout({ facility: facilityLabel, date, start, end, hours, lines, total })
  }

  return (
    <>
      <PageHero
        badge="Live availability"
        badgeIcon={CalendarDays}
        title="Book your"
        accent="Pitch"
        text="Choose a pitch or individual lanes, pick your time on the live schedule and confirm in seconds."
      />

      <section className="py-10 sm:py-14">
        <Container className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0 space-y-6">
            <PitchLayout type={type} lanes={lanes} freeTracks={freeTracks} onType={(p) => chooseType(p === 'B' && type === 'lanes' ? 'lanes' : p)} onToggleLane={toggleLane} />
            <Schedule
              date={date}
              setDate={(d) => set({ date: d })}
              bookings={bookings}
              selection={{ start, end, tracks }}
              clash={conflicts.length > 0}
              laneMode={type === 'lanes'}
              onPick={pick}
            />
          </div>

          {/* Parameters */}
          <aside className="overflow-hidden rounded-2xl border border-line bg-panel xl:sticky xl:top-24">
            <div className="flex items-center justify-between bg-gradient-to-r from-brand/15 to-transparent px-5 py-4 sm:px-6">
              <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">Booking details</h2>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{hours ? `${hours} hr` : '—'}</span>
            </div>

            <Section
              step="1"
              title="Date"
              extra={
                <label className="relative cursor-pointer text-[11px] font-bold uppercase tracking-wider text-brand hover:underline">
                  More dates
                  <input
                    ref={dateInput}
                    type="date"
                    value={date}
                    min={todayISO()}
                    max={shiftDate(todayISO(), MAX_DAYS)}
                    onChange={(e) => e.target.value && set({ date: e.target.value })}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    className="absolute inset-0 cursor-pointer opacity-0 [color-scheme:dark]"
                    aria-label="Pick a date"
                  />
                </label>
              }
            >
              <div className="grid grid-cols-7 gap-1.5">
                {days.map((d, i) => {
                  const on = d === date
                  return (
                    <button
                      key={d}
                      onClick={() => set({ date: d })}
                      aria-pressed={on}
                      className={`flex flex-col items-center rounded-lg border py-2 transition ${
                        on ? 'border-brand bg-brand text-white shadow-lg shadow-brand/25' : 'border-line bg-ink text-zinc-400 hover:border-zinc-600 hover:text-white'
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider">{i === 0 ? 'Today' : fmtDate(d, { weekday: 'short' })}</span>
                      <span className="font-display text-lg font-bold leading-tight">{Number(d.slice(8))}</span>
                    </button>
                  )
                })}
              </div>
              {!days.includes(date) && (
                <p className="mt-2 text-xs font-semibold text-white">Selected: {fmtDate(date)}</p>
              )}
            </Section>

            <Section step="2" title="Time">
              <div className="flex items-end gap-2">
                <TimeSelect
                  id="start"
                  label="Start"
                  value={start}
                  options={TIMES.slice(0, -1)}
                  onChange={(v) => set({ start: v, end: Math.min(v + Math.max(end - start, 60), CLOSE) })}
                />
                <ArrowRight size={16} className="mb-3.5 shrink-0 text-zinc-600" />
                <TimeSelect id="end" label="End" value={end} options={TIMES.slice(1)} onChange={(v) => set({ end: v })} />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {DURATIONS.map((d) => {
                  const on = end - start === d
                  return (
                    <button
                      key={d}
                      onClick={() => set({ end: Math.min(start + d, CLOSE) })}
                      disabled={start + d > CLOSE}
                      className={`rounded-md border py-1.5 text-xs font-bold transition disabled:opacity-30 ${
                        on ? 'border-brand/60 bg-brand/15 text-white' : 'border-line text-zinc-400 hover:border-zinc-600 hover:text-white'
                      }`}
                    >
                      {d / 60} hr
                    </button>
                  )
                })}
              </div>
            </Section>

            <Section step="3" title="Facility">
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Facility">
                {FACILITY_TYPES.map((f) => {
                  const on = type === f.id
                  return (
                    <button
                      key={f.id}
                      role="radio"
                      aria-checked={on}
                      onClick={() => chooseType(f.id)}
                      className={`relative rounded-lg border p-3 text-left transition ${
                        on ? 'border-brand bg-brand/10' : 'border-line bg-ink hover:border-zinc-600'
                      }`}
                    >
                      <span className={`block text-sm font-extrabold uppercase ${on ? 'text-white' : 'text-zinc-300'}`}>{f.label}</span>
                      <span className="block text-[11px] text-zinc-500">
                        Rs. {f.rate.toLocaleString()} · {f.hint === 'Per lane' ? 'per lane/hr' : 'per hr'}
                      </span>
                      <span
                        className={`absolute right-2.5 top-2.5 grid h-4 w-4 place-items-center rounded-full border ${
                          on ? 'border-brand bg-brand' : 'border-zinc-600'
                        }`}
                      >
                        {on && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    </button>
                  )
                })}
              </div>
              {type === 'lanes' && (
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {LANES.map((l) => (
                    <button
                      key={l}
                      onClick={() => toggleLane(l)}
                      aria-pressed={lanes.includes(l)}
                      className={`rounded-md border py-2 text-xs font-bold uppercase tracking-wider transition ${
                        lanes.includes(l) ? 'border-brand bg-brand text-white' : 'border-line text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {laneName(l)}
                    </button>
                  ))}
                </div>
              )}
            </Section>

            <Section
              step="4"
              title="Extras"
              extra={
                <button
                  onClick={() => setShowAddons((s) => !s)}
                  aria-expanded={showAddons}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand"
                >
                  <ShoppingCart size={13} />
                  {addonCount ? `${addonCount} added` : 'Optional'}
                  <ChevronDown size={14} className={`transition ${showAddons ? 'rotate-180' : ''}`} />
                </button>
              }
            >
              {showAddons ? (
                <ul className="divide-y divide-line rounded-lg border border-line bg-ink">
                  {ADDONS.map((a) => {
                    const qty = addons[a.id] || 0
                    const setQty = (q) => set({ addons: { ...addons, [a.id]: Math.max(0, Math.min(a.perHour ? 1 : 20, q)) } })
                    return (
                      <li key={a.id} className="flex items-center justify-between gap-3 px-3.5 py-3">
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-white">{a.name}</span>
                          <span className="block text-[11px] text-zinc-500">
                            Rs. {a.price.toLocaleString()}
                            {a.perHour ? ' / hr' : ' each'}
                          </span>
                        </span>
                        {a.perHour ? (
                          <button
                            onClick={() => setQty(qty ? 0 : 1)}
                            role="switch"
                            aria-checked={!!qty}
                            aria-label={a.name}
                            className={`relative h-6 w-11 shrink-0 rounded-full transition ${qty ? 'bg-brand' : 'bg-zinc-700'}`}
                          >
                            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${qty ? 'left-[22px]' : 'left-0.5'}`} />
                          </button>
                        ) : (
                          <span className="flex shrink-0 items-center rounded-md border border-line">
                            <button onClick={() => setQty(qty - 1)} aria-label={`Fewer ${a.name}`} className="grid h-7 w-7 place-items-center text-zinc-400 hover:text-white">
                              <Minus size={13} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold tabular-nums text-white">{qty}</span>
                            <button onClick={() => setQty(qty + 1)} aria-label={`More ${a.name}`} className="grid h-7 w-7 place-items-center text-zinc-400 hover:text-white">
                              <Plus size={13} />
                            </button>
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-xs text-zinc-500">Bowling machine, balls and drinks.</p>
              )}
            </Section>

            {/* Summary */}
            <div className="border-t border-line bg-ink/50 px-5 py-5 sm:px-6">
              <p className="mb-3 text-sm font-bold text-white">{facilityLabel}</p>
              <p className="-mt-2 mb-4 text-xs text-zinc-500">
                {fmtDate(date, { weekday: 'short', day: 'numeric', month: 'short' })} · {fmtTime(start)} – {fmtTime(end)}
              </p>
              <dl className="space-y-1.5">
                {lines.map((l) => (
                  <div key={l.label} className="flex justify-between gap-4 text-xs">
                    <dt className="text-zinc-400">{l.label}</dt>
                    <dd className="font-semibold tabular-nums text-zinc-200">Rs. {l.amount.toLocaleString()}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex items-end justify-between border-t border-dashed border-line pt-4">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total</span>
                <span className="font-display text-3xl font-bold text-white">Rs. {total.toLocaleString()}</span>
              </div>
              <p className="mt-1 text-right text-[11px] text-zinc-500">
                Members pay Rs. {RATES.member.toLocaleString()}/hr with Elite coins
              </p>

              {error && (
                <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs font-medium text-amber-200">
                  <AlertTriangle size={15} className="mt-px shrink-0 text-amber-400" />
                  {error}
                </p>
              )}

              <button onClick={confirm} disabled={!!error} className={`${btn.primary} mt-5 w-full py-4 text-sm`}>
                {user ? 'Confirm & proceed to payment' : 'Log in to confirm'}
                <ArrowRight size={17} />
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-zinc-500">
                <ShieldCheck size={13} /> Full payment upfront · non-refundable
              </p>
              {!user && (
                <p className="mt-2 text-center text-xs text-zinc-500">
                  New here?{' '}
                  <Link to="/signup" state={{ from: '/book' }} className="font-bold text-white hover:text-brand">
                    Create an account
                  </Link>
                </p>
              )}
            </div>
          </aside>
        </Container>
      </section>

      {checkout && (
        <Checkout
          summary={checkout}
          onClose={() => setCheckout(null)}
          onPaid={(ref) => {
            addBookings(tracks.map((t) => ({ id: `${ref}-${t}`, ref, facility: t, date, start, end })))
            set({ addons: {} })
            notify(`Booking ${ref} confirmed`)
          }}
        />
      )}
    </>
  )
}
