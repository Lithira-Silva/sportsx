const img = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`

export const BRAND = {
  name: 'SportX Arena',
  tagline: 'Indoor Cricket',
  phone: '+94 77 000 0000',
  email: 'hello@sportx.lk',
  address: 'Colombo, Sri Lanka',
  mapQuery: 'Colombo, Sri Lanka',
}

export const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Book Pitch', href: '#book' },
  { label: 'Tournaments', href: '#tournaments' },
  { label: 'Pricing & Info', href: '#pricing' },
]

export const SLIDES = [
  {
    badge: 'Premium Indoor Athletics',
    title: 'Professional Cricket Nets',
    text: 'Floodlit indoor pitches with true bounce, open from dawn till midnight. Rain or shine.',
    image: img('1540747913346-19e32dc3e97e'),
  },
  {
    badge: 'Train Like A Pro',
    title: 'Bowling Machine Sessions',
    text: 'Dial in pace, swing and spin. Face 140 km/h deliveries without leaving the city.',
    image: img('1593341646782-e0b495cff86d'),
  },
  {
    badge: 'Premium Indoor Athletics',
    title: 'Premium Gear Store',
    text: 'Everything you need from professional bats to essential refreshments.',
    image: img('1531415074968-036ba1b575da'),
  },
]

export const OFFERS = [
  {
    icon: 'grid',
    title: 'Professional Pitches',
    text: 'State-of-the-art indoor playing surfaces designed for true bounce and professional match simulation.',
    href: '#book',
  },
  {
    icon: 'target',
    title: 'Bowling Machine Practice',
    text: 'Train with advanced automatic ball-throwers. Customize speed, swing, and spin for targeted practice.',
    href: '#book',
  },
  {
    icon: 'bag',
    title: 'Retail & Refreshments',
    text: 'In-facility shop for water, energy drinks, and essential cricket gear to keep you performing at your best.',
    href: '#pricing',
  },
  {
    icon: 'crown',
    title: 'Premium Memberships',
    text: 'Exclusive plans for groups, academies, and athletes offering priority booking and serious benefits.',
    href: '#membership',
  },
]

export const PITCHES = [
  { id: 'p1', name: 'Pitch 1', type: 'Turf net', rate: 3500 },
  { id: 'p2', name: 'Pitch 2', type: 'Turf net', rate: 3500 },
  { id: 'bm', name: 'Bowling Machine', type: 'Machine lane', rate: 4000 },
]

// Opening hours: 06:00 to 24:00, one-hour slots
export const HOURS = Array.from({ length: 18 }, (_, i) => 6 + i)

export const TOURNAMENTS = [
  { date: 'Nov 08', title: 'Corporate Sixes Cup', format: '6-a-side · 16 teams', prize: 'Rs. 150,000', status: 'Open' },
  { date: 'Nov 22', title: 'Night Blast T10', format: '8-a-side · 12 teams', prize: 'Rs. 100,000', status: 'Filling fast' },
  { date: 'Dec 13', title: 'Junior Academy League', format: 'U-15 · 10 teams', prize: 'Trophies + kits', status: 'Open' },
]

export const PLANS = [
  {
    name: 'Casual',
    price: 3500,
    unit: '/hour',
    features: ['Any open pitch', 'Stumps & balls included', 'Book up to 7 days ahead'],
  },
  {
    name: 'Elite Coin',
    price: 3000,
    unit: '/coin',
    featured: true,
    features: ['1 coin = 1 hour', 'Priority member slots', 'Book up to 30 days ahead', 'Coins valid 30 days'],
  },
  {
    name: 'Academy',
    price: null,
    unit: 'Custom',
    features: ['Recurring weekly slots', 'Bowling machine bundles', 'Dedicated coach area', 'Invoice billing'],
  },
]

export const GALLERY = [
  { src: img('1540747913346-19e32dc3e97e', 900), alt: 'Floodlit cricket ground at night', wide: true },
  { src: img('1593341646782-e0b495cff86d', 600), alt: 'Batter striking the ball' },
  { src: img('1531415074968-036ba1b575da', 600), alt: 'Red cricket ball on grass' },
  { src: img('1624526267942-ab0ff8a3e972', 600), alt: 'Batter playing a drive' },
  { src: img('1512719994953-eabf50895df7', 900), alt: 'Stadium under a sunset sky', wide: true },
  { src: img('1589801258579-18e091f4ca26', 600), alt: 'Batter sweeping in front of the stumps' },
]
