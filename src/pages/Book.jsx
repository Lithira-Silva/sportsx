import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  COLUMNS,
  FACILITY_TYPES,
  LANES,
  OPEN,
  STEP,
  TIMES,
  facilityCost,
  findConflicts,
  fmtDate,
  fmtTime,
  lockedBlocks,
  seedBookings,
  selectionColumns,
  toISODate,
  todayISO,
} from '../lib/booking'

const ROW = 34 // px per 30 minutes
const DRAFT_KEY = 'sx.draft'
const MAX_DAYS = 30

const shiftDate = (iso, days) => {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}
const nowMinutes = () => {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}
const nextOpenSlot = () => Math.max(OPEN, Math.ceil((nowMinutes() + 1) / STEP) * STEP)

function defaultDraft() {
  const start = nextOpenSlot()
  const date = start + 60 > CLOSE ? shiftDate(todayISO(), 1) : todayISO()
  const s = date === todayISO() ? start : 18 * 60
  return { date, start: s, end: Math.min(s + 120, CLOSE), type: 'A', lanes: ['L1'], addons: {} }
}

function loadDraft() {
  try {
    const d = JSON.parse(sessionStorage.getItem(DRAFT_KEY))
    if (d && d.date >= todayISO()) return d
  } catch {
    /* ignore */
  }
  return defaultDraft()
}

function mergeIntervals(list) {
  const sorted = [...list].sort((a, b) => a.start - b.start)
  const out = []
  for (const b of sorted) {
    const last = out[out.length - 1]
    if (last && b.start <= last.end) last.end = Math.max(last.end, b.end)
    else out.push({ ...b })
  }
  return out
}

/* ---------- Pitch layout ---------- */

function PitchCard({ label, sub, active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex aspect-[4/5] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 transition sm:aspect-[5/6] ${
        active ? 'border-brand bg-brand/[0.08]' : 'border-line bg-panel-2 hover:border-zinc-600'
      }`}
    >
      {/* crease markings */}
      <span className="pointer-events-none absolute inset-x-[30%] top-[12%] h-px bg-white/10" />
      <span className="pointer-events-none absolute inset-x-[30%] bottom-[12%] h-px bg-white/10" />
      <span className="pointer-events-none absolute inset-y-[12%] left-1/2 w-[18%] -translate-x-1/2 rounded bg-white/[0.03]" />
      {children}
      <span className={`relative font-display text-4xl font-bold uppercase sm:text-5xl ${active ? 'text-white' : 'text-zinc-500'}`}>
        {label}
      </span>
      <span className="relative mt-3 rounded-md border border-line bg-ink px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
        {sub}
      </span>
    </button>
  )
}

function PitchLayout({ type, lanes, onType, onToggleLane }) {
  const lanesMode = type === 'lanes'
  return (
    <div className="rounded-2xl border border-line bg-panel p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between border-b border-line pb-5">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white">Pitch layout</h2>
        <span className="text-xs font-semibold text-zinc-500">Tap a pitch or lane to select</span>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <PitchCard label="Pitch A" sub="Full pitch" active={type === 'A'} onClick={() => onType('A')} />
        {lanesMode ? (
          <div className="grid aspect-[4/5] grid-cols-3 gap-2 rounded-2xl border-2 border-brand/50 p-2 sm:aspect-[5/6]">
            {LANES.map((l, i) => {
              const on = lanes.includes(l)
              return (
                <button
                  key={l}
                  onClick={() => onToggleLane(l)}
                  aria-pressed={on}
                  className={`flex flex-col items-center justify-center rounded-xl border transition ${
                    on ? 'border-brand bg-brand/15 text-white' : 'border-line bg-panel-2 text-zinc-500 hover:border-zinc-600'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">Lane</span>
                  <span className="font-display text-3xl font-bold">{i + 1}</span>
                  {on && <Check size={16} className="mt-1 text-brand" />}
                </button>
              )
            })}
          </div>
        ) : (
          <PitchCard label="Pitch B" sub="Full pitch" active={type === 'B'} onClick={() => onType('B')} />
        )}
      </div>
    </div>
  )
}

