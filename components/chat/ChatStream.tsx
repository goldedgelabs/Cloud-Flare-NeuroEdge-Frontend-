'use client'
import React from 'react'
import { useChatStore } from '../../stores/chatStore'
import { motion } from 'framer-motion'

function PredictionBadge({p}:{p:{score:number,label:string}}){
  const color = p.score > 0.8 ? 'bg-emerald-100 text-emerald-800' : p.score > 0.5 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
  return <span className={`inline-block px-2 py-1 text-xs rounded ${color} mr-2`}>{p.label} ({Math.round(p.score*100)}%)</span>
}

export default function ChatStream(){
  const messages = useChatStore(s=>s.messages)
  return (
    <div className='space-y-3'>
      {messages.map((m,i)=>(
        <motion.div key={i} initial={{opacity:0, y:8}} animate={{opacity:1,y:0}} className={`p-3 rounded-lg max-w-prose ${m.role==='user'?'bg-indigo-50 self-end ml-auto':'bg-slate-100'}`}>
          <div className='flex flex-col'>
            <div className='text-sm whitespace-pre-wrap break-words'>
              {m.content}
              {m.streaming ? <span className='inline-block ml-1 animate-pulse'>▌</span> : null}
            </div>
            {m.predictions && m.predictions.length>0 && (
              <div className='mt-2'>
                {m.predictions.map((p,pi)=><PredictionBadge key={pi} p={p} />)}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
