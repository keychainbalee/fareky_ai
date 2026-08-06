'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Bot, ArrowLeft, Loader2 } from 'lucide-react'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const nextTarget = searchParams.get('next') || '/'
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGoogleLogin = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextTarget)}`,
        },
      })
    } catch (err) {
      console.error('OAuth error:', err)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-purple-600/20 to-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

      <div className="relative w-full max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-scale-in">
        {/* Tombol Kembali ke Beranda */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>

        {/* Logo & Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/25 mb-2 animate-float">
            <Bot size={32} />
          </div>
          <h1 className="text-2xl font-black tracking-tight flex items-center justify-center gap-1.5">
            Masuk ke Fareky <span className="text-purple-600 dark:text-purple-400">AI</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
            Gunakan akun Google Anda untuk melanjutkan ke antarmuka percakapan interaktif.
          </p>
        </div>

        {/* Tombol Login Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-bold transition-all duration-200 shadow-md active:scale-95 disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin text-purple-600" />
          ) : (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{isSubmitting ? 'Mengarahkan ke Google...' : 'Lanjutkan dengan Google'}</span>
        </button>

        <p className="text-[11px] text-center text-zinc-400 leading-relaxed">
          Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi Fareky AI.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={28} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
