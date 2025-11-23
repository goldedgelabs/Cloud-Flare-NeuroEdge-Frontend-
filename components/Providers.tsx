'use client'
import React from 'react'
import { RootStoreProvider } from '../stores/rootStore'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <RootStoreProvider>{children}</RootStoreProvider>
}
