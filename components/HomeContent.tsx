'use client'
import React from 'react'
import FileUpload from './FileUpload'
import VisionInput from './VisionInput'
import VoiceRecorder from './VoiceRecorder'

export default function HomeContent(){
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>Welcome to NeuroEdge</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='col-span-2 space-y-4'>
          <div className='p-3 border rounded bg-white'><h3 className='font-semibold'>Quick Chat</h3></div>
          <div className='p-3 border rounded bg-white'><VoiceRecorder/></div>
        </div>
        <div className='space-y-4'>
          <div className='p-3 border rounded bg-white'><FileUpload /></div>
          <div className='p-3 border rounded bg-white'><VisionInput /></div>
        </div>
      </div>
    </div>
  )
}
