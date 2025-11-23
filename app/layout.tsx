import './globals.css'
import { ReactNode } from 'react'
import Providers from '../components/Providers'
import FloatingAssistant from '../components/FloatingAssistant'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export const metadata = {
  title: 'NeuroEdge',
  description: 'NeuroEdge Frontend - Next.js'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <div className='min-h-screen flex'>
            <Sidebar />
            <div className='flex-1 flex flex-col'>
              <Topbar />
              <main className='p-4 flex-1 overflow-auto'>{children}</main>
            </div>
            <FloatingAssistant />
          </div>
        </Providers>
      </body>
    </html>
  )
}
