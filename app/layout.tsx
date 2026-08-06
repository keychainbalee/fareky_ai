import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fareky AI - Asisten Cerdas Tanpa Batas',
  description: 'Platform kecerdasan buatan cerdas untuk menjawab pertanyaan, penulisan kode, ringkasan materi, dan eksplorasi ide secara real-time.',
  icons: {
    icon: '/vercel.svg',
    shortcut: '/vercel.svg',
    apple: '/vercel.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}