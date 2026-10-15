import { useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import Home from './pages/Home'
import Book from './pages/Book'
import Tournaments from './pages/Tournaments'
import Pricing from './pages/Pricing'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'

const TITLES = {
  '/': 'Indoor Cricket Booking',
  '/book': 'Book a Pitch',
  '/tournaments': 'Tournaments',
  '/pricing': 'Pricing & Info',
  '/login': 'Login',
  '/signup': 'Sign Up',
}

function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = `${TITLES[pathname] ?? 'Page not found'} | SportX Arena`
    if (hash) {
      const el = document.querySelector(hash)
      if (el) return el.scrollIntoView({ behavior: 'smooth' })
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

function SiteLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh]">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
      </Routes>
      <Toast />
    </>
  )
}
