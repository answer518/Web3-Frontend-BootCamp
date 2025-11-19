'use client'

import dynamic from 'next/dynamic'
const ConnectButton = dynamic(() => import('@rainbow-me/rainbowkit').then(m => m.ConnectButton), { ssr: false })

export function WalletButton() {
  return (
    <ConnectButton 
        accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
        }}
        showBalance={{
            smallScreen: false,
            largeScreen: true,
        }}
    />
  )
}