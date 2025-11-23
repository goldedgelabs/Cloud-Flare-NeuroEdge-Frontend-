'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingChat from './chat/FloatingChat'
import FloatingChatButton from './chat/FloatingChatButton'

export default function FloatingAssistant(){
  const [open, setOpen] = useState(false)
  return (
    <div className='neuro-bubble'>
      <AnimatePresence>
      {open ? (
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} className='w-[420px]'>
          <div className='bg-white shadow-xl rounded-xl overflow-hidden'>
            <div className='p-2 text-xs text-slate-500 border-b'>NeuroEdge can make mistakes — check important info before acting.</div>
            <FloatingChat onClose={()=>setOpen(false)} />
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{scale:0.95}} whileTap={{scale:0.95}}>
          <FloatingChatButton onClick={()=>setOpen(true)} />
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}