/* ---------- Schedule timeline ---------- */

function Block({ start, end, tone, title, sub }) {
  const styles = {
    booked: 'border-brand/80 bg-brand/15 text-brand',
    locked: 'border-orange-500/80 bg-orange-500/10 text-orange-400',
    mine: 'border-emerald-500/80 bg-emerald-500/10 text-emerald-400',
    select: 'border-dashed border-white/80 bg-white/10 text-white',
    clash: 'border-dashed border-brand bg-brand/30 text-white',
  }
  return (
    <div
      className={`pointer-events-none absolute inset-x-1.5 flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 px-1 text-center ${styles[tone]}`}
      style={{ top: ((start - OPEN) / STEP) * ROW + 3, height: ((end - start) / STEP) * ROW - 6 }}
    >
      <span className="text-[11px] font-extrabold uppercase leading-tight sm:text-xs">{title}</span>
      {end - start > STEP && <span className="mt-0.5 text-[10px] font-bold uppercase opacity-80">{sub}</span>}
    </div>
  )
}

function Schedule({ date, setDate, bookings, selection, clash, onPick }) {
  const scrollRef = useRef(null)
  const isToday = date === todayISO()
  const pastEnd = isToday ? Math.min(Math.max(nowMinutes(), OPEN), CLOSE) : OPEN
  const rows = (CLOSE - OPEN) / STEP

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: Math.max(0, ((selection.start - OPEN) / STEP) * ROW - ROW * 2), behavior: 'smooth' })
    // only when date changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  const handleClick = (col, e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const slot = Math.floor((e.clientY - rect.top) / ROW)
    onPick(col, OPEN + slot * STEP)
  }

  return (
    <div className="rounded-2xl border border-line bg-panel p-5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white">Live schedule</h2>
          <p className="mt-1 text-sm text-zinc-500">Click any open cell to start a booking there.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDate(shiftDate(date, -1))}
            disabled={isToday}
            aria-label="Previous day"
            className="grid h-10 w-10 place-items-center rounded-md border border-line text-zinc-300 transition hover:border-zinc-500 disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="min-w-40 text-center text-sm font-bold text-white">
            {isToday ? 'Today · ' : ''}
            {fmtDate(date, { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
          <button
            onClick={() => setDate(shiftDate(date, 1))}
            disabled={date >= shiftDate(todayISO(), MAX_DAYS)}
            aria-label="Next day"
            className="grid h-10 w-10 place-items-center rounded-md border border-line text-zinc-300 transition hover:border-zinc-500 disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-zinc-400">
        <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm border-2 border-brand bg-brand/20" />Booked</span>
        <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm border-2 border-orange-500 bg-orange-500/20" />Locked (conflict)</span>
        <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm border-2 border-emerald-500 bg-emerald-500/20" />Your booking</span>
        <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm border-2 border-dashed border-white bg-white/20" />Your selection</span>
      </div>

      <div ref={scrollRef} className="max-h-[560px] overflow-auto rounded-xl border border-line bg-ink/60">
        <div className="min-w-[680px]">
          {/* header */}
          <div className="sticky top-0 z-20 grid grid-cols-[84px_repeat(5,1fr)] border-b border-line bg-[#111114]">
            <div className="py-4 text-center text-[11px] font-bold uppercase italic tracking-widest text-zinc-500">Time</div>
            {COLUMNS.map((c) => (
              <div key={c.id} className="border-l border-line py-4 text-center text-xs font-extrabold uppercase tracking-wide text-white">
                {c.label}
              </div>
            ))}
          </div>

          <div className="relative grid grid-cols-[84px_repeat(5,1fr)]" style={{ height: rows * ROW }}>
            {/* time labels */}
            <div className="relative">
              {TIMES.slice(0, -1).map((t) => (
                <span
                  key={t}
                  className={`absolute right-3 -translate-y-1/2 text-[11px] font-bold tabular-nums ${t % 60 ? 'text-zinc-600' : 'text-zinc-400'}`}
                  style={{ top: ((t - OPEN) / STEP) * ROW }}
                >
                  {t === OPEN ? '' : fmtTime(t).replace(':00 ', ' ')}
                </span>
              ))}
            </div>

            {COLUMNS.map((c) => {
              const own = bookings.filter((b) => b.facility === c.id)
              const locked = mergeIntervals(lockedBlocks(bookings, c.id))
              const selected = selection.columns.includes(c.id)
              return (
                <div
                  key={c.id}
                  className="relative cursor-pointer border-l border-line transition-colors hover:bg-white/[0.02]"
                  style={{
                    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${ROW - 1}px, rgba(255,255,255,0.05) ${ROW - 1}px ${ROW}px)`,
                  }}
                  onClick={(e) => handleClick(c.id, e)}
                  role="button"
                  aria-label={`${c.label} column, click to select a start time`}
                >
                  {pastEnd > OPEN && (
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0_6px,transparent_6px_12px)]"
                      style={{ height: ((pastEnd - OPEN) / STEP) * ROW }}
                    />
                  )}
                  {locked.map((b, i) => (
                    <Block key={`l${i}`} start={b.start} end={b.end} tone="locked" title="Locked" sub="Conflict" />
                  ))}
                  {own.map((b) => (
                    <Block
                      key={b.id}
                      start={b.start}
                      end={b.end}
                      tone={b.mine ? 'mine' : 'booked'}
                      title={b.mine ? 'Your booking' : 'Booked'}
                      sub={`${fmtTime(b.start)} - ${fmtTime(b.end)}`}
                    />
                  ))}
                  {selected && selection.end > selection.start && (
                    <Block
                      start={selection.start}
                      end={selection.end}
                      tone={clash ? 'clash' : 'select'}
                      title={clash ? 'Unavailable' : 'Your selection'}
                      sub={`${fmtTime(selection.start)} - ${fmtTime(selection.end)}`}
                    />
                  )}
                </div>
              )
            })}
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

/* ---------- Page ---------- */

export default function Book() {
  const navigate = useNavigate()
  const { user, bookings: myBookings, addBookings, notify } = useApp()
  const [draft, setDraft] = useState(loadDraft)
  const [showAddons, setShowAddons] = useState(false)
  const [checkout, setCheckout] = useState(null)

  const { date, start, end, type, lanes, addons } = draft
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    } catch {
      /* ignore */
    }
  }, [draft])

  const bookings = useMemo(
    () => [...seedBookings(date), ...myBookings.filter((b) => b.date === date).map((b) => ({ ...b, mine: true }))],
    [date, myBookings],
  )

  const columns = selectionColumns(type, lanes)
  const conflicts = end > start ? findConflicts(bookings, columns, { start, end }) : []
  const isPast = date === todayISO() && start < nowMinutes()

  let error = null
  if (end <= start) error = 'End time must be after the start time.'
  else if (type === 'lanes' && lanes.length === 0) error = 'Select at least one lane.'
  else if (isPast) error = 'That start time has already passed. Pick a later slot.'
  else if (conflicts.length) error = 'Your selection overlaps an existing booking. Choose another time or facility.'

  const hours = Math.max(0, (end - start) / 60)
  const facilityLabel =
    type === 'lanes'
      ? `Pitch B · Lane${lanes.length > 1 ? 's' : ''} ${lanes.map((l) => l.slice(1)).join(', ')}`
      : FACILITY_TYPES.find((f) => f.id === type).label

  const lines = [{ label: 'Facility cost', amount: facilityCost(type, lanes, hours) }]
  ADDONS.forEach((a) => {
    const qty = addons[a.id] || 0
    if (qty) lines.push({ label: `${a.name}${a.perHour ? '' : ` × ${qty}`}`, amount: a.perHour ? a.price * hours : a.price * qty })
  })
  const total = lines.reduce((s, l) => s + l.amount, 0)

  const pick = (col, minute) => {
    const s = Math.min(minute, CLOSE - STEP)
    const e = Math.min(s + Math.max(end - start, 60), CLOSE)
    if (LANES.includes(col)) {
      const next = type === 'lanes' ? (lanes.includes(col) ? lanes : [...lanes, col].sort()) : [col]
      set({ type: 'lanes', lanes: next, start: s, end: e })
    } else set({ type: col, start: s, end: e })
  }

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

  const field = 'w-full rounded-lg border border-line bg-ink px-4 py-3.5 font-bold text-white outline-none transition focus:border-brand'

  return (
    <>
      <PageHero
        badge="Live availability"
        badgeIcon={CalendarDays}
        title="Book your"
        accent="Pitch"
        text="Choose a full pitch or an individual lane, pick your time on the live schedule and confirm in seconds."
      />

      <section className="py-12 sm:py-16">
        <Container className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0 space-y-8">
            <PitchLayout
              type={type}
              lanes={lanes}
              onType={(t) => set({ type: t })}
              onToggleLane={toggleLane}
            />
            <Schedule
              date={date}
              setDate={(d) => set({ date: d })}
              bookings={bookings}
              selection={{ start, end, columns }}
              clash={conflicts.length > 0}
              onPick={pick}
            />
          </div>

          {/* Parameters */}
          <aside className="rounded-2xl border border-line bg-panel p-6 sm:p-7 lg:sticky lg:top-24">
            <h2 className="border-b border-line pb-5 font-display text-2xl font-bold uppercase tracking-wide text-white">Parameters</h2>

            <label className="mt-6 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              min={todayISO()}
              max={shiftDate(todayISO(), MAX_DAYS)}
              onChange={(e) => e.target.value && set({ date: e.target.value })}
              className={`${field} mt-2 [color-scheme:dark]`}
            />

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ['Start', 'start', TIMES.slice(0, -1)],
                ['End', 'end', TIMES.slice(1)],
              ].map(([label, key, opts]) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-center text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                    {label}
                  </label>
                  <div className="relative mt-2">
                    <select
                      id={key}
                      value={draft[key]}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        if (key === 'start') set({ start: v, end: Math.max(end, Math.min(v + 60, CLOSE)) })
                        else set({ end: v })
                      }}
                      className={`${field} appearance-none text-center`}
                    >
                      {opts.map((t) => (
                        <option key={t} value={t} className="bg-panel">
                          {fmtTime(t)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Facility type</p>
            <div className="mt-2 space-y-2.5" role="radiogroup" aria-label="Facility type">
              {FACILITY_TYPES.map((f) => (
                <button
                  key={f.id}
                  role="radio"
                  aria-checked={type === f.id}
                  onClick={() => set({ type: f.id, lanes: f.id === 'lanes' && lanes.length === 0 ? ['L1'] : lanes })}
                  className={`flex w-full items-center justify-between rounded-lg border px-4 py-3.5 text-sm font-extrabold uppercase tracking-wider transition ${
                    type === f.id ? 'border-brand bg-brand/10 text-brand' : 'border-line bg-ink text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  {f.label}
                  <span className="text-xs font-semibold normal-case tracking-normal text-zinc-500">
                    Rs. {(f.id === 'lanes' ? RATES.lane : RATES.full).toLocaleString()}/hr{f.id === 'lanes' ? '/lane' : ''}
                  </span>
                </button>
              ))}
            </div>

            {type === 'lanes' && (
              <div className="mt-3 flex gap-2">
                {LANES.map((l, i) => (
                  <button
                    key={l}
                    onClick={() => toggleLane(l)}
                    aria-pressed={lanes.includes(l)}
                    className={`flex-1 rounded-md border py-2 text-xs font-bold uppercase tracking-wider transition ${
                      lanes.includes(l) ? 'border-brand bg-brand text-white' : 'border-line text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    Lane {i + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Optional items */}
            <div className="mt-6 rounded-xl border border-line">
              <button
                onClick={() => setShowAddons((s) => !s)}
                aria-expanded={showAddons}
                className="flex w-full items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-wider text-white"
              >
                <ShoppingCart size={16} className="text-zinc-400" />
                {showAddons ? 'Hide optional items' : 'Add optional items'}
                {Object.values(addons).some(Boolean) && (
                  <span className="rounded-full bg-brand px-2 py-0.5 text-[10px]">{Object.values(addons).filter(Boolean).length}</span>
                )}
              </button>
              {showAddons && (
                <ul className="space-y-3 border-t border-line p-4">
                  {ADDONS.map((a) => {
                    const qty = addons[a.id] || 0
                    const setQty = (q) => set({ addons: { ...addons, [a.id]: Math.max(0, Math.min(a.perHour ? 1 : 20, q)) } })
                    return (
                      <li key={a.id} className="flex items-center justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-white">{a.name}</span>
                          <span className="block text-xs text-zinc-500">
                            Rs. {a.price.toLocaleString()}
                            {a.perHour ? '/hr' : ''} · {a.note}
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
                          <span className="flex shrink-0 items-center gap-2">
                            <button onClick={() => setQty(qty - 1)} aria-label={`Fewer ${a.name}`} className="grid h-7 w-7 place-items-center rounded border border-line text-zinc-300 hover:border-zinc-500">
                              <Minus size={14} />
                            </button>
                            <span className="w-5 text-center text-sm font-bold tabular-nums text-white">{qty}</span>
                            <button onClick={() => setQty(qty + 1)} aria-label={`More ${a.name}`} className="grid h-7 w-7 place-items-center rounded border border-line text-zinc-300 hover:border-zinc-500">
                              <Plus size={14} />
                            </button>
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {error && (
              <p role="alert" className="mt-5 flex items-start gap-2 rounded-lg border border-brand/40 bg-brand/10 p-3 text-sm text-red-300">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-brand" />
                {error}
              </p>
            )}

            <div className="mt-6 rounded-xl border border-line bg-ink/60 p-5">
              {lines.map((l) => (
                <div key={l.label} className="flex justify-between py-1.5 text-xs font-bold uppercase tracking-wider">
                  <span className="text-zinc-500">{l.label}</span>
                  <span className="text-white">Rs. {l.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="mt-3 flex items-end justify-between border-t border-line pt-4">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Total cost</span>
                <span className="font-display text-3xl font-bold text-white">Rs. {total.toLocaleString()}</span>
              </div>
              <p className="mt-3 text-[10px] font-bold uppercase leading-relaxed tracking-wider text-zinc-600">
                Note: all bookings require full payment upfront. Payments are strictly non-refundable.
              </p>
            </div>

            <button onClick={confirm} disabled={!!error} className={`${btn.primary} mt-6 w-full text-sm`}>
              {user ? 'Confirm & proceed to payment' : 'Log in to confirm booking'}
            </button>
            {!user && (
              <p className="mt-3 text-center text-xs text-zinc-500">
                New here?{' '}
                <Link to="/signup" state={{ from: '/book' }} className="font-bold text-white hover:text-brand">
                  Create an account
                </Link>
              </p>
            )}
          </aside>
        </Container>
      </section>

      {checkout && (
        <Checkout
          summary={checkout}
          onClose={() => setCheckout(null)}
          onPaid={(ref) => {
            addBookings(columns.map((c) => ({ id: `${ref}-${c}`, ref, facility: c, date, start, end })))
            set({ addons: {} })
            notify(`Booking ${ref} confirmed`)
          }}
        />
      )}
    </>
  )
}
