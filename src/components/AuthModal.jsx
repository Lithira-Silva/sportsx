import { useEffect, useRef, useState } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'

export default function AuthModal({ open, onClose, onSubmit }) {
  const [mode, setMode] = useState('login')
  const [showPw, setShowPw] = useState(false)
  const firstField = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    setTimeout(() => firstField.current?.focus(), 50)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const field =
    'w-full rounded-lg border border-line bg-panel-2 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-brand focus:ring-1 focus:ring-brand'

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-fade-up relative w-full max-w-md rounded-2xl border border-line bg-panel p-7 shadow-2xl sm:p-9">
        <button onClick={onClose} className="absolute right-5 top-5 text-zinc-400 hover:text-white" aria-label="Close">
          <X size={22} />
        </button>
        <h2 id="auth-title" className="font-display text-3xl font-bold uppercase text-white">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          {mode === 'login' ? 'Log in to manage bookings and your coin wallet.' : 'Join to book faster and earn member perks.'}
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-lg bg-panel-2 p-1" role="tablist">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-md py-2 text-sm font-bold uppercase tracking-wider transition ${
                mode === m ? 'bg-brand text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {m === 'login' ? 'Login' : 'Sign up'}
            </button>
          ))}
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(mode)
          }}
        >
          {mode === 'signup' && (
            <input ref={firstField} required className={field} placeholder="Full name" autoComplete="name" />
          )}
          <input
            ref={mode === 'login' ? firstField : undefined}
            required
            type="email"
            className={field}
            placeholder="Email address"
            autoComplete="email"
          />
          {mode === 'signup' && (
            <input required type="tel" className={field} placeholder="Mobile number" autoComplete="tel" />
          )}
          <div className="relative">
            <input
              required
              minLength={6}
              type={showPw ? 'text' : 'password'}
              className={`${field} pr-12`}
              placeholder="Password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {mode === 'login' && (
            <div className="text-right">
              <a href="#" className="text-sm font-semibold text-brand hover:underline">Forgot password?</a>
            </div>
          )}
          <button className="w-full rounded-md bg-brand py-3.5 font-extrabold uppercase tracking-wider text-white transition hover:bg-brand-600">
            {mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
