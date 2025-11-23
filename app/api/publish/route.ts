import { NextResponse } from 'next/server'
import { getRedisClient } from '../../lib/redis'

export async function POST(req: Request){
  const secret = process.env.NE_PUBLISH_SECRET || ''
  const auth = req.headers.get('x-ne-auth') || ''
  if(secret && auth !== secret) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(()=>({}))
  const { conversation_id, payload } = body
  if(!conversation_id || !payload) return NextResponse.json({ error: 'conversation_id and payload required' }, { status: 400 })

  const redis = await getRedisClient()
  await redis.publish(`conv:${conversation_id}`, JSON.stringify(payload))
  return NextResponse.json({ ok:true })
}
