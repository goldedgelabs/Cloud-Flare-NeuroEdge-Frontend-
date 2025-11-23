import { NextResponse } from 'next/server'
import { getRedisClient } from '../../../lib/redis'
import { signAccess, signRefresh } from '../../../lib/jwt'
import { serialize } from 'cookie'

export async function POST(req: Request){
  const body = await req.json().catch(()=>({}))
  const { username, password } = body
  // In production validate user properly (DB). Here mock: accept any user, optionally check password length.
  if(!username) return NextResponse.json({ error: 'username required' }, { status: 400 })

  const user = { id: 'user:' + username, username }

  const access = signAccess({ sub: user.id, username: user.username })
  const refresh = signRefresh({ sub: user.id })

  const redis = await getRedisClient()
  // store refresh token in redis with TTL (7d)
  await redis.setEx(`refresh:${refresh}`, 60*60*24*7, JSON.stringify({ user }))

  // set httpOnly secure cookie for refresh token
  const cookie = serialize('ne_refresh', refresh, { httpOnly: true, path: '/', secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60*60*24*7 })
  const res = NextResponse.json({ access, user })
  res.headers.set('Set-Cookie', cookie)
  return res
}
