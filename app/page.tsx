'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Zap, Shield, ArrowRight, Bot, Cpu, Lock, MessagesSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between overflow-hidden transition-colors">
      
      {/* Background Ambient Glow Lights */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-purple-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto my-12 md:my-20 space-y-8">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-bold shadow-sm animate-fade-in-down">
          <span>Chatbot Pilihan Anda</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] animate-fade-in-up">
          Fareky AI <br />
          <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400 bg-clip-text text-transparent">
            Asisten Cerdas Tanpa Batas
          </span>
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed animate-fade-in-up delay-100">
          Platform chatbot cerdas untuk menjawab pertanyaan kompleks, penulisan kode presisi, ringkasan materi instan, dan eksplorasi ide secara real-time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-fade-in-up delay-200 pt-2">
          <Link
            href={isLoggedIn ? '/chat' : '/login?next=/chat'}
            className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-base shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 active:scale-95"
          >
            <span>Mulai Chatbot AI</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

          <Link
            href="/fitur"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-purple-500/60 font-bold text-base shadow-sm hover:shadow transition-all duration-200"
          >
            <Cpu size={18} className="text-purple-500" />
            <span>Lihat Semua Fitur</span>
          </Link>
        </div>

        {/* Highlight Grid with Entrance Delay */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full pt-12 text-left animate-fade-in-up delay-300">
          
          <div className="group relative p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/40 transition-all duration-300 space-y-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-500/15 to-indigo-500/15 dark:from-purple-950/70 dark:to-indigo-950/70 text-purple-600 dark:text-purple-400 w-fit group-hover:scale-110 transition-transform duration-200">
              <Zap size={24} />
            </div>
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">Respons Ultra-Cepat</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Memaksimalkan pemrosesan berkecepatan tinggi untuk menghasilkan balasan teks secara streaming dalam hitungan milidetik.
            </p>
          </div>

          <div className="group relative p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/40 transition-all duration-300 space-y-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-500/15 to-indigo-500/15 dark:from-purple-950/70 dark:to-indigo-950/70 text-purple-600 dark:text-purple-400 w-fit group-hover:scale-110 transition-transform duration-200">
              <MessagesSquare size={24} />
            </div>
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">Asisten Multidisiplin</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Siap membantu penulisan kode, pemecahan masalah teknis, materi pembelajaran, hingga teman diskusi dan berbagi cerita harian.
            </p>
          </div>

          <div className="group relative p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/40 transition-all duration-300 space-y-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-500/15 to-indigo-500/15 dark:from-purple-950/70 dark:to-indigo-950/70 text-purple-600 dark:text-purple-400 w-fit group-hover:scale-110 transition-transform duration-200">
              <Lock size={24} />
            </div>
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">Autentikasi Aman</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Terintegrasi dengan Google OAuth via Supabase dan relasi basis data PostgreSQL terstruktur dengan Prisma.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200/60 dark:border-zinc-800/60 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        &copy; {new Date().getFullYear()} Fareky AI. Hak Cipta Dilindungi.
      </footer>
    </div>
  )
}