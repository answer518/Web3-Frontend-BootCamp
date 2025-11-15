'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia, mainnet, polygon } from 'wagmi/chains'

// 配置Wagmi客户端
export const config = getDefaultConfig({
    appName: 'Web3 DAPP Demo',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    chains: [sepolia, mainnet, polygon],  // 测试链
    ssr: true, // 如果是服务端渲染项目
})