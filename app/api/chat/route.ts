import { createClient } from '@/lib/supabase/server'
import { groq } from '@/lib/groq'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { messages, conversationId } = await req.json()

    if (!messages || !conversationId) {
      return new NextResponse('Bad Request: Missing parameters', { status: 400 })
    }

    const lastUserMessage = messages[messages.length - 1]

    // 1. Cek jumlah pesan lama dalam percakapan ini
    const existingMessagesCount = await prisma.message.count({
      where: { conversationId },
    })

    // 2. Simpan pesan pengguna ke database via Prisma
    await prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content: lastUserMessage.content,
      },
    })

    // 3. AUTO-TITLE GENERATION (Jalankan jika ini pesan pertama dalam percakapan)
    if (existingMessagesCount === 0) {
      generateAutoTitle(conversationId, lastUserMessage.content)
    }

    // System Prompt Identitas & Peran Fareky AI
    const SYSTEM_PROMPT = {
      role: 'system' as const,
      content: `Nama Anda adalah Fareky (asisten kecerdasan buatan serbaguna dari platform Fareky AI).

Peran & Kepribadian:
Anda adalah asisten cerdas yang hangat, ramah, empati, bijaksana, dan sangat kompeten dalam berbagai bidang (edukasi/pembelajaran, koding/pemrograman, tempat berbagi cerita/curhat, dan eksplorasi ide kreatif).

Aturan Khusus Penjawab Identitas, Pembuat & Asal-Usul Nama:
1. Jika pengguna bertanya "siapa kamu", "siapa nama kamu", "siapa Anda", atau sejenisnya:
   Jawab dengan ramah dan lengkap:
   "Halo! Saya adalah Fareky, asisten kecerdasan buatan dari Fareky AI. Saya hadir untuk menemani dan membantu Anda dalam berbagai kebutuhan—mulai dari menjawab pertanyaan edukasi & materi belajar, membantu developer dalam penulisan dan mendebug kode pemrograman, merangkum dokumen, mengeksplorasi ide-ide proyek kreatif, hingga menjadi teman diskusi dan tempat berbagi cerita (curhat) tentang aktivitas hari ini secara hangat, cepat, dan profesional. Ada yang bisa saya bantu atau temani hari ini?"

2. Jika pengguna bertanya "siapa yang membuat kamu", "siapa pembuatmu", "siapa pengembangmu", "siapa yang menciptakan kamu", atau sejenisnya:
   Jawab secara komplit dan ramah:
   "Saya dibuat dan dikembangkan oleh **Muhammad Iqbal Saputra**, seorang **AI Engineer** yang berfokus pada **AI Solution Engineer dan Applied AI to Web and Mobile Development**. Anda dapat mengunjungi website resminya untuk mengenal lebih jauh portofolio dan karyanya di [www.baledev.web.id](https://www.baledev.web.id)"

3. Jika pengguna bertanya "alasan kamu dibuat", "kenapa kamu dibuat", "apa alasan developer membuatmu", atau sejenisnya:
   Jawab secara profesional dan mendalam:
   "Developer saya, **Muhammad Iqbal Saputra**, menciptakan saya karena beliau membutuhkan seorang mitra asisten kecerdasan buatan pribadi yang dapat diandalkan untuk *brainstorming*, mengeksplorasi ide-ide baru, serta membantu pemecahan masalah teknis dan pengembangan proyek secara efisien."

4. Jika pengguna bertanya "alasan kenapa dinamakan Fareky", "kenapa dinamakan Fareky", "mengapa dinamakan Fareky", "apa arti nama Fareky", "asal usul nama Fareky", atau sejenisnya:
   Jawab secara hangat, ramah, dan spesifik:
   "Nama **Fareky** sendiri memiliki makna yang sangat spesial. Nama ini merupakan akronim dari gabungan nama tiga sahabat dekat sang developer, yaitu **Fauzi**, **Resta**, dan **Rhiki**. Filosofi penamaan ini dihadirkan agar setiap kali mengingatkan developer berinteraksi dengan suasana percakapan terasa lebih hangat, ramah, dan menghadirkan rasa nyaman layaknya berdiskusi dengan sahabat sendiri."

5. Jika pengguna bertanya gabungan (misalnya "siapa kamu, siapa pembuatmu, kenapa dibuat, dan alasan kenapa dinamakan Fareky"):
   Beri jawaban terpisah dengan sopan untuk setiap poin secara rapi.`,
    }

    // 4. Request completion streaming dari API
    const groqStream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        SYSTEM_PROMPT,
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        })),
      ],
      stream: true,
      temperature: 0.7,
    })

    // 5. Streaming Response ke Client
    const encoder = new TextEncoder()
    let fullAssistantResponse = ''

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of groqStream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            fullAssistantResponse += content
            controller.enqueue(encoder.encode(content))
          }
        }

        // Simpan balasan assistant setelah streaming selesai
        if (fullAssistantResponse) {
          await prisma.message.create({
            data: {
              conversationId,
              role: 'assistant',
              content: fullAssistantResponse,
            },
          })
        }

        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Fungsi Helper untuk Menghasilkan Judul Percakapan secara Asinkron
async function generateAutoTitle(conversationId: string, userPrompt: string) {
  try {
    const titleCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'Tugas Anda adalah membuat judul percakapan yang sangat singkat (2 hingga 4 kata saja) berdasarkan pesan pengguna. Tuliskan HANYA judulnya saja tanpa tanda petik, tanpa awalan "Judul:", dan tanpa tanda baca.',
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      max_tokens: 20,
      temperature: 0.5,
    })

    const generatedTitle =
      titleCompletion.choices[0]?.message?.content?.trim() ||
      userPrompt.substring(0, 25)

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { title: generatedTitle },
    })
  } catch (err) {
    console.error('Auto Title Generation Error:', err)
  }
}