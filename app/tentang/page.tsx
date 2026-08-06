import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { Bot, Heart, Shield, ArrowRight } from 'lucide-react'

export default function TentangPage() {
  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between overflow-hidden transition-colors">
      
      {/* Background Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/15 dark:bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-10">
        <div className="text-center space-y-4 animate-fade-in-down">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/25 mb-2 animate-float">
            <Bot size={36} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Mengenal <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">Fareky AI</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Platform interaksi cerdas berkecepatan tinggi yang dibangun khusus untuk produktivitas Anda.
          </p>
        </div>

        <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-8 space-y-6 shadow-xl leading-relaxed text-sm md:text-base text-zinc-700 dark:text-zinc-300 animate-fade-in-up delay-100">
          <section className="space-y-2">
            <h2 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Visi & Misi Platform
            </h2>
            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
              Fareky AI adalah platform kecerdasan buatan serbaguna yang dirancang untuk mendukung efisiensi, kreativitas, dan produktivitas harian Anda. Mulai dari menjawab pertanyaan umum, membantu penulisan dan analisis kode pemrograman, merangkum dokumen, hingga menjadi teman diskusi interaktif.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
            <h2 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Pengalaman & Kecepatan Respons
            </h2>
            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
              Dirancang dengan antarmuka modern yang bersih dan responsif agar dapat digunakan oleh siapa saja tanpa kerumitan. Setiap balasan diproses secara cepat dan disampaikan secara real-time tanpa waktu tunggu lama.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
            <h2 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Privasi & Keamanan Data
            </h2>
            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
              Keamanan dan privasi pengguna adalah prioritas utama kami. Seluruh riwayat percakapan tersimpan secara aman dan hanya dapat diakses melalui autentikasi akun resmi Anda.
            </p>
          </section>
        </div>

        <div className="text-center animate-fade-in-up delay-200">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-purple-500/25 transition-all duration-200 active:scale-95 group"
          >
            <span>Mulai Gunakan Fareky AI</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </main>

      <footer className="relative z-10 border-t border-zinc-200/60 dark:border-zinc-800/60 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        &copy; {new Date().getFullYear()} Fareky AI. Hak Cipta Dilindungi.
      </footer>
    </div>
  )
}
