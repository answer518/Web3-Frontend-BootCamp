import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// 配置支持的链
const chains = [sepolia] as const;

// 创建 Wagmi 配置
export const config = getDefaultConfig({
  appName: 'Viem ERC20 DApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains,
  transports: {
    [sepolia.id]: http(), // 使用默认的公共 RPC
  },
});