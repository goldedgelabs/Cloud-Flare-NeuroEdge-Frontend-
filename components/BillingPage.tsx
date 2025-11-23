'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function BillingPage(){
  const [data,setData] = useState<any>(null)
  useEffect(()=>{ const base = process.env.NEXT_PUBLIC_API_BASE_URL||''; axios.get(base + '/v1/billing').then(r=>setData(r.data)).catch(()=>setData({plan:'free'})) },[])
  return (
    <div className='bg-white p-4 rounded'>
      <h1 className='text-xl font-bold'>Billing</h1>
      <div className='p-3 border rounded mt-3'>
        <div>Plan: {data?.plan||'Free'}</div>
      </div>
    </div>
  )
}
