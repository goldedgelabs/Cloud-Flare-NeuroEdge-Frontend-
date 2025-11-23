'use client'
import { useEffect, useRef } from 'react'

export default function useWSChat(conversationId: string|number, onToken: (token:string)=>void, onDone?: ()=>void){
  const wsRef = useRef<WebSocket|null>(null)
  useEffect(()=>{
    const base = process.env.NEXT_PUBLIC_WS_BASE_URL || ''
    if(!base) return
    const url = base.replace(/^http/,'ws') + `/v1/chat/ws?conversation_id=${conversationId}`
    const ws = new WebSocket(url)
    ws.onopen = ()=> console.log('chat WS open', url)
    ws.onmessage = (m) => {
      try {
        const d = JSON.parse(m.data)
        if(d.token) onToken(String(d.token))
        else if(d.text) onToken(String(d.text))
        else if(d.event === 'done' || d.status === 'done') { if(onDone) onDone() }
        else onToken(String(m.data))
      } catch(e){
        onToken(String(m.data))
      }
    }
    ws.onerror = (e)=> console.warn('WS error', e)
    ws.onclose = ()=> console.log('WS closed')
    wsRef.current = ws
    return ()=> { try{ ws.close() }catch{} }
  },[conversationId])
  return wsRef
}
