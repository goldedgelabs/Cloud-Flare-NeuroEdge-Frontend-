import { NextResponse } from 'next/server'
import { getRedisClient } from '../../../lib/redis'
import { parse, serialize } from 'cookie'

export async function POST(req: Request){
  const cookie = req.headers.get('cookie') || ''
  const parsed = parse(cookie)
  const refresh = parsed['ne_refresh']
  if(refresh){
    const redis = await getRedisClient()
    await redis.del(`refresh:${refresh}`)
  }
  const expired = serialize('ne_refresh', '', { httpOnly:true, path:'/', sameSite:'lax', maxAge: 0 })
  const res = NextResponse.json({ ok:true })
  res.headers.set('Set-Cookie', expired)
  return res
}
