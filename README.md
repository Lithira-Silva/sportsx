# SportX Arena

A modern, responsive website for an indoor cricket facility: browse facilities, check live pitch availability, book a slot, register for tournaments, and manage an account.

Built with **React 19**, **Vite**, **Tailwind CSS v4** and **React Router**.

> **Status: frontend demo.** Login, payments and bookings run entirely in the browser (saved to `localStorage`). Booked slots shown on the schedule are generated sample data. Connect a backend before taking real bookings. See [Going to production](#going-to-production).

## Pages

| Route | What it does |
| --- | --- |
| `/` | Hero slider, quick links, facilities, how booking works, membership, gallery |
| `/book` | Pitch layout (Pitch A, B, C; Pitch B splits into 3 lanes), live schedule, booking panel with date, time, facility, extras and checkout |
| `/tournaments` | Open tournaments and team registration (7-player squads) |
| `/pricing` | Facility rates, Elite Coin membership, opening info, FAQs |
| `/login`, `/signup` | Split-screen auth pages; return the user to where they came from |

### Booking rules

- Open **08:00 – 24:00**, bookable in 30-minute steps, minimum 1 hour, up to 30 days ahead.
- Pitch B can be booked in full **or** by individual lanes. A full Pitch B booking blocks its lanes for that time, and vice versa.
- Past times and clashing slots cannot be selected. Users must log in before paying.

## Getting started

Requires **Node.js 20+**.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
├── App.jsx                 Routes and layout
├── main.jsx                Entry point
├── index.css               Tailwind theme, animations, scrollbar
├── data/site.js            All editable content: brand, prices, add-ons, tournaments, FAQs, images
├── lib/booking.js          Opening hours, pitches, conflict rules, pricing, sample bookings
├── context/AppContext.jsx  User session, saved bookings, toast messages
├── components/             Navbar, Footer, Hero, Offers, Membership, Gallery, Toast, shared UI
└── pages/                  Home, Book, Tournaments, Pricing, Auth, NotFound
```

## Customising

Most changes only need [`src/data/site.js`](src/data/site.js):

- **Brand and contact:** `BRAND` (name, phone, email, address, map location, hours)
- **Prices:** `RATES` (full pitch, lane, bowling machine, member rate) and `ADDONS`
- **Tournaments:** `TOURNAMENTS`. When the list is empty or all dates have passed, the page shows a "no open tournaments" message.
- **Images:** `IMAGES`, `SLIDES` and `GALLERY`. Currently free Unsplash photos; put your own in `public/` and reference them as `/your-photo.jpg`.

Opening hours, pitches and lane rules live in [`src/lib/booking.js`](src/lib/booking.js). Theme colours and fonts are in the `@theme` block of [`src/index.css`](src/index.css).

## Deploying to Vercel (free)

The repo includes [`vercel.json`](vercel.json), which tells Vercel to build with Vite and send every route to `index.html`. Without it, refreshing a page like `/book` would return a 404.

1. Push this repository to GitHub.
2. Sign in at [vercel.com](https://vercel.com) with GitHub. The free **Hobby** plan is enough.
3. Click **Add New → Project**, pick this repository and click **Import**.
4. Keep the detected settings (Framework **Vite**, build `npm run build`, output `dist`) and click **Deploy**.

You get a `*.vercel.app` URL in about a minute. Every push to `main` redeploys automatically, and pull requests get preview URLs. A custom domain can be added under **Project → Settings → Domains**.

Or from the command line:

```bash
npm i -g vercel
vercel          # first run links the project and creates a preview
vercel --prod   # deploy to production
```

## Going to production

Before accepting real customers, replace the demo pieces:

- **Authentication:** `login` / `logout` in `AppContext.jsx` and the submit handler in `pages/Auth.jsx`
- **Bookings:** `seedBookings()` in `lib/booking.js` should become an API call, and new bookings must be saved and conflict-checked on the server
- **Payments:** the `Checkout` modal in `pages/Book.jsx` simulates payment; integrate a real payment gateway
- **Tournament registration:** the form in `pages/Tournaments.jsx` currently only shows a confirmation message
- **Links:** "Forgot password", Terms and Privacy Policy are placeholders
