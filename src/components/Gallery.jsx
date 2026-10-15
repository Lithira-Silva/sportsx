import { GALLERY } from '../data/site'

export default function Gallery() {
  const items = [...GALLERY, ...GALLERY] // duplicated for a seamless loop

  return (
    <section className="relative overflow-hidden border-t border-line py-24" aria-label="Arena gallery">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent sm:w-48" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent sm:w-48" />

      <div className="animate-marquee flex w-max gap-6">
        {items.map((g, i) => (
          <figure
            key={i}
            className={`group relative h-64 shrink-0 overflow-hidden rounded-2xl border border-line sm:h-72 ${
              g.wide ? 'w-[22rem] sm:w-[26rem]' : 'w-48 sm:w-56'
            }`}
            aria-hidden={i >= GALLERY.length}
          >
            <img
              src={g.src}
              alt={i < GALLERY.length ? g.alt : ''}
              loading="lazy"
              className="h-full w-full object-cover brightness-75 transition duration-700 group-hover:scale-105 group-hover:brightness-100"
            />
          </figure>
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <span className="flex items-center gap-3 rounded-full border border-line bg-panel/60 px-6 py-2.5 text-xs font-black uppercase italic tracking-[0.35em] text-zinc-300">
          <i className="h-2 w-2 rounded-full bg-brand" />
          The arena experience
        </span>
      </div>
    </section>
  )
}
