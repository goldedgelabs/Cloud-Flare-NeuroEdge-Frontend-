'use client'
import React, { useState, useRef } from 'react'
import { IconPaperclip, IconSend, IconMicrophone } from 'lucide-react'
import { useChatStore } from '../../stores/chatStore'

export default function ChatInput(){
  const [text, setText] = useState('')
  const { sendMessage, sending, cancelCurrent } = useChatStore()
  const inputRef = useRef<HTMLInputElement|null>(null)

  const onSend = async () => {
    if(!text.trim()) return
    await sendMessage(text)
    setText('')
  }

  return (
    <div className='flex items-center gap-2'>
      <button title='Attach' className='p-2 text-slate-600 hover:text-slate-800'><IconPaperclip/></button>
      <div className='flex-1 relative'>
        <input ref={inputRef} value={text} onChange={e=>setText(e.target.value)} placeholder='Message...' className='w-full py-2 px-3 rounded border' />
        <div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2'>
          <button title='Voice' className='p-2 text-slate-600 hover:text-slate-800'><IconMicrophone/></button>
          {!sending ? (
            <button onClick={onSend} className='p-2 rounded-full send-btn'>
              <IconSend className='w-5 h-5' />
            </button>
          ) : (
            <button onClick={cancelCurrent} className='p-2 rounded-full cancel-btn'>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
