import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Offers from './components/Offers'
import Booking from './components/Booking'
import Membership from './components/Membership'
import Tournaments from './components/Tournaments'
import Pricing from './components/Pricing'
import Gallery from './components/Gallery'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const notify = useCallback((msg) => setToast({ msg, id: Date.now() }), [])
  const openAuth = useCallback(() => setAuthOpen(true), [])
  const closeAuth = useCallback(() => setAuthOpen(false), [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <>
      <a
        href="#book"
        className="sr-only z-[70] rounded bg-brand px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to booking
      </a>
      <Navbar onLogin={openAuth} />
      <main>
        <Hero />
        <Offers />
        <Booking
          onConfirm={({ pitch, day, slots }) =>
            notify(
              `${pitch.name} booked for ${slots.length} hr on ${day.toLocaleDateString('en', {
                day: 'numeric',
                month: 'short',
              })}`,
            )
          }
        />
        <Membership onJoin={openAuth} />
        <Tournaments onRegister={(t) => notify(`Registration request sent for ${t.title}`)} />
        <Pricing onSelect={(p) => (p.price ? openAuth() : notify('Our team will contact you shortly'))} />
        <Gallery />
      </main>
      <Footer />

      <AuthModal
        open={authOpen}
        onClose={closeAuth}
        onSubmit={(mode) => {
          closeAuth()
          notify(mode === 'login' ? 'Logged in successfully' : 'Account created. Welcome!')
        }}
      />

      {toast && (
        <div
          key={toast.id}
          role="status"
          className="animate-fade-up fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-3 rounded-xl border border-line bg-panel px-5 py-4 text-sm font-semibold text-white shadow-2xl"
        >
          <CheckCircle2 size={20} className="text-emerald-400" />
          {toast.msg}
        </div>
      )}
    </>
  )
}
