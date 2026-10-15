import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, LogOut, Menu, X } from 'lucide-react'
import { NAV } from '../data/site'
import { useApp } from '../context/AppContext'
import { Logo } from './ui'

function UserMenu() {
  const { user, logout, notify } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-3 rounded-md border border-line bg-panel py-2 pl-2 pr-3 transition hover:border-zinc-600"
      >
        <span className="grid h-8 w-8 place-items-center rounded bg-brand text-sm font-black uppercase text-white">
          {user.name[0]}
        </span>
        <span className="max-w-32 truncate text-sm font-bold text-white">{user.name}</span>
        <ChevronDown size={16} className={`text-zinc-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="animate-fade-up absolute right-0 mt-2 w-56 rounded-xl border border-line bg-panel p-2 shadow-2xl">
          <p className="truncate px-3 py-2 text-xs text-zinc-500">{user.email}</p>
          <Link to="/book" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/5">
            New booking
          </Link>
          <button
            onClick={() => {
              logout()
              setOpen(false)
              notify('Logged out')
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-zinc-200 hover:bg-white/5"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { user } = useApp()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const linkCls = ({ isActive }) =>
    `relative py-2 text-sm font-bold uppercase tracking-[0.12em] transition-colors ${
      isActive ? 'text-brand' : 'text-zinc-300 hover:text-white'
    }`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || pathname !== '/' ? 'border-line bg-ink/85 backdrop-blur-xl' : 'border-transparent bg-ink/50 backdrop-blur-md'
      }`}
    >
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-9 lg:flex">
          {NAV.map((n) => (
            <li key={n.to}>
              <NavLink to={n.to} end className={linkCls}>
                {({ isActive }) => (
                  <>
                    {n.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-0.5 bg-brand transition-all duration-300 ${isActive ? 'w-full' : 'w-0'}`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 lg:flex">
          <span className="h-8 w-px bg-line" />
          {user ? (
            <UserMenu />
          ) : (
            <Link
              to="/login"
              state={{ from: pathname }}
              className="rounded-md bg-white px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-black transition hover:-translate-y-0.5 hover:bg-zinc-200"
            >
              Login / Sign Up
            </Link>
          )}
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
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
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
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-3 font-bold uppercase tracking-wider ${
                      isActive ? 'bg-brand/10 text-brand' : 'text-zinc-200 hover:bg-white/5'
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-auto">
            {user ? (
              <p className="text-sm text-zinc-400">
                Signed in as <span className="font-bold text-white">{user.name}</span>
              </p>
            ) : (
              <Link to="/login" state={{ from: pathname }} className="block rounded-md bg-white py-3.5 text-center font-extrabold uppercase tracking-wider text-black">
                Login / Sign Up
              </Link>
            )}
          </div>
        </aside>
      </div>
    </header>
  )
}
