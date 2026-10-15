import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { BRAND, NAV } from '../data/site'
import { Logo } from './ui'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-[#08080a] pt-20">
      <div className="mx-auto grid max-w-[1800px] gap-12 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-10">
        <div>
          <Logo small />
          <p className="mt-6 max-w-sm leading-relaxed text-zinc-400">
            Experience the ultimate indoor cricket facility. State-of-the-art pitches, advanced bowling machines, and
            premium amenities for professionals and enthusiasts alike.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2"><Phone size={15} className="text-brand" />{BRAND.phone}</li>
            <li className="flex items-center gap-2"><Mail size={15} className="text-brand" />{BRAND.email}</li>
            <li className="flex items-center gap-2"><MapPin size={15} className="text-brand" />{BRAND.address}</li>
            <li className="flex items-center gap-2"><Clock size={15} className="text-brand" />{BRAND.hours}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.15em] text-white">Quick links</h4>
          <ul className="mt-6 space-y-4">
            {NAV.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="font-bold uppercase text-zinc-300 transition hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/pricing#faq" className="font-bold uppercase text-zinc-300 transition hover:text-brand">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.15em] text-white">Our location</h4>
          <div className="mt-6 overflow-hidden rounded-xl border border-line">
            <iframe
              title="Map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(BRAND.mapQuery)}&output=embed`}
              className="h-52 w-full grayscale invert-[0.9] contrast-[0.9]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1800px] flex-col items-center justify-between gap-4 border-t border-line px-4 py-8 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 sm:flex-row sm:px-6 lg:px-10">
        <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        <div className="flex gap-6 normal-case tracking-wider">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
