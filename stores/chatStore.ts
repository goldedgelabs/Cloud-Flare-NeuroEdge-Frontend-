'use client'
import create from 'zustand'
import axios from 'axios'

type Msg = { role: 'user'|'assistant'|'system', content: string, id?: string, streaming?: boolean, predictions?: {score:number,label:string}[] }

type ChatState = {
  messages: Msg[],
  sending: boolean,
  sendMessage: (text:string)=>Promise<void>,
  cancelCurrent: ()=>void,
  addPredictionToLast: (p:{score:number,label:string})=>void
}

function parseSSEEventData(e: MessageEvent | any){
  try{
    const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
    return data
  }catch(err){
    return { raw: String(e.data) }
  }
}

export const useChatStore = create<ChatState>((set,get)=>({
  messages: [{role:'system', content:'Welcome to NeuroEdge.'}],
  sending: false,
  sendMessage: async (text) => {
    const msgs = get().messages.concat({role:'user', content:text})
    set({ messages: msgs, sending: true })

    const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    let conversationId = undefined
    try {
      const post = await axios.post(base + '/v1/chat', { input: text })
      conversationId = post.data?.conversation_id || post.data?.id || Math.random().toString(36).slice(2,9)
    } catch(err){
      conversationId = Math.random().toString(36).slice(2,9)
    }

    const assistantMsg: Msg = { role: 'assistant', content: '', id: conversationId, streaming: true, predictions: [] }
    set({ messages: get().messages.concat(assistantMsg) })

    // prefer websocket if configured
    const wsBase = process.env.NEXT_PUBLIC_WS_BASE_URL || ''
    if(wsBase){
      const wsUrl = wsBase.replace(/^http/,'ws') + `/v1/chat/ws?conversation_id=${conversationId}`
      try{
        const ws = new WebSocket(wsUrl)
        (window as any).__ne_current_ws = ws
        ws.onmessage = (m)=>{
          const ev = { data: m.data }
          handleEvent(ev)
        }
        ws.onerror = (e)=> console.warn('WS error', e)
        ws.onclose = ()=> { set(s=>({ messages: s.messages.map(m=> m.id===conversationId?{...m, streaming:false}:m), sending:false })) }
        // don't open EventSource if WS is available
      }catch(e){ console.warn('ws open failed, falling back to SSE', e) }
    }

    const esUrl = (base + '/v1/chat/stream?conversation_id=' + conversationId)
    const es = new EventSource(esUrl)
    (window as any).__ne_current_es = es

    const handleEvent = (ev:any) => {
      const data = parseSSEEventData(ev)
      const token = data?.token || data?.text || (data?.delta && data.delta?.content)
      if(token){
        set(s => {
          const msgs = s.messages.map(m => {
            if(m.role === 'assistant' && m.id === conversationId){
              return {...m, content: (m.content || '') + String(token), streaming: true}
            }
            return m
          })
          return { messages: msgs }
        })
        return
      }
      if(data?.event === 'done' || data?.status === 'done' || data?.done === true){
        set(s => {
          const msgs = s.messages.map(m => {
            if(m.role === 'assistant' && m.id === conversationId){
              return {...m, streaming: false}
            }
            return m
          })
          return { messages: msgs, sending: false }
        })
        try{ es.close() }catch{}
        delete (window as any).__ne_current_es
      }
      if(data?.predictions){
        set(s => {
          const msgs = s.messages.map(m => {
            if(m.role === 'assistant' && m.id === conversationId){
              return {...m, predictions: data.predictions}
            }
            return m
          })
          return { messages: msgs }
        })
      }
    }

    es.onmessage = handleEvent
    es.addEventListener('token', handleEvent)
    es.addEventListener('delta', handleEvent)
    es.onerror = (e) => {
      set(s => {
        const msgs = s.messages.map(m => {
          if(m.role === 'assistant' && m.id === conversationId){
            return {...m, streaming: false, content: (m.content || '') + '\n[stream error]'}
          }
          return m
        })
        return { messages: msgs, sending: false }
      })
      try{ es.close() }catch{}
      delete (window as any).__ne_current_es
    }
  },
  cancelCurrent: ()=> {
    const es = (window as any).__ne_current_es as EventSource|undefined
    if(es){
      try{ es.close() } catch {}
      delete (window as any).__ne_current_es
    }
    set(s => {
      const msgs = s.messages.map(m => m.streaming ? {...m, streaming:false, content: (m.content||'') + '\n[cancelled]'} : m)
      return { messages: msgs, sending: false }
    })
  },
  addPredictionToLast: (p) => set(s=>{
    const msgs = s.messages.map((m,i,arr) => {
      if(i === arr.length-1 && m.role === 'assistant'){
        return {...m, predictions: [...(m.predictions||[]), p]}
      }
      return m
    })
    return { messages: msgs }
  })
}))
export default useChatStore
