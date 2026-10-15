import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { IMAGES } from '../data/site'
import { btn } from '../components/ui'

function Field({ icon: Icon, label, id, right, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </label>
      <div className="relative">
        <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          id={id}
          required
          {...props}
          className="w-full rounded-lg border border-line bg-ink py-4 pl-12 pr-12 text-white placeholder:text-zinc-600 outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
        />
        {right}
      </div>
    </div>
  )
}

export default function Auth({ mode }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const { state } = useLocation()
  const { login, notify } = useApp()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const from = state?.from && state.from !== '/login' && state.from !== '/signup' ? state.from : '/'

  const submit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    setLoading(true)
    // Demo auth: replace with a real API call
    setTimeout(() => {
      const name = isLogin ? data.email.split('@')[0] : data.name
      login({ name, email: data.email })
      notify(isLogin ? `Welcome back, ${name}` : 'Account created. Welcome to SportX!')
      navigate(from, { replace: true })
    }, 700)
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        <img src={IMAGES.stadiumNight} alt="" className="animate-kenburns absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" />
        <div className="relative flex h-full flex-col justify-center px-16 xl:px-24">
          <h1 className="font-display text-7xl font-bold uppercase leading-[0.95] text-white xl:text-8xl">
            Step up
            <br />
            to the
            <br />
            <span className="text-brand">crease.</span>
          </h1>
          <p className="mt-8 border-l-4 border-brand pl-4 text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">
            Your premium game starts here.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex flex-col bg-panel px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand text-sm font-black text-white">SX</span>
            <span className="leading-tight">
              <span className="block font-black uppercase tracking-tight text-white">
                Sport<span className="text-brand">X</span> Arena
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Athletic portal</span>
            </span>
          </Link>
          <Link to={from} className="flex items-center gap-1.5 text-sm font-bold text-zinc-400 hover:text-white">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          {state?.notice && (
            <p className="animate-fade-up mb-10 flex items-center gap-3 rounded-lg border border-line bg-ink px-4 py-3 text-sm font-bold uppercase tracking-wider text-white">
              <ShieldCheck size={18} className="shrink-0 text-brand" />
              {state.notice}
            </p>
          )}

          <h2 className="font-display text-5xl font-bold uppercase text-white">{isLogin ? 'Welcome back' : 'Join the arena'}</h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            {isLogin ? 'Enter credentials to access portal' : 'Create your account in seconds'}
          </p>
          <span className="mt-6 block h-1 w-16 rounded-full bg-brand" />

          <form onSubmit={submit} className="mt-10 space-y-5">
            {!isLogin && <Field icon={User} id="name" name="name" label="Full name" placeholder="Your name" autoComplete="name" />}
            <Field icon={Mail} id="email" name="email" type="email" label="Email address" placeholder="Email address" autoComplete="email" />
            {!isLogin && <Field icon={Phone} id="phone" name="phone" type="tel" label="Mobile number" placeholder="07X XXX XXXX" autoComplete="tel" />}
            <Field
              icon={Lock}
              id="password"
              name="password"
              type={showPw ? 'text' : 'password'}
              minLength={6}
              label="Password"
              placeholder="••••••••"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              right={
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            {isLogin && (
              <div className="text-right">
                <a href="#" className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500 hover:text-white">
                  Forgot password?
                </a>
              </div>
            )}
            <button disabled={loading} className={`${btn.primary} w-full`}>
              {loading ? 'Please wait…' : isLogin ? 'Secure login' : 'Create account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-10 border-t border-line pt-8 text-center text-sm font-bold uppercase tracking-wider text-zinc-500">
            {isLogin ? "Don't have an account?" : 'Already a member?'}{' '}
            <Link to={isLogin ? '/signup' : '/login'} state={state} className="text-white hover:text-brand">
              {isLogin ? 'Sign up' : 'Log in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
