import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Demo-only client state. Swap for real API calls once a backend exists.
const AppContext = createContext(null)

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable */
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => load('sx.user', null))
  const [bookings, setBookings] = useState(() => load('sx.bookings', []))
  const [toast, setToast] = useState(null)

  useEffect(() => save('sx.user', user), [user])
  useEffect(() => save('sx.bookings', bookings), [bookings])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const notify = useCallback((msg, tone = 'success') => setToast({ msg, tone, id: Date.now() }), [])

  const value = useMemo(
    () => ({
      user,
      login: (u) => setUser(u),
      logout: () => setUser(null),
      bookings,
      addBookings: (list) => setBookings((b) => [...b, ...list]),
      toast,
      notify,
    }),
    [user, bookings, toast, notify],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
