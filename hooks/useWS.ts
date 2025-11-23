'use client'
import { useEffect, useRef } from 'react'

export default function useWS(path: string, onMessage: (m:MessageEvent)=>void, opts?: {protocols?: string| string[]}){
  const wsRef = useRef<WebSocket|null>(null)
  useEffect(()=>{
    const base = (process.env.NEXT_PUBLIC_WS_BASE_URL || '').replace(/^http/,'ws') + path
    const ws = new WebSocket(base, opts?.protocols)
    ws.onopen = ()=> console.log('WS open', base)
    ws.onmessage = onMessage
    ws.onclose = ()=> console.log('WS closed')
    ws.onerror = (e)=> console.warn('WS error', e)
    wsRef.current = ws
    return ()=> { if(ws.readyState === WebSocket.OPEN) ws.close() }
  },[path])
  return wsRef
}
