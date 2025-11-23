import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(()=> ({}))
  // Mock login: accept any username/password and return a token
  const token = 'mock-token-' + Math.random().toString(36).slice(2,9)
  return NextResponse.json({ token, user: { name: body.username || 'guest' } })
}
