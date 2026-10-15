import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  const Icon = toast.tone === 'error' ? AlertCircle : CheckCircle2
  return (
    <div
      key={toast.id}
      role="status"
      className="animate-fade-up fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-xl border border-line bg-panel px-5 py-4 text-sm font-semibold text-white shadow-2xl"
    >
      <Icon size={20} className={toast.tone === 'error' ? 'text-brand' : 'text-emerald-400'} />
      {toast.msg}
    </div>
  )
}
