const img = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`

export const BRAND = {
  name: 'SportX Arena',
  phone: '+94 77 000 0000',
  email: 'hello@sportx.lk',
  address: 'Colombo, Sri Lanka',
  mapQuery: 'Colombo, Sri Lanka',
  hours: '08:00 AM – 12:00 AM',
}

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Book Pitch', to: '/book' },
  { label: 'Tournaments', to: '/tournaments' },
  { label: 'Pricing & Info', to: '/pricing' },
]

export const IMAGES = {
  stadiumNight: img('1540747913346-19e32dc3e97e'),
  batterStrike: img('1593341646782-e0b495cff86d'),
  ballGrass: img('1531415074968-036ba1b575da'),
  batterDrive: img('1624526267942-ab0ff8a3e972'),
  sunsetStadium: img('1512719994953-eabf50895df7'),
}

export const SLIDES = [
  {
    badge: 'Premium Indoor Athletics',
    title: 'Professional Cricket Nets',
    text: 'Floodlit indoor pitches with true bounce, open from morning till midnight. Rain or shine.',
    image: IMAGES.stadiumNight,
  },
  {
    badge: 'Train Like A Pro',
    title: 'Bowling Machine Sessions',
    text: 'Dial in pace, swing and spin. Face 140 km/h deliveries without leaving the city.',
    image: IMAGES.batterStrike,
  },
  {
    badge: 'Premium Indoor Athletics',
    title: 'Premium Gear Store',
    text: 'Everything you need from professional bats to essential refreshments.',
    image: IMAGES.ballGrass,
  },
]

export const OFFERS = [
  {
    icon: 'grid',
    title: 'Professional Pitches',
    text: 'State-of-the-art indoor playing surfaces designed for true bounce and professional match simulation.',
    to: '/book',
  },
  {
    icon: 'target',
    title: 'Bowling Machine Practice',
    text: 'Train with advanced automatic ball-throwers. Customize speed, swing, and spin for targeted practice.',
    to: '/pricing',
  },
  {
    icon: 'bag',
    title: 'Retail & Refreshments',
    text: 'In-facility shop for water, energy drinks, and essential cricket gear to keep you performing at your best.',
    to: '/book',
  },
  {
    icon: 'crown',
    title: 'Premium Memberships',
    text: 'Exclusive plans for groups, academies, and athletes offering priority booking and serious benefits.',
    to: '/pricing#membership',
  },
]

export const STEPS = [
  { n: '01', title: 'Pick your facility', text: 'Full pitch for a team session or a single lane for focused nets.' },
  { n: '02', title: 'Choose date & time', text: 'See live availability on the schedule and grab an open window.' },
  { n: '03', title: 'Pay & play', text: 'Confirm securely and walk straight onto the pitch. Gear is ready.' },
]

// Facility pricing (Rs. per hour)
export const RATES = { full: 3500, lane: 1500, machine: 1500, member: 3000 }

export const ADDONS = [
  { id: 'machine', name: 'Bowling machine', note: 'Per hour of booking', price: RATES.machine, perHour: true },
  { id: 'balls', name: 'Leather ball pack (6)', note: 'Match-grade', price: 1200 },
  { id: 'water', name: 'Mineral water 1.5L', note: 'Chilled', price: 150 },
  { id: 'energy', name: 'Energy drink', note: 'Chilled', price: 400 },
]

export const TOURNAMENTS = [
  {
    id: 'night-blast',
    date: '2026-11-22',
    title: 'Night Blast Sixes',
    format: '6-a-side · 16 teams',
    fee: 15000,
    prize: 'Rs. 150,000',
    slotsLeft: 5,
  },
  {
    id: 'corporate-cup',
    date: '2026-12-13',
    title: 'Corporate Cup',
    format: '6-a-side · 12 teams',
    fee: 20000,
    prize: 'Rs. 200,000',
    slotsLeft: 9,
  },
]

export const FACILITY_CARDS = [
  {
    icon: 'trophy',
    title: 'Elite Performance Pitches',
    sub: 'Pitch A & Pitch B full',
    rateLabel: 'Rate / hour',
    price: RATES.full,
    featured: true,
    text: 'Professional-grade true-bounce surfaces designed for match simulation and high-intensity training. Perfect for full-team practice.',
    features: [
      'Professional-grade true-bounce surface',
      'Match simulation standards',
      'Spacious full-pitch layout',
      'Complimentary basic match gear',
      'High-intensity LED lighting',
    ],
    book: 'full',
  },
  {
    icon: 'target',
    title: 'Precision Practice Lanes',
    sub: 'Pitch B individual lanes',
    rateLabel: 'Rate / hour / lane',
    price: RATES.lane,
    text: 'Dedicated individual lanes for focused net practice. Ideal for bowlers working on line and length, or batters perfecting shots.',
    features: [
      'Individual focused net area',
      'Precise bowling crease markings',
      'Side-by-side competitive practice',
      'Safety netting all around',
      'Clear path for bowler run-up',
    ],
    book: 'lanes',
  },
  {
    icon: 'zap',
    title: 'Pro Automated Bowling',
    sub: 'Advanced machine add-on',
    rateLabel: 'Rate / hour (add-on)',
    price: RATES.machine,
    text: 'Elevate your batting with a programmable pro bowling machine. Customize speed, swing and spin to challenge any batter.',
    features: [
      'Programmable speed & swing',
      'Precise spin variation control',
      'Auto-feeder ready (60+ balls)',
      'Adjustable release height',
      'Detailed performance feedback',
    ],
    book: 'full',
  },
]

export const FAQS = [
  {
    q: 'Can I cancel or reschedule?',
    a: 'All bookings require full payment upfront and are non-refundable. Contact us at least 24 hours ahead and we will try to move your slot.',
  },
  {
    q: 'What is the difference between a full pitch and a lane?',
    a: 'A full pitch is the whole netted area for team practice or matches. Pitch B can also be split into 3 individual lanes for focused nets. While Pitch B is booked in full, its lanes are locked, and vice versa.',
  },
  {
    q: 'Do I need to bring my own gear?',
    a: 'Stumps and basic match gear are provided. Balls, drinks and essentials can be added at checkout or bought at our store.',
  },
  {
    q: 'How do Elite Coins work?',
    a: '1 coin = 1 hour of pitch time at the member rate of Rs. 3000/hr. Coins are valid for 30 days from purchase.',
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
