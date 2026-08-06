'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
import { Bot, Menu, X, LogOut, MessageSquare, ChevronDown, User as UserIcon, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AuthState {
  user: any
  name: string | null
  email: string | null
  avatar: string | null
  loading: boolean
}

export default function Navbar() {
  const pathname = usePathname()
  const supabase = createClient()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Atomic Auth User State to prevent multi-stage render stutter
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    name: null,
    email: null,
    avatar: null,
    loading: true,
  })

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    const getInitialUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (isMounted) {
          if (user) {
            const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Akun Saya'
            setAuthState({
              user,
              name,
              email: user.email || '',
              avatar: user.user_metadata?.avatar_url || null,
              loading: false,
            })
          } else {
            setAuthState({ user: null, name: null, email: null, avatar: null, loading: false })
          }
        }
      } catch (err) {
        if (isMounted) {
          setAuthState({ user: null, name: null, email: null, avatar: null, loading: false })
        }
      }
    }

    getInitialUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      if (session?.user) {
        const u = session.user
        const name = u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Akun Saya'
        setAuthState({
          user: u,
          name,
          email: u.email || '',
          avatar: u.user_metadata?.avatar_url || null,
          loading: false,
        })
      } else {
        setAuthState({ user: null, name: null, email: null, avatar: null, loading: false })
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Responsive & Fast Logout Handler
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

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Fitur', href: '/fitur' },
    { name: 'Tentang', href: '/tentang' },
  ]

  const { user, name: userName, email: userEmail, avatar: userAvatar, loading: isLoadingAuth } = authState

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md transition-colors duration-200 transform-gpu">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo with Glow Effect */}
        <Link href="/" className="flex items-center gap-2.5 group relative transform-gpu">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 opacity-40 blur-sm group-hover:opacity-80 transition-opacity duration-300" />
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200 ease-out transform-gpu">
              <Bot size={22} />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
            Fareky <span className="text-purple-600 dark:text-purple-400">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100/90 dark:bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1.5 text-sm font-semibold rounded-xl transition-all duration-200 ease-out transform-gpu ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-zinc-800/40'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isLoadingAuth ? (
            <div className="h-9 w-24 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/70 animate-pulse" />
          ) : user ? (
            /* User Dropdown Menu when Logged In */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900/90 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 transition-all duration-200 shadow-sm group transform-gpu"
              >
                <div className="relative">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName || 'User Avatar'}
                      referrerPolicy="no-referrer"
                      className="h-7 w-7 rounded-xl object-cover ring-2 ring-purple-500/30"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                      {userName ? userName.charAt(0).toUpperCase() : <UserIcon size={14} />}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                </div>
                <span className="text-xs font-semibold max-w-[120px] truncate text-zinc-800 dark:text-zinc-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {userName}
                </span>
                <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ease-out transform-gpu ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Box */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-2 z-50 animate-scale-in transform-gpu origin-top-right">
                  <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 mb-1">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{userName}</p>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">{userEmail}</p>
                  </div>

                  <Link
                    href="/chat"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
                  >
                    <MessageSquare size={15} /> Buka Chatbot AI
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <Loader2 size={15} className="animate-spin text-red-500" />
                    ) : (
                      <LogOut size={15} />
                    )}
                    <span>{isLoggingOut ? 'Keluar...' : 'Keluar dari Akun'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Login Button when Not Logged In */
            <Link
              href="/login"
              className="relative group overflow-hidden px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/20 transition-all duration-200 active:scale-95 flex items-center gap-1.5 transform-gpu"
            >
              <span>Masuk</span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle & Actions */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 transition transform-gpu"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-4 py-4 space-y-3 animate-fade-in-down transform-gpu">
          {/* User Status Bar if Logged In */}
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName || 'Avatar'}
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 rounded-xl object-cover"
                />
              ) : (
                <div className="h-9 w-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                  {userName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{userName}</p>
                <p className="text-[10px] text-zinc-400 truncate">{userEmail}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  pathname === link.href
                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {user ? (
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
              <Link
                href="/chat"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20"
              >
                <MessageSquare size={16} /> Buka Chatbot AI
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-50"
              >
                {isLoggingOut ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />}
                <span>{isLoggingOut ? 'Keluar...' : 'Keluar dari Akun'}</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center w-full py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20"
            >
              Masuk dengan Google
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
