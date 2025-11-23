'use client'
import React, { useState } from 'react'
import { IconSearch, IconChevronDown } from 'lucide-react'
import { useRootStore } from '../stores/rootStore'
import NetworkDots from './NetworkDots'

export default function Topbar(){
  const { theme, toggleTheme } = useRootStore()
  const [open, setOpen] = useState(false)
  return (
    <header className='flex items-center justify-between p-3 border-b bg-white'>
      <div className='flex items-center gap-3'>
        <div className='hidden md:block text-lg font-semibold'>Workspace: Default</div>
        <div className='relative'>
          <input placeholder='Search...' className='pl-8 pr-3 py-2 rounded border' />
          <IconSearch className='absolute left-2 top-2 w-4 h-4 text-slate-400'/>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <NetworkDots />
        <button onClick={toggleTheme} className='px-3 py-1 border rounded'>Theme: {theme}</button>
        <div className='relative'>
          <button onClick={()=>setOpen(o=>!o)} className='flex items-center gap-2 p-1 rounded'>
            <img src='https://api.dicebear.com/6.x/initials/svg?seed=NE' alt='avatar' className='w-8 h-8 rounded-full'/>
            <IconChevronDown className='w-4 h-4' />
          </button>
          {open && (
            <div className='absolute right-0 mt-2 bg-white border rounded shadow p-2 w-48'>
              <div className='py-1 px-2 hover:bg-slate-50 cursor-pointer'>Profile</div>
              <div className='py-1 px-2 hover:bg-slate-50 cursor-pointer'>Theme</div>
              <div className='py-1 px-2 hover:bg-slate-50 cursor-pointer'>Billing</div>
              <div className='py-1 px-2 hover:bg-slate-50 cursor-pointer'>Settings</div>
              <div className='py-1 px-2 hover:bg-slate-50 cursor-pointer'>Workspace Switcher</div>
              <div className='py-1 px-2 hover:bg-slate-50 cursor-pointer text-red-600'>Logout</div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
