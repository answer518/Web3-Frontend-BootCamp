'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { config } from '@/lib/wagmiClient'

const queryClient = new QueryClient()

export function Providers({ children }) {
    return (
        // 提供Wagmi Hooks上下文
        <WagmiProvider config={config}>
            {/* React Query用于数据缓存 */}
            <QueryClientProvider client={queryClient}>
                {/* RainbowKit UI组件上下文 */}
                <RainbowKitProvider theme={darkTheme({
                    accentColor: '#7b3ff2',
                    accentColorForeground: '#ffffff',
                    borderRadius: 'large',
                })}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}