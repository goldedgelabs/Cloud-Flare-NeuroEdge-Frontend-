'use client'
import React from 'react'

export default function CodePanel(){
  return (
    <div className='p-3 border rounded bg-white'>
      <div className='font-semibold'>Code Sandbox</div>
      <textarea className='w-full h-48 mt-2 p-2 border rounded font-mono text-sm' defaultValue={'// Paste code here'} />
      <div className='mt-2 flex gap-2'>
        <button className='px-3 py-1 bg-indigo-600 text-white rounded'>Run</button>
        <button className='px-3 py-1 border rounded'>Format</button>
      </div>
    </div>
  )
}
