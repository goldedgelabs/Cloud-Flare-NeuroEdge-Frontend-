import { NextResponse } from 'next/server'
import { getRedisClient } from '../../../lib/redis'
import { verifyToken } from '../../../lib/jwt'

async function rateLimit(redis:any, key:string, limit:number, windowSec:number){
  const current = await redis.incr(key)
  if(current === 1) { await redis.expire(key, windowSec) }
  return current <= limit
}

export async function GET(req: Request) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if(!base) return NextResponse.json({ error: 'API base not configured' }, { status: 500 })

  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  const verified = token ? verifyToken(token) : null

  const redis = await getRedisClient()
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const key = verified ? `rl:user:${verified.sub}` : `rl:ip:${ip}`
  const ok = await rateLimit(redis, key, 120, 60)
  if(!ok) return NextResponse.json({ error: 'rate limit exceeded' }, { status: 429 })

  const url = new URL(req.url)
  const conv = url.searchParams.get('conversation_id') || url.searchParams.get('conversation') || ''
  if(!conv) return NextResponse.json({ error: 'conversation_id required' }, { status: 400 })

  // Subscribe to Redis channel for conversation events
  const sub = redis.duplicate()
  await sub.connect()
  const channel = `conv:${conv}`

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const onMessage = (message) => {
        // Each message is sent as an SSE "data: <json>\n\n"
        controller.enqueue(encoder.encode(`data: ${message}\n\n`))
      }

      sub.subscribe(channel, (message) => {
        onMessage(message)
      }).catch(err => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error:'subscribe failed' })}\n\n`))
      })

      // When closed, unsubscribe and disconnect
      controller.oncancel = async () => {
        try{ await sub.unsubscribe(channel) }catch{}
        try{ await sub.disconnect() }catch{}
      }
    }
  })

  return new NextResponse(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } })
}
