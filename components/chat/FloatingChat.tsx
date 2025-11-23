'use client'
import React, { useState } from 'react'
import { useFloatingChatStore } from '../../stores/floatingChatStore'
import { IconSend, IconPaperclip, IconX } from 'lucide-react'

export default function FloatingChat({onClose}:{onClose?:()=>void}){
  const messages = useFloatingChatStore(s=>s.messages)
  const sending = useFloatingChatStore(s=>s.sending)
  const sendMessage = useFloatingChatStore(s=>s.sendMessage)
  const cancelCurrent = useFloatingChatStore(s=>s.cancelCurrent)
  const clear = useFloatingChatStore(s=>s.clear)
  const [text,setText] = useState('')

  const submit = async () => {
    if(!text.trim()) return
    await sendMessage(text)
    setText('')
  }

  return (
    <div className='flex flex-col' style={{height:'420px'}}>
      <div className='p-2 flex items-center justify-between border-b'>
        <div className='font-semibold'>NeuroEdge Assistant</div>
        <div className='flex items-center gap-2'>
          <button onClick={clear} className='text-xs px-2 py-1 border rounded'>Clear</button>
          <button onClick={onClose} className='p-1'><IconX/></button>
        </div>
      </div>
      <div className='flex-1 overflow-auto p-3 space-y-3 bg-white'>
        {messages.map((m,i)=>(
          <div key={i} className={`p-2 rounded ${m.role==='user'?'bg-indigo-50 self-end ml-auto':'bg-slate-100'}`}>
            <div className='text-sm whitespace-pre-wrap'>{m.content}{m.streaming ? <span className='inline-block ml-1 animate-pulse'>▌</span> : null}</div>
          </div>
        ))}
      </div>
      <div className='p-3 border-t bg-white'>
        <div className='flex items-center gap-2'>
          <button className='p-2'><IconPaperclip/></button>
          <input value={text} onChange={e=>setText(e.target.value)} className='flex-1 py-2 px-3 rounded border' placeholder='Ask NeuroEdge...' />
          {!sending ? (
            <button onClick={submit} className='p-2 rounded-full send-btn'><IconSend/></button>
          ) : (
            <button onClick={cancelCurrent} className='p-2 rounded-full cancel-btn'>Cancel</button>
          )}
        </div>
        <div className='mt-2 text-xs text-slate-500'>NeuroEdge can make mistakes — check important info.</div>
      </div>
    </div>
  )
}
