'use client'
import React, { createContext, useContext } from 'react'
import create from 'zustand'

type RootState = {
  theme: 'light'|'dark'|'system',
  toggleTheme: ()=>void
}

const useStore = create<RootState>((set,get)=>({
  theme: 'light',
  toggleTheme: ()=> set({ theme: get().theme === 'light' ? 'dark' : 'light' })
}))

const Ctx = createContext(useStore)
export const RootStoreProvider: React.FC<{children:React.ReactNode}> = ({children}) => (<Ctx.Provider value={useStore}>{children}</Ctx.Provider>)
export const useRootStore = () => useContext(Ctx)()
