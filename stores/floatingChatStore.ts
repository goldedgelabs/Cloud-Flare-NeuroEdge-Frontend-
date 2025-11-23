'use client'
import create from 'zustand'
import axios from 'axios'

type Msg = { role: 'user'|'assistant'|'system', content: string, id?: string, streaming?: boolean }

type FloatingChatState = {
  messages: Msg[],
  sending: boolean,
  sendMessage: (text:string)=>Promise<void>,
  cancelCurrent: ()=>void,
  clear: ()=>void
}

export const useFloatingChatStore = create<FloatingChatState>((set,get)=>({
  messages: [{role:'system', content:'Hello from NeuroEdge Assistant.'}],
  sending: false,
  sendMessage: async (text) => {
    const msgs = get().messages.concat({role:'user', content:text})
    set({ messages: msgs, sending: true })

    const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    let conversationId = undefined
    try {
      const post = await axios.post(base + '/v1/chat', { input: text, context: 'floating' })
      conversationId = post.data?.conversation_id || post.data?.id || Math.random().toString(36).slice(2,9)
    } catch(err){
      conversationId = Math.random().toString(36).slice(2,9)
    }

    const assistantMsg: Msg = { role: 'assistant', content: '', id: conversationId, streaming: true }
    set({ messages: get().messages.concat(assistantMsg) })

    const esUrl = (base + '/v1/chat/stream?conversation_id=' + conversationId + '&context=floating')
    const es = new EventSource(esUrl)
    (window as any).__ne_floating_es = es

    es.addEventListener('token', (e:any) => {
      try {
        const d = JSON.parse(e.data)
        const token = d.token ?? d.text ?? e.data
        set(s => {
          const msgs = s.messages.map(m => {
            if(m.role === 'assistant' && m.id === conversationId){
              return {...m, content: (m.content || '') + token, streaming: true}
            }
            return m
          })
          return { messages: msgs }
        })
      } catch(err){
        const token = e.data
        set(s => {
          const msgs = s.messages.map(m => {
            if(m.role === 'assistant' && m.id === conversationId){
              return {...m, content: (m.content || '') + token, streaming: true}
            }
            return m
          })
          return { messages: msgs }
        })
      }
    })

    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data)
        if(data.event === 'done' || data.status === 'done'){
          set(s => {
            const msgs = s.messages.map(m => {
              if(m.role === 'assistant' && m.id === conversationId){
                return {...m, streaming: false}
              }
              return m
            })
            return { messages: msgs, sending: false }
          })
          es.close()
          delete (window as any).__ne_floating_es
        }
      } catch(e){}
    }

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
      delete (window as any).__ne_floating_es
    }
  },
  cancelCurrent: ()=> {
    const es = (window as any).__ne_floating_es as EventSource|undefined
    if(es){ try{ es.close() } catch{}; delete (window as any).__ne_floating_es }
    set(s => {
      const msgs = s.messages.map(m => m.streaming ? {...m, streaming:false, content: (m.content||'') + '\n[cancelled]'} : m)
      return { messages: msgs, sending: false }
    })
  },
  clear: ()=> set({ messages: [{role:'system', content:'Hello from NeuroEdge Assistant.'}] })
}))
export default useFloatingChatStore
