'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
import ChatMessage from '@/components/ChatMessage'
import {
  Send,
  Plus,
  LogOut,
  Bot,
  Trash2,
  Menu,
  X,
  MessageSquare,
  Code2,
  HeartHandshake,
  Lightbulb,
  Loader2,
  Home,
} from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  title: string
  createdAt: string
}

const SUGGESTIONS = [
  {
    icon: Code2,
    label: 'Developer & Koding',
    prompt: 'Bantu saya menulis kode pemrograman yang bersih, optimasi algoritma, atau mendebug kendala koding.',
  },
  {
    icon: HeartHandshake,
    label: 'Cerita Hari Ini',
    prompt: 'Saya ingin berbagi cerita atau curhat tentang aktivitas, tantangan, dan perasaan saya hari ini.',
  },
  {
    icon: Lightbulb,
    label: 'Ide Proyek Kreatif',
    prompt: 'Berikan 3 ide proyek web, aplikasi AI, dan solusi teknologi inovatif yang menarik untuk saya kembangkan.',
  },
]

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // State Informasi Akun Pengguna
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)

  const supabase = createClient()
  const router = useRouter()
  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const selectChat = useCallback(async (id: string) => {
    setCurrentChatId(id)
    setIsSidebarOpen(false)
    try {
      const res = await fetch(`/api/messages?conversationId=${id}`)
      if (!res.ok) return

      const data: Message[] = await res.json()
      setMessages(data)
    } catch (error) {
      console.error('Fetch Messages Error:', error)
    }
  }, [])

  const createNewChat = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations', { method: 'POST' })
      if (!res.ok) return

      const newChat: Conversation = await res.json()
      setConversations((prev) => [newChat, ...prev])
      setCurrentChatId(newChat.id)
      setMessages([])
      setIsSidebarOpen(false)
    } catch (error) {
      console.error('Create Chat Error:', error)
    }
  }, [])

  // 1. Ambil Profil Pengguna dari Google Metadata & Percakapan
  const initChatData = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      // Ekstrak data profil Google
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        'Pengguna'
      
      setUserName(fullName)
      setUserEmail(user.email || '')
      setUserAvatar(user.user_metadata?.avatar_url || null)

      const res = await fetch('/api/conversations')
      if (!res.ok) throw new Error('Gagal mengambil data percakapan')

      const data: Conversation[] = await res.json()

      if (data && data.length > 0) {
        setConversations(data)
        await selectChat(data[0].id)
      } else {
        await createNewChat()
      }
    } catch (error) {
      console.error('Init Error:', error)
    }
  }, [supabase, selectChat, createNewChat])

  useEffect(() => {
    initChatData()
  }, [initChatData])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [input])

  const deleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Apakah Anda yakin ingin menghapus chat ini?')) return

    try {
      const res = await fetch(`/api/conversations?id=${id}`, { method: 'DELETE' })
      if (!res.ok) return

      const updated = conversations.filter((c) => c.id !== id)
      setConversations(updated)

      if (currentChatId === id) {
        if (updated.length > 0) {
          selectChat(updated[0].id)
        } else {
          createNewChat()
        }
      }
    } catch (error) {
      console.error('Delete Chat Error:', error)
    }
  }

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

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || !currentChatId || isLoading) return

    const isFirstMessage = messages.length === 0
    const userMsg: Message = { role: 'user', content: textToSend }
    const updatedMessages = [...messages, userMsg]

    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          conversationId: currentChatId,
        }),
      })

      if (!response.body) return

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulatedText += chunk
        const currentStreamedText = accumulatedText

        setMessages((prev) => {
          const newMsgs = [...prev]
          newMsgs[newMsgs.length - 1] = {
            ...newMsgs[newMsgs.length - 1],
            content: currentStreamedText,
          }
          return newMsgs
        })
      }

      if (isFirstMessage) {
        setTimeout(async () => {
          const res = await fetch('/api/conversations')
          if (res.ok) {
            const data = await res.json()
            setConversations(data)
          }
        }, 1200)
      }
    } catch (err) {
      console.error('Error streaming response:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden animate-fade-in">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-4 transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-md overflow-hidden shrink-0">
                <img src="/fareky-logo.jpg" alt="Fareky AI Logo" className="h-full w-full object-cover rounded-xl" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                Fareky <span className="text-purple-600 dark:text-purple-400">AI</span>
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={createNewChat}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 transition-all duration-200 active:scale-95"
            >
              <Plus size={16} /> Chat Baru
            </button>
            <button
              onClick={() => router.push('/')}
              title="Ke Beranda Utama"
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
            >
              <Home size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-2">
              Riwayat Percakapan
            </span>
            {conversations.map((chat) => (
              <div
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-all duration-200 ${
                  currentChatId === chat.id
                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-semibold border border-purple-200/80 dark:border-purple-800/60 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MessageSquare size={14} className="shrink-0 text-purple-500" />
                  <span className="truncate">{chat.title}</span>
                </div>
                <button
                  onClick={(e) => deleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition p-1"
                  title="Hapus Chat"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Indikator Akun Pengguna di Bottom Sidebar */}
          <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between px-1 gap-2">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName || 'Profile'}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full border border-purple-200 dark:border-purple-800 shrink-0 object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                    {userName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold truncate text-zinc-800 dark:text-zinc-200">
                    {userName}
                  </span>
                  <span className="text-[10px] truncate text-zinc-400">
                    {userEmail}
                  </span>
                </div>
              </div>
              <ThemeToggle />
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center justify-center gap-2 w-full text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs py-2 rounded-xl transition duration-150 font-semibold disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 size={15} className="animate-spin text-red-500" />
              ) : (
                <LogOut size={15} />
              )}
              <span>{isLoggingOut ? 'Keluar...' : 'Keluar dari Akun'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-bold text-sm md:text-base text-zinc-800 dark:text-zinc-200 flex items-center gap-2 truncate">
              <span className="truncate">
                {conversations.find((c) => c.id === currentChatId)?.title || 'Fareky AI'}
              </span>
            </h2>
          </div>

          {/* Indikator Profil Ringkas di Top Header Bar */}
          <div className="flex items-center gap-2 pl-2 shrink-0">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName || 'User'}
                referrerPolicy="no-referrer"
                className="h-7 w-7 rounded-full border border-purple-300 dark:border-purple-700 object-cover"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                {userName?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="hidden sm:inline text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {userName}
            </span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-2xl mx-auto animate-fade-in-up">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl animate-float overflow-hidden">
                <img src="/fareky-logo.jpg" alt="Fareky AI Logo" className="h-full w-full object-cover rounded-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight">
                  Halo, {userName}!
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Ada yang bisa Fareky AI bantu hari ini? Pilih saran di bawah atau ketik pertanyaan Anda.
                </p>
              </div>

              {/* Suggestions Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full pt-2">
                {SUGGESTIONS.map((s, idx) => {
                  const Icon = s.icon
                  return (
                    <button
                      key={idx}
                      onClick={() => sendMessage(s.prompt)}
                      className="flex flex-col items-start gap-2 p-4 text-left rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-purple-500/80 dark:hover:border-purple-500/80 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all duration-200 group shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                      <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-200" />
                      <div>
                        <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          {s.label}
                        </span>
                        <span className="block text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5">
                          {s.prompt}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage
                key={index}
                role={msg.role}
                content={msg.content}
                isLoading={isLoading && index === messages.length - 1}
              />
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage(input)
            }}
            className="max-w-4xl mx-auto flex items-end gap-2 bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/70 rounded-2xl p-2 focus-within:border-purple-500 dark:focus-within:border-purple-500 transition shadow-sm"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Kirim pesan ke Fareky AI... (Shift+Enter untuk baris baru)"
              className="flex-1 bg-transparent px-3 py-1.5 text-sm focus:outline-none resize-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 max-h-40"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-30 text-white p-2.5 rounded-xl transition-all duration-200 shadow-md shadow-purple-500/20 shrink-0 mb-0.5 active:scale-95"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
