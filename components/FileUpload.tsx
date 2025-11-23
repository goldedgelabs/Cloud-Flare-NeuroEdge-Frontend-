'use client'
import React, { useState } from 'react'
import axios from 'axios'

export default function FileUpload(){
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState('')
  const onFile = async (f?: File) => {
    const file = f || (document.getElementById('file') as HTMLInputElement).files?.[0]
    if(!file) return
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    const fd = new FormData(); fd.append('file', file)
    const res = await axios.post(base + '/v1/files/upload', fd, {
      onUploadProgress: (ev)=> setProgress(Math.round((ev.loaded/ev.total)*100))
    })
    setResult(JSON.stringify(res.data).slice(0,400))
  }
  return (
    <div className='p-3 border rounded space-y-2'>
      <input id='file' type='file' onChange={e=>onFile(e.target.files?.[0])} />
      <div>Progress: {progress}%</div>
      <div className='text-xs text-slate-600'>Result: {result}</div>
    </div>
  )
}
