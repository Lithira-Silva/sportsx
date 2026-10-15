import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SLIDES } from '../data/site'

const INTERVAL = 6000

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((i) => setIndex((i + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => go(index + 1), INTERVAL)
    return () => clearTimeout(t)
  }, [index, paused, go])

  const slide = SLIDES[index]

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[640px] items-center overflow-hidden border-b border-line pb-36 pt-[108px] sm:h-[88vh] sm:pb-0 sm:pt-[76px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {SLIDES.map((s, i) => (
        <div
          key={s.title}
          className={`absolute inset-0 -z-20 transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== index}
        >
          <img
            src={s.image}
            alt=""
            className={`h-full w-full object-cover ${i === index ? 'animate-kenburns' : ''}`}
            fetchPriority={i === 0 ? 'high' : 'low'}
          />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/40" />

      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-10">
        <div key={index} className="max-w-2xl">
          <span className="animate-fade-up inline-block rounded-md border border-brand/40 bg-black/40 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.15em] text-brand backdrop-blur">
            {slide.badge}
          </span>
          <h1
            className="animate-fade-up mt-6 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl"
            style={{ animationDelay: '80ms' }}
          >
            {slide.title}
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl"
            style={{ animationDelay: '160ms' }}
          >
            {slide.text}
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap gap-3 sm:gap-4" style={{ animationDelay: '240ms' }}>
            <Link
              to="/book"
              className="group inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-brand px-6 py-4 sm:flex-none sm:px-7 font-extrabold uppercase tracking-wide text-white shadow-xl shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-600"
            >
              Book your pitch now
              <ChevronRight size={20} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-md border border-white/20 px-6 py-4 sm:flex-none sm:px-7 font-bold uppercase tracking-wide text-white backdrop-blur transition hover:border-white/50 hover:bg-white/5"
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-[4.5rem] flex items-center justify-center gap-6 sm:bottom-20">
        <button
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="hidden h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white sm:grid"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === index ? 'w-9 bg-brand' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => go(index + 1)}
          aria-label="Next slide"
          className="hidden h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white sm:grid"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  )
}
