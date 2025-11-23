'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function FounderPage(){
  const [info,setInfo] = useState<any>(null)
  useEffect(()=>{ const base = process.env.NEXT_PUBLIC_API_BASE_URL||''; axios.get(base + '/v1/founder').then(r=>setInfo(r.data)).catch(()=>setInfo({})) },[])
  return (
    <div className='bg-white p-4 rounded'>
      <h1 className='text-xl font-bold'>Founder Dashboard</h1>
      <div className='p-3 border rounded mt-3'>
        <pre className='text-xs'>{JSON.stringify(info, null, 2)}</pre>
      </div>
    </div>
  )
}
