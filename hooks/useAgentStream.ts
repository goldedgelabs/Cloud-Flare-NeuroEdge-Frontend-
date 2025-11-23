'use client'
import { useEffect, useRef, useState } from 'react'

export default function useAgentStream(agentId:string|number, onLine?: (line:string)=>void, opts?: {protocol?: 'sse'|'ws'}){
  const esRef = useRef<EventSource|null>(null)
  const wsRef = useRef<WebSocket|null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(()=>{
    if(!agentId) return
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    if((opts && opts.protocol === 'ws') || (typeof WebSocket !== 'undefined' && opts?.protocol === 'ws')){
      const url = (process.env.NEXT_PUBLIC_WS_BASE_URL || '').replace(/^http/,'ws') + `/v1/agents/stream?agentId=${agentId}`
      const ws = new WebSocket(url)
      ws.onopen = ()=> setConnected(true)
      ws.onmessage = (m)=> { onLine && onLine(m.data) }
      ws.onclose = ()=> setConnected(false)
      ws.onerror = ()=> setConnected(false)
      wsRef.current = ws
      return ()=> { try{ ws.close() }catch{} }
    } else {
      const url = (base + `/v1/agents/stream?agentId=${agentId}`)
      const es = new EventSource(url)
      es.onopen = ()=> setConnected(true)
      es.onmessage = (e)=> { onLine && onLine(typeof e.data === 'string' ? e.data : JSON.stringify(e.data)) }
      es.onerror = ()=> setConnected(false)
      esRef.current = es
      return ()=> { try{ es.close() }catch{} }
    }
  },[agentId])

  return { connected, stop: ()=>{ if(esRef.current){ try{ esRef.current.close() }catch{} } if(wsRef.current){ try{ wsRef.current.close() }catch{} } } }
}
