import { RATES } from '../data/site'

// All times are minutes from midnight. Opening hours 08:00 – 24:00, 30-minute grid.
export const OPEN = 8 * 60
export const CLOSE = 24 * 60
export const STEP = 30

export const COLUMNS = [
  { id: 'A', label: 'Pitch A (Full)' },
  { id: 'B', label: 'Pitch B (Full)' },
  { id: 'L1', label: 'Lane 1' },
  { id: 'L2', label: 'Lane 2' },
  { id: 'L3', label: 'Lane 3' },
]
export const LANES = ['L1', 'L2', 'L3']

export const FACILITY_TYPES = [
  { id: 'A', label: 'Pitch A (Full)', short: 'Pitch A' },
  { id: 'B', label: 'Pitch B (Full)', short: 'Pitch B' },
  { id: 'lanes', label: 'Pitch B (Lanes)', short: 'Pitch B lanes' },
]

export const TIMES = Array.from({ length: (CLOSE - OPEN) / STEP + 1 }, (_, i) => OPEN + i * STEP)

export function fmtTime(min) {
  const h24 = Math.floor(min / 60) % 24
  const m = min % 60
  const ampm = h24 < 12 ? 'AM' : 'PM'
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`
}

export const toISODate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const todayISO = () => toISODate(new Date())

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
  // Pitch A: evening blocks
  let t = 16 * 60 + r('a0', 4) * 30
  for (let i = 0; i < 3 && t < CLOSE; i++) {
    const len = (2 + r(`a${i}`, 2)) * 60
    out.push({ id: `s-A-${i}`, facility: 'A', date, start: t, end: Math.min(t + len, CLOSE) })
    t += len + r(`ag${i}`, 3) * 30
  }
  // Pitch B full: one or two blocks
  t = 18 * 60 + r('b0', 3) * 30
  out.push({ id: 's-B-0', facility: 'B', date, start: t, end: t + 90 })
  if (r('b1', 2)) out.push({ id: 's-B-1', facility: 'B', date, start: 22 * 60, end: CLOSE })
  // Lanes: morning/afternoon sessions
  LANES.forEach((lane, i) => {
    const s = 9 * 60 + r(`l${i}`, 10) * 30
    out.push({ id: `s-${lane}`, facility: lane, date, start: s, end: s + 60 + r(`ll${i}`, 2) * 60 })
  })
  return out
}

// Which columns a selection occupies.
export function selectionColumns(type, lanes) {
  if (type === 'lanes') return lanes
  return [type]
}

// Returns conflicting bookings for a requested set of columns + range.
export function findConflicts(bookings, columns, range) {
  return bookings.filter((b) => {
    if (!overlaps(b, range)) return false
    if (columns.includes(b.facility)) return true
    // Pitch B full and its lanes are mutually exclusive
    if (columns.includes('B') && LANES.includes(b.facility)) return true
    if (b.facility === 'B' && columns.some((c) => LANES.includes(c))) return true
    return false
  })
}

// Locked (orange) windows for a column caused by the other side of the B/lanes split.
export function lockedBlocks(bookings, column) {
  if (column === 'B') return bookings.filter((b) => LANES.includes(b.facility))
  if (LANES.includes(column)) return bookings.filter((b) => b.facility === 'B')
  return []
}

export function facilityCost(type, lanes, hours) {
  if (type === 'lanes') return lanes.length * RATES.lane * hours
  return RATES.full * hours
}
