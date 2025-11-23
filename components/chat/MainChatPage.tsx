'use client'
import React from 'react'
import ChatWidget from './ChatWidget'
import FileUpload from '../FileUpload'
import VoiceRecorder from '../VoiceRecorder'
import CodePanel from '../CodePanel'

export default function MainChatPage(){
  return (
    <div className='max-w-5xl mx-auto'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2 space-y-4'>
          <div className='p-3 border rounded bg-white'>
            <h2 className='font-semibold text-lg'>Conversation</h2>
            <div className='mt-3'>
              <ChatWidget />
            </div>
            <div className='mt-2 text-xs text-slate-500'>NeuroEdge can make mistakes — check important info.</div>
          </div>

          <div className='p-3 border rounded bg-white'>
            <h3 className='font-semibold'>Reasoning & Predictions</h3>
            <div className='mt-2 text-sm text-slate-600'>Predictive outcomes and safe summaries will appear here.</div>
          </div>

          <div className='p-3 border rounded bg-white'>
            <h3 className='font-semibold'>Code Sandbox</h3>
            <CodePanel />
          </div>
        </div>

        <aside className='space-y-4'>
          <div className='p-3 border rounded bg-white'>
            <h4 className='font-semibold'>File Upload</h4>
            <FileUpload />
          </div>
          <div className='p-3 border rounded bg-white'>
            <h4 className='font-semibold'>Voice Input</h4>
            <VoiceRecorder />
          </div>
          <div className='p-3 border rounded bg-white'>
            <h4 className='font-semibold'>Agents Quick Run</h4>
            <div className='mt-2'>Run agents from the sidebar or Agents page.</div>
          </div>
        </aside>
      </div>
    </div>
  )
}
