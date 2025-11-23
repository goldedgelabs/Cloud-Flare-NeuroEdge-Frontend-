'use client'
import React, { useState } from 'react'
import useWS from '../hooks/useWS'
import { IconMicrophone } from 'lucide-react'

export default function VoiceRecorder(){
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  useWS('/v1/audio/stt/stream', (m)=>{
    try {
      const d = JSON.parse(m.data)
      if(d?.text) setTranscript(prev=>prev + ' ' + d.text)
    } catch(e){}
  })

  return (
    <div className='p-2 border rounded bg-white'>
      <div className='flex items-center gap-2'>
        <button onClick={()=> setRecording(r=>!r)} className={`p-2 rounded ${recording?'bg-red-500 text-white':''}`}>
          <IconMicrophone />
        </button>
        <div className='flex-1'>
          <div className='text-sm text-slate-600'>{recording ? 'Recording...' : 'Click to record'}</div>
          <div className='text-sm'>{transcript}</div>
        </div>
      </div>
    </div>
  )
}
