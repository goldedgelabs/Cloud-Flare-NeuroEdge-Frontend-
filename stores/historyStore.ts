'use client'
import create from 'zustand'

export const useHistoryStore = create((set)=>({
  items: [] as any[],
  add: (x:any)=> set(s=>({ items: [x, ...s.items].slice(0,200) })),
  clear: ()=> set({ items: [] })
}))
