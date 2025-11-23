'use client'
import React from 'react'
import { useRootStore } from '../stores/rootStore'

export default function SettingsPage(){
  const { theme, toggleTheme } = useRootStore()
  return (
    <div className='max-w-3xl bg-white p-4 rounded'>
      <h1 className='text-xl font-bold'>Settings</h1>
      <div className='p-3 border rounded mt-3'>
        <div>Theme: {theme}</div>
        <button onClick={toggleTheme} className='mt-2 px-3 py-1 border rounded'>Toggle</button>
      </div>
    </div>
  )
}
