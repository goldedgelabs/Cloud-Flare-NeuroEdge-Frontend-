'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { IconPlay, IconSettings, IconZap } from 'lucide-react'
import useAgentStream from '../hooks/useAgentStream'

type Agent = { id:string, name:string, desc?:string, config?:any }

export default function AgentsPage(){
  const [agents,setAgents] = useState<Agent[]>([])
  const [selected, setSelected] = useState<Agent|null>(null)
  const [logs, setLogs] = useState<string>('')

  useEffect(()=>{
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    axios.get(base + '/v1/agents/list').then(r=>setAgents(r.data?.agents||[])).catch(()=>setAgents(
      Array.from({length:50}).map((_,i)=>({id:String(i+1), name:`Agent ${i+1}`, desc:'Auto-generated placeholder'}))
    ))
  },[])

  const startStreamingFor = (agent:Agent) => {
    setSelected(agent)
    setLogs('Connecting to live stream...\n')
    useAgentStream(agent.id, (line)=>{
      setLogs(l => l + line + '\n')
    }, { protocol: 'sse' } as any)
  }

  const runAgent = async (agent:Agent) => {
    setSelected(agent)
    setLogs('Starting agent run...\n')
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    try {
      const res = await axios.post(base + '/v1/agents/run', { agentId: agent.id })
      setLogs(l => l + 'Run requested: ' + JSON.stringify(res.data).slice(0,200) + '\n')
      startStreamingFor(agent)
    } catch(e){
      setLogs(l => l + '[error invoking agent]\n')
    }
  }

  return (
    <div>
      <h1 className='text-xl font-bold mb-3'>Agents</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        {agents.map((a,i)=>(
          <div key={a.id} className='p-3 border rounded hover:shadow bg-white'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='font-semibold'>{a.name}</div>
                <div className='text-sm text-slate-600'>{a.desc}</div>
              </div>
              <div className='flex items-center gap-2'>
                <button onClick={()=>runAgent(a)} className='px-2 py-1 rounded bg-indigo-600 text-white flex items-center gap-2'><IconPlay/> Run</button>
                <button onClick={()=> setSelected(a)} className='px-2 py-1 rounded border flex items-center gap-2'><IconSettings/> Config</button>
              </div>
            </div>
            <div className='mt-2 text-xs text-slate-500'>ID: {a.id}</div>
          </div>
        ))}
      </div>

      {selected && (
        <div className='fixed inset-0 flex items-end md:items-center justify-center p-4'>
          <div className='bg-white w-full md:w-2/3 max-h-[80vh] overflow-auto border rounded shadow-lg p-4'>
            <div className='flex items-center justify-between'>
              <div className='text-lg font-semibold'>{selected.name} — Configuration</div>
              <button onClick={()=>setSelected(null)} className='px-2 py-1 border rounded'>Close</button>
            </div>
            <div className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div>
                <label className='text-sm'>Description</label>
                <textarea className='w-full p-2 border rounded' defaultValue={selected.desc}></textarea>
                <div className='mt-2'>
                  <button className='px-3 py-1 bg-indigo-600 text-white rounded'>Save</button>
                </div>
              </div>
              <div>
                <div className='font-semibold'>Runtime Logs <span className='inline-block ml-2 text-xs text-slate-400'>live</span></div>
                <pre className='mt-2 p-2 bg-slate-50 border rounded text-xs max-h-64 overflow-auto'>{logs}</pre>
                <div className='mt-2 flex gap-2'>
                  <button className='px-3 py-1 bg-emerald-600 text-white rounded flex items-center gap-2'><IconZap/> Trigger</button>
                  <button onClick={()=>setLogs('')} className='px-3 py-1 border rounded'>Clear</button>
                </div>
              </div>
            </div>
            <div className='mt-3 text-xs text-slate-500'>Pro tip: you can stream logs over SSE or WebSocket from <code>/v1/agents/stream?agentId=...</code></div>
          </div>
        </div>
      )}
    </div>
  )
}
