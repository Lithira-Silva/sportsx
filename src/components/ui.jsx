import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

export function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useReveal()
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>
}

export function Badge({ icon: Icon, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand ${className}`}
    >
      {Icon && <Icon size={13} />}
      {children}
    </span>
  )
}

export function SectionTitle({ eyebrow, title, sub, center = false, action }) {
  return (
    <Reveal className={`mb-12 flex flex-wrap items-end justify-between gap-6 ${center ? 'flex-col items-center text-center' : ''}`}>
      <div>
        {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand">{eyebrow}</p>}
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">{title}</h2>
        <span className={`mt-4 block h-1 w-20 rounded-full bg-brand ${center ? 'mx-auto' : ''}`} />
        {sub && <p className={`mt-5 max-w-2xl text-zinc-400 ${center ? 'mx-auto' : ''}`}>{sub}</p>}
      </div>
      {action}
    </Reveal>
  )
}

// Big page heading used at the top of inner pages
export function PageHero({ badge, badgeIcon, title, accent, text, center = false, children }) {
  return (
    <section className="relative overflow-hidden border-b border-line pb-14 pt-32 sm:pb-16 sm:pt-36">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <Container className={`relative ${center ? 'text-center' : ''}`}>
        <div className="animate-fade-up">{badge && <Badge icon={badgeIcon}>{badge}</Badge>}</div>
        <h1
          className="animate-fade-up mt-6 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl"
          style={{ animationDelay: '80ms' }}
        >
          {title} {accent && <span className="text-brand">{accent}</span>}
        </h1>
        {text && (
          <p
            className={`animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 ${center ? 'mx-auto' : ''}`}
            style={{ animationDelay: '160ms' }}
          >
            {text}
          </p>
        )}
        {children}
      </Container>
    </section>
  )
}

export function Logo({ small = false }) {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="SportX Arena home">
      <span
        className={`grid place-items-center rounded-lg bg-brand font-black text-white shadow-lg shadow-brand/30 ${
          small ? 'h-9 w-9 text-sm' : 'h-11 w-11 text-base'
        }`}
      >
        SX
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-black uppercase tracking-tight text-white sm:text-xl">
          Sport<span className="text-brand">X</span> Arena
        </span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Official Portal</span>
      </span>
    </Link>
  )
}

export const btn = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-md bg-brand px-7 py-4 font-extrabold uppercase tracking-wider text-white shadow-xl shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-600 disabled:pointer-events-none disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none',
  white:
    'inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-black shadow-xl shadow-white/5 transition hover:-translate-y-0.5',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-md border border-line px-7 py-4 font-extrabold uppercase tracking-wider text-white transition hover:border-white/40 hover:bg-white/5',
}
