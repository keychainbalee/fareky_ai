'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import {
  User as UserIcon,
  Mail,
  Calendar,
  ShieldCheck,
  MessageSquare,
  LogOut,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react'

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [totalConversations, setTotalConversations] = useState<number>(0)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        setUser(user)

        // Fetch total conversation count for user
        const res = await fetch('/api/conversations')
        if (res.ok) {
          const convs = await res.json()
          setTotalConversations(Array.isArray(convs) ? convs.length : 0)
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [supabase, router])

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      window.location.href = '/login'
    }
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between overflow-x-clip transition-colors">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Loader2 size={36} className="animate-spin text-purple-600 dark:text-purple-400" />
          <p className="text-xs text-zinc-500 font-semibold">Memuat profil pengguna...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Pengguna Fareky AI'
  const userEmail = user.email || '-'
  const userAvatar = user.user_metadata?.avatar_url || null
  const createdAtFormatted = user.created_at
    ? new Date(user.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-'
  const provider = user.app_metadata?.provider || 'Google OAuth'

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between overflow-x-clip transition-colors">
      {/* Background Ambient Glow Lights */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-purple-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 md:px-6 py-10 md:py-16 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-bold shadow-sm">
            <ShieldCheck size={14} />
            <span>Akun Terverifikasi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Profil <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">Pengguna</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Kelola informasi akun Anda dan pantau riwayat percakapan di Fareky AI.
          </p>
        </div>

        {/* Profile Card Main */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 animate-fade-in-up delay-100">
          
          {/* Top User Header Card */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60">
            <div className="relative">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  referrerPolicy="no-referrer"
                  className="h-24 w-24 rounded-3xl object-cover ring-4 ring-purple-500/30 shadow-lg"
                />
              ) : (
                <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-3xl shadow-lg">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-zinc-900 shadow-md" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 truncate">
                  {userName}
                </h2>
                <CheckCircle2 size={18} className="text-purple-600 dark:text-purple-400 shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 truncate flex items-center justify-center sm:justify-start gap-1.5">
                <Mail size={14} className="shrink-0" />
                <span>{userEmail}</span>
              </p>
              <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800/60">
                  ● Sesi Aktif
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-bold border border-purple-200 dark:border-purple-800/60 capitalize">
                  {provider}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Calendar size={13} className="text-purple-500" /> Member Sejak
              </span>
              <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                {createdAtFormatted}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <MessageSquare size={13} className="text-purple-500" /> Total Percakapan
              </span>
              <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                {totalConversations} Percakapan
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Lock size={13} className="text-purple-500" /> Metode Autentikasi
              </span>
              <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 capitalize">
                {provider}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <UserIcon size={13} className="text-purple-500" /> ID Pengguna
              </span>
              <p className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 truncate">
                {user.id}
              </p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/chat"
              className="flex-1 w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-purple-500/25 transition-all duration-200 active:scale-95 group"
            >
              <MessageSquare size={18} />
              <span>Buka Chatbot AI</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 font-bold text-sm transition-all duration-200 active:scale-95 disabled:opacity-60"
            >
              {isLoggingOut ? (
                <Loader2 size={18} className="animate-spin text-red-500" />
              ) : (
                <LogOut size={18} />
              )}
              <span>{isLoggingOut ? 'Mengeluarkan Akun...' : 'Keluar dari Akun'}</span>
            </button>
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
