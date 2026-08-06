'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  language: string
  value: string
}

export default function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-4 overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-950 font-mono text-xs shadow-lg">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between bg-zinc-900 px-4 py-2 text-zinc-400 border-b border-zinc-800">
        <span className="font-semibold text-purple-400 uppercase tracking-wider text-[11px]">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Salin Kode</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-2 overflow-x-auto">
        <SyntaxHighlighter
          language={language || 'text'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.85rem',
            lineHeight: '1.5',
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}