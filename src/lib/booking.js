import { RATES } from '../data/site'

// All times are minutes from midnight. Opening hours 08:00 – 24:00, 30-minute grid.
export const OPEN = 8 * 60
export const CLOSE = 24 * 60
export const STEP = 30

// Pitch B can be booked in full or split into 3 lanes.
export const LANES = ['L1', 'L2', 'L3']

export const PITCHES = [
  { id: 'A', name: 'Pitch A', sub: 'Full pitch' },
  { id: 'B', name: 'Pitch B', sub: 'Full or 3 lanes', splittable: true },
  { id: 'C', name: 'Pitch C', sub: 'Full pitch' },
]

export const FACILITY_TYPES = [
  { id: 'A', label: 'Pitch A', hint: 'Full pitch', rate: RATES.full },
  { id: 'B', label: 'Pitch B', hint: 'Full pitch', rate: RATES.full },
  { id: 'C', label: 'Pitch C', hint: 'Full pitch', rate: RATES.full },
  { id: 'lanes', label: 'Pitch B lanes', hint: 'Per lane', rate: RATES.lane },
]

export const TIMES = Array.from({ length: (CLOSE - OPEN) / STEP + 1 }, (_, i) => OPEN + i * STEP)

export function fmtTime(min) {
  const h24 = Math.floor(min / 60) % 24
  const m = min % 60
  const ampm = h24 < 12 ? 'AM' : 'PM'
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`
}

export function fmtHourShort(min) {
  const h24 = Math.floor(min / 60) % 24
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h} ${h24 < 12 ? 'AM' : 'PM'}`
}

export const toISODate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const todayISO = () => toISODate(new Date())

export const shiftDate = (iso, days) => {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export const fmtDate = (iso, opts = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en', opts)

const overlaps = (a, b) => a.start < b.end && b.start < a.end

// Demo data until a backend exists: stable pseudo-random bookings per date.
function hash(str) {
  let h = 2166136261
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0
  return h
}

export function seedBookings(date) {
  const out = []
  const r = (k, n) => hash(`${date}:${k}`) % n
  const evening = (id, from) => {
    let t = from + r(`${id}0`, 4) * 30
    for (let i = 0; i < 3 && t < CLOSE; i++) {
      const len = (1 + r(`${id}${i}`, 3)) * 60
      out.push({ id: `s-${id}-${i}`, facility: id, date, start: t, end: Math.min(t + len, CLOSE) })
      t += len + (1 + r(`${id}g${i}`, 3)) * 30
    }
  }
  evening('A', 16 * 60)
  evening('C', 17 * 60)
  const b = 19 * 60 + r('b0', 3) * 30
  out.push({ id: 's-B-0', facility: 'B', date, start: b, end: b + 90 })
  LANES.forEach((lane, i) => {
    const s = 9 * 60 + r(`l${i}`, 12) * 30
    out.push({ id: `s-${lane}`, facility: lane, date, start: s, end: s + 60 + r(`ll${i}`, 2) * 60 })
  })
  return out
}

// Which tracks a selection occupies.
export const selectionTracks = (type, lanes) => (type === 'lanes' ? lanes : [type])

// Bookings that clash with a requested set of tracks + range.
export function findConflicts(bookings, tracks, range) {
  return bookings.filter((b) => {
    if (!overlaps(b, range)) return false
    if (tracks.includes(b.facility)) return true
    // Pitch B full and its lanes are mutually exclusive
    if (tracks.includes('B') && LANES.includes(b.facility)) return true
    if (b.facility === 'B' && tracks.some((c) => LANES.includes(c))) return true
    return false
  })
}

export function facilityCost(type, lanes, hours) {
  if (type === 'lanes') return lanes.length * RATES.lane * hours
  return RATES.full * hours
}
