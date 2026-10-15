import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV } from '../data/site'
import { Logo } from './ui'

export default function Navbar({ onLogin }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: highlight the nav item whose section is in view
  useEffect(() => {
    const sections = NAV.map((n) => document.querySelector(n.href)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? 'border-line bg-ink/85 backdrop-blur-xl' : 'border-transparent bg-ink/60 backdrop-blur-md'
      }`}
    >
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <ul className="hidden items-center gap-9 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                className={`relative py-2 text-sm font-bold uppercase tracking-[0.12em] transition-colors ${
                  active === n.href ? 'text-brand' : 'text-zinc-300 hover:text-white'
                }`}
              >
                {n.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 bg-brand transition-all duration-300 ${
                    active === n.href ? 'w-full' : 'w-0'
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 lg:flex">
          <span className="h-8 w-px bg-line" />
          <button
            onClick={onLogin}
            className="rounded-md bg-white px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-black transition hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
          >
            Login / Sign Up
          </button>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-md border border-line text-white lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/70 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 flex h-dvh w-80 max-w-[85%] flex-col border-l border-line bg-panel p-6 transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-10 flex items-center justify-between">
            <Logo small />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-zinc-300">
              <X size={24} />
            </button>
          </div>
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-3 font-bold uppercase tracking-wider ${
                    active === n.href ? 'bg-brand/10 text-brand' : 'text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              setOpen(false)
              onLogin()
            }}
            className="mt-auto rounded-md bg-white py-3.5 font-extrabold uppercase tracking-wider text-black"
          >
            Login / Sign Up
          </button>
        </aside>
      </div>
    </header>
  )
}
