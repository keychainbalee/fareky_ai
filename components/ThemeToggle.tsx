'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const mounted = useIsMounted()

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
    )
  }

  const isDark = resolvedTheme === 'dark' || theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 border border-zinc-200/80 dark:border-zinc-700/60 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 group"
      aria-label={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
      title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun size={17} className="text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon size={17} className="text-purple-600 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </div>
    </button>
  )
}
