'use client'
import React from 'react'
import { IconMessageCircle } from 'lucide-react'

export default function FloatingChatButton({onClick}:{onClick:()=>void}){
  return (
    <button onClick={onClick} className='w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg'>
      <IconMessageCircle />
    </button>
  )
}
