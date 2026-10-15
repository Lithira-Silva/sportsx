import { useEffect, useRef } from 'react'

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
      { threshold: 0.15 },
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

export function SectionTitle({ eyebrow, title, sub, center = false }) {
  return (
    <Reveal className={`mb-12 ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand">{eyebrow}</p>
      )}
      <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">{title}</h2>
      <span className={`mt-4 block h-1 w-20 rounded-full bg-brand ${center ? 'mx-auto' : ''}`} />
      {sub && <p className={`mt-5 max-w-2xl text-zinc-400 ${center ? 'mx-auto' : ''}`}>{sub}</p>}
    </Reveal>
  )
}

export function Logo({ small = false }) {
  return (
    <a href="#home" className="flex items-center gap-3" aria-label="SportX Arena home">
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
    </a>
  )
}
