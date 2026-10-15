import { Activity, ChevronRight, Crown, Grid3x3, ShieldCheck, Target } from 'lucide-react'
import { BRAND } from '../data/site'
import { Reveal } from './ui'

const PERKS = [
  { icon: Target, title: 'Simple math', sub: '1 coin equals 1 full hour' },
  { icon: Grid3x3, title: 'Unbeatable rate', sub: 'Fixed Rs. 3000/hr price' },
  { icon: Activity, title: '30-day validity', sub: 'Coins valid for 30 days' },
  { icon: ShieldCheck, title: 'Priority access', sub: 'Exclusive member slots' },
]

// Decorative QR-style pattern (not a scannable code)
const QR = Array.from({ length: 121 }, (_, i) => ((i * 7919) % 13) % 3 !== 0)

function MemberCard() {
  return (
    <div className="relative mx-auto w-full max-w-md [perspective:1200px]">
      <div className="absolute -inset-8 rounded-[2rem] bg-brand/25 blur-3xl" />
      <div className="relative rotate-[3deg] rounded-2xl border border-white/10 bg-zinc-900/80 p-5 shadow-2xl transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] sm:p-6">
        <span className="absolute -left-5 -top-6 grid h-16 w-16 -rotate-12 place-items-center rounded-2xl bg-brand text-white shadow-xl shadow-brand/40 sm:h-20 sm:w-20">
          <Crown size={34} />
        </span>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-5 ring-1 ring-white/10">
          <div className="absolute -bottom-10 left-0 h-24 w-[130%] -rotate-6 bg-gradient-to-r from-brand via-brand/70 to-transparent" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase italic tracking-wide text-white">
                Membership <span className="text-brand">Card</span>
              </p>
              <p className="mt-8 font-display text-4xl font-bold uppercase leading-none text-white">
                Sport<span className="text-brand">X</span>
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Arena · Indoor Cricket</p>
            </div>
            <div className="rounded-md bg-white p-1.5">
              <div className="grid grid-cols-11 gap-px">
                {QR.map((on, i) => (
                  <span key={i} className={`h-1.5 w-1.5 sm:h-2 sm:w-2 ${on ? 'bg-black' : 'bg-white'}`} />
                ))}
              </div>
              <p className="mt-1 text-center text-[9px] font-black text-black">SPX-0001</p>
            </div>
          </div>
          <div className="relative mt-6 flex items-end justify-between text-[11px] font-semibold text-white">
            <span>{BRAND.address}</span>
            <span>{BRAND.phone}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Membership({ onJoin }) {
  return (
    <section id="membership" className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-brand/30 bg-panel px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl" />
          <div className="relative grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-brand">
                <Crown size={13} /> Exclusive coin-based access
              </span>
              <h2 className="mt-6 font-display text-5xl font-bold uppercase leading-[0.95] text-white sm:text-6xl">
                Elite <span className="text-brand">Coin</span>
                <br />
                <span className="text-brand">Membership</span> Wallet
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                Buy Coins, Book Anytime. Our digital wallet gives you the ultimate flexibility. 1 Coin = 1 Hour of
                professional pitch time. Enjoy our special member rate of{' '}
                <strong className="text-white">Rs. 3000/hr</strong> on all future bookings.
              </p>

              <ul className="mt-10 grid gap-6 sm:grid-cols-2">
                {PERKS.map(({ icon: Icon, title, sub }) => (
                  <li key={title} className="flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-line bg-panel-2 text-brand">
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold uppercase text-white">{title}</span>
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{sub}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="my-10 h-px bg-line" />

              <button
                onClick={onJoin}
                className="group inline-flex items-center gap-3 rounded-xl bg-white px-9 py-5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-xl shadow-white/5 transition hover:-translate-y-0.5"
              >
                Join the elite
                <ChevronRight size={18} className="transition group-hover:translate-x-1" />
              </button>
            </div>

            <MemberCard />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
