'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'
import { Bot, User } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isLoading?: boolean
}

export default function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div
      className={`flex items-start gap-3 md:gap-4 max-w-4xl mx-auto px-2 md:px-0 ${
        isUser ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Avatar Icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md overflow-hidden ${
          isUser
            ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
            : 'border border-zinc-700/50'
        }`}
      >
        {isUser ? (
          <User size={18} />
        ) : (
          <img src="/fareky-logo.jpg" alt="Fareky AI" className="h-full w-full object-cover rounded-xl" />
        )}
      </div>

      {/* Bubble Content */}
      <div
        className={`relative p-4 md:p-5 rounded-2xl text-sm leading-relaxed max-w-[88%] md:max-w-[82%] shadow-sm transition-all ${
          isUser
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
            : 'bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none'
        }`}
      >
        {content ? (
          isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose dark:prose-invert prose-purple max-w-none text-sm space-y-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <CodeBlock
                        language={match[1]}
                        value={String(children).replace(/\n$/, '')}
                      />
                    ) : (
                      <code
                        className="bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-mono text-xs"
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                  },
                  a({ href, children }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-600 dark:text-purple-400 underline font-medium hover:text-purple-700"
                      >
                        {children}
                      </a>
                    )
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )
        ) : isLoading ? (
          <div className="flex items-center gap-1.5 py-1 text-purple-500">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce" />
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
          </div>
        ) : null}
      </div>
    </div>
  )
}