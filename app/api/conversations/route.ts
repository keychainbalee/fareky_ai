import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 1. Ambil Semua Percakapan Pengguna
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Fetch Conversations Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// 2. Buat Percakapan Baru
export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const newChat = await prisma.conversation.create({
      data: {
        userId: user.id,
        title: 'Chat Baru',
      },
    })

    return NextResponse.json(newChat)
  } catch (error) {
    console.error('Create Conversation Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// 3. Hapus Percakapan
export async function DELETE(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return new NextResponse('Missing conversation ID', { status: 400 })
    }

    await prisma.conversation.delete({
      where: {
        id,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete Conversation Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}