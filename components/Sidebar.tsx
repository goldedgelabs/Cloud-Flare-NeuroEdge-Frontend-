'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { IconHome, IconMessageCircle, IconRobot, IconSettings, IconCreditCard } from 'lucide-react'

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ width: 72 }}
      animate={{ width: 72 }}
      whileHover={{ width: 260 }}
      className='bg-white border-r shadow-sm overflow-hidden'
    >
      <div className='h-full flex flex-col'>
        <div className='p-3 border-b flex items-center gap-2'>
          <div className='text-xl font-bold'>NeuroEdge</div>
        </div>
        <nav className='flex-1 p-2 space-y-1'>
          <Link href='/' className='flex items-center gap-3 p-2 rounded hover:bg-slate-50'>
            <IconHome className='w-5 h-5'/> <span className='whitespace-nowrap'>Home</span>
          </Link>
          <Link href='/chat' className='flex items-center gap-3 p-2 rounded hover:bg-slate-50'>
            <IconMessageCircle className='w-5 h-5'/> <span>Chat</span>
          </Link>
          <Link href='/agents' className='flex items-center gap-3 p-2 rounded hover:bg-slate-50'>
            <IconRobot className='w-5 h-5'/> <span>Agents</span>
          </Link>
          <Link href='/settings' className='flex items-center gap-3 p-2 rounded hover:bg-slate-50'>
            <IconSettings className='w-5 h-5'/> <span>Settings</span>
          </Link>
          <Link href='/billing' className='flex items-center gap-3 p-2 rounded hover:bg-slate-50'>
            <IconCreditCard className='w-5 h-5'/> <span>Billing</span>
          </Link>
        </nav>
        <div className='p-3 border-t text-xs'>
          <div>NeuroEdge can make mistakes — verify outputs.</div>
        </div>
      </div>
    </motion.aside>
  )
}
