'use client'
import React, { useState } from 'react'
import axios from 'axios'

export default function VisionInput(){
  const [img, setImg] = useState<string|null>(null)
  const [analysis, setAnalysis] = useState('')
  const onPick = async (file?: File) => {
    const f = file || (document.getElementById('img') as HTMLInputElement).files?.[0]
    if(!f) return
    const reader = new FileReader()
    reader.onload = ()=> setImg(String(reader.result))
    reader.readAsDataURL(f)
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    const fd = new FormData(); fd.append('file', f)
    const res = await axios.post(base + '/v1/vision/analyze', fd)
    setAnalysis(JSON.stringify(res.data).slice(0,400))
  }
  return (
    <div className='p-3 border rounded space-y-2'>
      <input id='img' type='file' accept='image/*' onChange={()=>onPick()} />
      {img && <img src={img} alt='preview' className='w-full max-h-64 object-contain'/>}
      <div className='text-xs'>Analysis: {analysis}</div>
    </div>
  )
}
