'use client'
import { useEffect, useRef } from 'react'

export default function useSSE(path: string, onMessage: (data:any)=>void, opts?: {enabled?:boolean}){
  const esRef = useRef<EventSource|null>(null)
  useEffect(()=>{
    if(!opts?.enabled) return
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '') + path
    const es = new EventSource(base)
    es.onmessage = (e)=> {
      try { onMessage(JSON.parse(e.data)) } catch(e){ onMessage(e.data) }
    }
    es.onerror = (e)=> { console.warn('SSE error', e); es.close() }
    esRef.current = es
    return ()=> es.close()
  },[path])
}
