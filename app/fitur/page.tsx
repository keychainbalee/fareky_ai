import Navbar from '@/components/Navbar'
import Link from 'next/link'
import {
  Zap,
  Code,
  ShieldCheck,
  Moon,
  Database,
  Bot,
  ArrowRight,
} from 'lucide-react'

export default function FiturPage() {
  const featuresList = [
    {
      icon: Zap,
      title: 'Pemrosesan Response Streaming',
      desc: 'Jawaban dikirimkan secara langsung huruf demi huruf tanpa waktu tunggu lama.',
    },
    {
      icon: Code,
      title: 'Formatting Kode & Markdown',
      desc: 'Dukungan penuh penulisan syntax highlighting kode lengkap dengan tombol salin instan.',
    },
    {
      icon: Bot,
      title: 'Penamaan Judul Percakapan Otomatis',
      desc: 'Sistem menganalisis pesan pertama Anda untuk membuat judul topik riwayat secara otomatis.',
    },
    {
      icon: Database,
      title: 'Persistensi Riwayat Percakapan',
      desc: 'Seluruh percakapan Anda tersimpan rapi di database PostgreSQL dan dapat diakses kembali kapan saja.',
    },
    {
      icon: ShieldCheck,
      title: 'Keamanan Autentikasi',
      desc: 'Login mudah dan aman menggunakan skema Google OAuth dengan enkripsi data terisolasi.',
    },
    {
      icon: Moon,
      title: 'Mode Gelap & Terang',
      desc: 'Tampilan antarmuka yang fleksibel menyesuaikan kenyamanan mata Anda kapan saja.',
    },
  ]

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between overflow-hidden transition-colors">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/15 dark:bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800/60">
            <span>Kapabilitas Sistem</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Semua Fitur Unggulan <br />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">Fareky AI</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Dirancang khusus untuk menghadirkan pengalaman berinteraksi dengan AI yang cepat, intuitif, dan nyaman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">
          {featuresList.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                className="group relative p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/40 transition-all duration-300 space-y-3"
              >
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-500/15 to-indigo-500/15 dark:from-purple-950/70 dark:to-indigo-950/70 text-purple-600 dark:text-purple-400 w-fit group-hover:scale-110 transition-transform duration-200">
                  <Icon size={22} />
                </div>
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">{f.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            )
          })}
        </div>

        <div className="text-center pt-6 animate-fade-in-up delay-200">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-purple-500/25 transition-all duration-200 active:scale-95 group"
          >
            <span>Coba Fitur Sekarang</span>
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