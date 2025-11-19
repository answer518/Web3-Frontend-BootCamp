'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { config } from '@/lib/wagmiClient'
import Navbar from '@/components/Navbar'
import ErrorFilter from '@/components/ErrorFilter'
import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { useState } from 'react'

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en">
      <body>
        <ErrorFilter />
        {/* // 提供Wagmi Hooks上下文 */}
        <WagmiProvider config={config}>
          {/* React Query用于数据缓存 */}
          <QueryClientProvider client={queryClient}>
            {/* RainbowKit UI组件上下文 */}
            <RainbowKitProvider theme={darkTheme({
              accentColor: '#7b3ff2',
              accentColorForeground: '#ffffff',
              borderRadius: 'large',
            })}>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}