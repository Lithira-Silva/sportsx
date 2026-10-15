import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  Crown,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Zap,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { BRAND, IMAGES } from '../data/site'
import { btn } from '../components/ui'

const COPY = {
  login: {
    image: IMAGES.stadiumNight,
    title: 'Welcome back',
    sub: 'Log in to manage bookings and your coin wallet.',
    cta: 'Secure login',
    switchText: "Don't have an account?",
    switchLabel: 'Sign up',
    switchTo: '/signup',
  },
  signup: {
    image: IMAGES.batterStrike,
    title: 'Create account',
    sub: 'Join in seconds. Book faster and unlock member rates.',
    cta: 'Create account',
    switchText: 'Already a member?',
    switchLabel: 'Log in',
    switchTo: '/login',
  },
}

const PERKS = [
  { icon: CalendarCheck, text: 'Live pitch availability' },
  { icon: Zap, text: 'Instant confirmation' },
  { icon: Crown, text: 'Member coin rates' },
]

function strength(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const STRENGTH = [
  { label: 'Too weak', color: 'bg-brand' },
  { label: 'Weak', color: 'bg-brand' },
  { label: 'Fair', color: 'bg-amber-400' },
  { label: 'Good', color: 'bg-emerald-400' },
  { label: 'Strong', color: 'bg-emerald-400' },
]

function Field({ icon: Icon, label, id, right, hint, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
        {label}
      </label>
      <div className="group relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition group-focus-within:text-brand"
        />
        <input
          id={id}
          required
          {...props}
          className="w-full rounded-xl border border-line bg-ink/80 py-3.5 pl-11 pr-11 text-[15px] text-white placeholder:text-zinc-600 outline-none transition hover:border-zinc-600 focus:border-brand focus:bg-ink focus:ring-4 focus:ring-brand/10"
        />
        {right}
      </div>
      {hint}
    </div>
  )
}

export default function Auth({ mode }) {
  const isLogin = mode === 'login'
  const copy = COPY[mode]
  const navigate = useNavigate()
  const { state } = useLocation()
  const { login, notify } = useApp()
  const [showPw, setShowPw] = useState(false)
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)
  const from = state?.from && !['/login', '/signup'].includes(state.from) ? state.from : '/'
  const score = strength(pw)

  const submit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    setLoading(true)
    // Demo auth: replace with a real API call
    setTimeout(() => {
      const name = isLogin ? data.email.split('@')[0] : data.name.trim().split(' ')[0]
      login({ name, email: data.email })
      notify(isLogin ? `Welcome back, ${name}` : 'Account created. Welcome to SportX!')
      navigate(from, { replace: true })
    }, 800)
  }

  return (
    <div className="grid min-h-dvh bg-ink lg:grid-cols-[1.05fr_1fr]">
      {/* Visual panel */}
      <aside className="relative hidden overflow-hidden lg:block">
        <img key={copy.image} src={copy.image} alt="" className="animate-kenburns absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/50" />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <Link to="/" className="flex w-fit items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand font-black text-white shadow-lg shadow-brand/30">SX</span>
            <span className="leading-tight">
              <span className="block text-xl font-black uppercase tracking-tight text-white">
                Sport<span className="text-brand">X</span> Arena
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Athletic portal</span>
            </span>
          </Link>

          <div>
            <h1 className="font-display text-6xl font-bold uppercase leading-[0.92] text-white xl:text-7xl">
              Step up to
              <br />
              the <span className="text-brand">crease.</span>
            </h1>
            <p className="mt-6 max-w-md border-l-4 border-brand pl-4 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">
              Your premium game starts here.
            </p>
            <ul className="mt-10 flex flex-wrap gap-3">
              {PERKS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-semibold text-zinc-200 backdrop-blur"
                >
                  <Icon size={14} className="text-brand" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="relative flex min-h-dvh flex-col overflow-hidden bg-panel">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />

        {/* Mobile image band */}
        <div className="relative h-44 shrink-0 overflow-hidden lg:hidden">
          <img src={copy.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/60 to-black/30" />
        </div>

        <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-5 sm:px-10">
          <Link to="/" className="flex items-center gap-2.5 lg:invisible">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-sm font-black text-white">SX</span>
            <span className="font-black uppercase tracking-tight text-white">
              Sport<span className="text-brand">X</span>
            </span>
          </Link>
          <Link
            to={from}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 backdrop-blur transition hover:border-white/30 hover:text-white"
          >
            <ArrowLeft size={14} /> Back to site
          </Link>
        </header>

        <div className="relative mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-start px-5 pb-12 pt-2 sm:px-0 lg:justify-center lg:py-24">
          {state?.notice && (
            <p className="animate-fade-up mb-8 flex items-center gap-3 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm font-semibold text-white">
              <ShieldCheck size={18} className="shrink-0 text-brand" />
              {state.notice}
            </p>
          )}

          {/* Segmented switch */}
          <div className="grid grid-cols-2 rounded-xl border border-line bg-ink p-1" role="tablist">
            {['login', 'signup'].map((m) => (
              <Link
                key={m}
                to={`/${m}`}
                state={state}
                replace
                role="tab"
                aria-selected={mode === m}
                className={`rounded-lg py-2.5 text-center text-xs font-extrabold uppercase tracking-[0.15em] transition ${
                  mode === m ? 'bg-white text-black shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Log in' : 'Sign up'}
              </Link>
            ))}
          </div>

          <div key={mode} className="animate-fade-up">
            <h2 className="mt-9 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">{copy.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{copy.sub}</p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              {!isLogin && <Field icon={User} id="name" name="name" label="Full name" placeholder="e.g. Kasun Perera" autoComplete="name" />}
              <Field icon={Mail} id="email" name="email" type="email" label="Email address" placeholder="you@example.com" autoComplete="email" />
              {!isLogin && (
                <Field
                  icon={Phone}
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Mobile number"
                  placeholder="07X XXX XXXX"
                  pattern="[0-9+ ]{9,15}"
                  autoComplete="tel"
                />
              )}
              <Field
                icon={Lock}
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                minLength={isLogin ? 6 : 8}
                label="Password"
                placeholder={isLogin ? 'Your password' : 'At least 8 characters'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                right={
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }
                hint={
                  !isLogin &&
                  pw && (
                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="grid flex-1 grid-cols-4 gap-1.5">
                        {[1, 2, 3, 4].map((i) => (
                          <span key={i} className={`h-1 rounded-full transition ${i <= score ? STRENGTH[score].color : 'bg-zinc-800'}`} />
                        ))}
                      </div>
                      <span className="w-16 text-right text-[11px] font-semibold text-zinc-400">{STRENGTH[score].label}</span>
                    </div>
                  )
                }
              />

              {isLogin ? (
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-400 select-none">
                    <input type="checkbox" name="remember" defaultChecked className="peer sr-only" />
                    <span className="grid h-[18px] w-[18px] place-items-center rounded border border-zinc-600 text-transparent transition peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    Remember me
                  </label>
                  <a href="#" className="text-sm font-semibold text-zinc-400 transition hover:text-brand">
                    Forgot password?
                  </a>
                </div>
              ) : (
                <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-zinc-400 select-none">
                  <input type="checkbox" required className="peer sr-only" />
                  <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded border border-zinc-600 text-transparent transition peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>
                    I agree to the{' '}
                    <a href="#" className="font-semibold text-white hover:text-brand">Terms</a> and{' '}
                    <a href="#" className="font-semibold text-white hover:text-brand">Privacy Policy</a>.
                  </span>
                </label>
              )}

              <button disabled={loading} className={`${btn.primary} w-full rounded-xl py-4 text-sm`}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Please wait…
                  </>
                ) : (
                  <>
                    {copy.cta} <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-zinc-500">
              {copy.switchText}{' '}
              <Link to={copy.switchTo} state={state} replace className="font-bold text-white transition hover:text-brand">
                {copy.switchLabel}
              </Link>
            </p>

            <p className="mt-10 flex items-center justify-center gap-2 border-t border-line pt-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
              <Phone size={13} /> Need help? Call {BRAND.phone}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
