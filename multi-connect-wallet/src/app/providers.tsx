'use client';

import { WagmiProvider, http } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig, lightTheme } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';

// 初始化 Web3 配置
function initializeWeb3Config() {
  // 从环境变量获取 WalletConnect Project ID
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

  // 创建 Wagmi 配置
  const config = getDefaultConfig({
    appName: 'Multi-Connect Wallet',
    projectId: projectId,
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  });

  // 创建 React Query 客户端
  const queryClient = new QueryClient();
  
  return { config, queryClient };
}

export function Providers({ children }: { children: React.ReactNode }) {
  // 使用 useMemo 来避免重复创建配置
  const { config, queryClient } = useMemo(() => initializeWeb3Config(), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#000",
            borderRadius: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}