# 钱包连接功能技术方案文档

## 1. 方案概述

本技术方案基于《钱包连接功能需求文档》，旨在为开发工作提供一份清晰、可执行的详细技术蓝图。本文档将详细阐述项目初始化、架构设计、核心组件实现、状态管理策略及代码规范等，并遵循当前前端及Web3领域的最佳实践，以确保项目的高质量、可维护性和可扩展性。

## 2. 技术选型与基础架构

- **脚手架**: Next.js (使用 App Router)
- **包管理器**: pnpm
- **语言**: TypeScript
- **Web3核心库**: Wagmi, Viem
- **UI组件库**: RainbowKit
- **样式方案**: Tailwind CSS
- **代码规范**: ESLint, Prettier

## 3. 项目初始化与配置

### 3.1. 创建项目

使用官方推荐的 `create-next-app` 命令，并集成 TypeScript 和 Tailwind CSS。

```bash
# 使用 pnpm create
pnpm create next-app@latest connect-wallet --typescript --tailwind --eslint
```

### 3.2. 安装核心依赖

进入项目目录，安装 Wagmi, Viem, 和 RainbowKit。

```bash
cd connect-wallet
pnpm install wagmi viem @rainbow-me/rainbowkit
```

## 4. 项目目录结构

为了保持代码的组织性和可维护性，我们采用以下目录结构：

```
connect-wallet/
├── .next/                # Next.js 构建产物
├── .vscode/              # VSCode 编辑器配置
├── node_modules/         # 项目依赖
├── public/               # 静态资源
├── src/
│   ├── app/              # Next.js App Router 核心目录
│   │   ├── layout.tsx    # 根布局
│   │   ├── page.tsx      # 主页面
│   │   └── providers.tsx # Web3 & UI Providers 封装
│   ├── components/         # 可复用UI组件
│   │   └── wallet/       # 钱包相关组件
│   │       └── ConnectButton.tsx
│   ├── constants/          # 常量（如链配置）
│   ├── hooks/              # 自定义Hooks
│   ├── lib/                # 工具函数、库配置
│   │   └── wagmi.ts      # Wagmi 客户端和链配置
│   └── styles/             # 全局样式
│       └── globals.css
├── .env.local            # 环境变量（必须在.gitignore中）
├── .eslintrc.json        # ESLint 配置
├── .gitignore
├── next.config.mjs       # Next.js 配置
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js     # PostCSS 配置
├── tailwind.config.ts    # Tailwind CSS 配置
└── tsconfig.json         # TypeScript 配置
```

## 5. 核心架构与实现

### 5.1. 环境变量配置

在项目根目录下创建 `.env.local` 文件，用于存放敏感信息。**此文件必须被 git 忽略**。

```.env
# 从 WalletConnect Cloud (https://cloud.walletconnect.com/) 获取你的 Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_wallet_connect_project_id"

# 从 Infura (https://www.infura.io/) 获取你的 RPC URL
# 注意：为了安全，RPC URL 最好通过后端代理，但对于前端项目，暂定直接使用
NEXT_PUBLIC_INFURA_RPC_URL="your_infura_rpc_url"
```

### 5.2. Wagmi 和 RainbowKit 配置

**a. 定义链和Wagmi配置 (`src/lib/wagmi.ts`)**

我们将在此文件中配置所有支持的区块链网络以及 `wagmi` 的客户端实例。

```typescript
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_INFURA_RPC_URL),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_INFURA_RPC_URL),
  },
});
```

**b. 封装 Providers (`src/app/providers.tsx`)**

由于 Web3 库依赖于浏览器环境，所有相关的 Provider 都必须在客户端组件中渲染。我们创建一个 `Providers` 组件来统一封装它们。

```typescript
'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi'; // 引入之前的配置

// RainbowKit 默认钱包配置
const { wallets } = getDefaultWallets();

const connectors = connectorsForWallets(
  [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  {
    appName: 'My-App',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider connectors={connectors}>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
```

**c. 应用 Providers (`src/app/layout.tsx`)**

在根布局中引入并使用 `Providers` 组件，使其包裹整个应用。

```typescript
import { Providers } from './providers';
import '@rainbow-me/rainbowkit/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 5.3. 连接按钮与信息展示

**a. 创建连接按钮组件 (`src/components/wallet/ConnectButton.tsx`)**

为了后续可能的定制化，我们将 RainbowKit 的 `ConnectButton` 封装一层。

```typescript
'use client';

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';

export const ConnectButton = () => {
  return <RainbowConnectButton />;
};
```

**b. 在主页中使用 (`src/app/page.tsx`)**

在主页中引入并渲染 `ConnectButton`。

```typescript
import { ConnectButton } from '@/components/wallet/ConnectButton';

export default function HomePage() {
  return (
    <main>
      <h1>Wallet Connection Demo</h1>
      <ConnectButton />
      {/* 后续的钱包信息展示组件将放在这里 */}
    </main>
  );
}
```

### 5.4. 状态管理

- **链上状态**: 完全依赖 `wagmi` 提供的 Hooks (`useAccount`, `useBalance`, `useNetwork`, `useEnsName` 等) 来获取和管理链上数据。这些 Hooks 内部已包含缓存、请求去重和自动刷新机制。
- **UI状态**: 对于简单的UI状态（如模态框开关），使用 React 内置的 `useState` 或 `useReducer`。此项目范围无需引入 Redux, Zustand 等外部状态管理库。

## 6. 代码质量与规范

- **ESLint & Prettier**: 项目已在初始化时集成。我们将遵循 Next.js 默认的规则集，并配置 Prettier 在保存时自动格式化代码，以保证代码风格的一致性。
- **TypeScript**: 开启 `strict` 模式，并为所有函数参数、返回值和复杂对象定义明确的类型。
- **命名规范**:
  - **组件**: `PascalCase` (e.g., `ConnectButton.tsx`)
  - **Hooks**: `use` 前缀的 `camelCase` (e.g., `useWalletInfo.ts`)
  - **常量**: `UPPER_SNAKE_CASE` (e.g., `SUPPORTED_CHAINS`)

本技术方案为项目的顺利启动和高质量交付提供了坚实的基础。开发人员应严格遵循此文档进行实现。