import { NextResponse } from 'next/server'
import { getRedisClient } from '../../../lib/redis'
import { verifyToken } from '../../../lib/jwt'

const MAX_PER_WINDOW = 120
const WINDOW = 60 // seconds

async function rateLimit(redis:any, key:string, limit:number, windowSec:number){
  const current = await redis.incr(key)
  if(current === 1) { await redis.expire(key, windowSec) }
  return current <= limit
}

export async function POST(req: Request) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if(!base) return NextResponse.json({ error: 'API base not configured' }, { status: 500 })

  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  const verified = token ? verifyToken(token) : null
  const redis = await getRedisClient()

  // rate limiting: per-user if token, else per-ip
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const key = verified ? `rl:user:${verified.sub}` : `rl:ip:${ip}`
  const ok = await rateLimit(redis, key, MAX_PER_WINDOW, WINDOW)
  if(!ok) return NextResponse.json({ error: 'rate limit exceeded' }, { status: 429 })

  const url = new URL(req.url)
  const path = url.searchParams.get('path') || ''
  const target = base.replace(/\/$/,'') + '/' + path.replace(/^\//,'')

  const body = await req.text()
  const headers = Object.fromEntries(req.headers)
  delete headers['host']
  delete headers['x-vercel-id']
  // forward authorization header as well if present
  const res = await fetch(target, { method: 'POST', body, headers })
  const text = await res.text()
  return new NextResponse(text, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'text/plain' } })
}
