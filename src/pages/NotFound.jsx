import { Link } from 'react-router-dom'
import { Container, btn } from '../components/ui'

export default function NotFound() {
  return (
    <Container className="flex min-h-[80vh] flex-col items-center justify-center pt-24 text-center">
      <p className="font-display text-9xl font-bold text-brand/30">404</p>
      <h1 className="mt-4 font-display text-4xl font-bold uppercase text-white">Clean bowled</h1>
      <p className="mt-3 text-zinc-400">The page you're looking for doesn't exist.</p>
      <Link to="/" className={`${btn.primary} mt-8`}>Back to home</Link>
    </Container>
  )
}
