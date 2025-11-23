'use client'
import React from 'react'
import ChatStream from './ChatStream'
import ChatInput from './ChatInput'
import { useChatStore } from '../../stores/chatStore'

export default function ChatWidget({onClose}:{onClose?:()=>void}){
  const last = useChatStore(s => s.messages[s.messages.length-1])
  return (
    <div className='flex flex-col' style={{height: '420px'}}>
      <div className='p-2 border-b flex items-center justify-between bg-white'>
        <div>
          <div className='font-semibold'>Conversation</div>
          {last?.predictions && last.predictions.length>0 && (
            <div className='text-xs text-slate-500 mt-1'>
              {last.predictions.map((p:any,i:number)=>(<span key={i} className='inline-block mr-2 px-2 py-1 text-xs rounded bg-slate-100'>{p.label} ({Math.round(p.score*100)}%)</span>))}
            </div>
          )}
        </div>
        <div className='text-xs text-slate-400'>Live</div>
      </div>

      <div className='flex-1 overflow-auto p-3 bg-white'>
        <ChatStream />
      </div>
      <div className='p-3 border-t bg-white'>
        <ChatInput />
      </div>
    </div>
  )
}
