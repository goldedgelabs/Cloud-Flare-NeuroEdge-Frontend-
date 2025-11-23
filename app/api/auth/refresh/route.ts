import { NextResponse } from 'next/server'
import { getRedisClient } from '../../../lib/redis'
import { signAccess, verifyToken } from '../../../lib/jwt'
import { parse } from 'cookie'

export async function POST(req: Request){
  const headers = req.headers
  const cookie = headers.get('cookie') || ''
  const parsed = parse(cookie)
  const refresh = parsed['ne_refresh']
  if(!refresh) return NextResponse.json({ error: 'no refresh' }, { status: 401 })

  const redis = await getRedisClient()
  const stored = await redis.get(`refresh:${refresh}`)
  if(!stored) return NextResponse.json({ error: 'invalid refresh' }, { status: 401 })
  const data = JSON.parse(stored)
  // optionally verify token signature
  const verified = verifyToken(refresh)
  if(!verified) return NextResponse.json({ error: 'invalid refresh token' }, { status: 401 })

  const access = signAccess({ sub: data.user.id, username: data.user.username })
  return NextResponse.json({ access, user: data.user })
}
