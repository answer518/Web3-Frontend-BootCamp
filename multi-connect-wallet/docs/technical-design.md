# 多钱包连接功能技术设计文档

## 1. 概述 (Overview)

本文档旨在将《多钱包连接功能产品需求文档 (PRD)》中的功能需求转化为一个概要性的技术实现方案。本文档将重点阐述项目所选用的技术栈、核心架构、组件设计和项目结构，作为高级别的技术指导。

## 2. 技术栈 (Technology Stack)

为确保开发效率、应用性能和社区支持，我们选用以下业界最佳实践的技术组合：

- **框架 (Framework):** [Next.js](https://nextjs.org/) (App Router) - 提供生产环境所需的全功能 React 框架，支持服务端渲染 (SSR) 和静态站点生成 (SSG)，并拥有强大的社区生态。
- **包管理器 (Package Manager):** [pnpm](https://pnpm.io/) - 快速、磁盘空间高效的包管理器，通过非扁平化的 `node_modules` 结构避免了依赖项冲突问题。
- **UI & 样式 (UI & Styling):** [Tailwind CSS](https://tailwindcss.com/) - 一个功能优先的 CSS 框架，用于快速构建自定义用户界面，与 Next.js 集成良好。
- **钱包集成库 (Wallet Integration):**
    - **[Wagmi](https://wagmi.sh/):** 一个强大的 React Hooks 库，用于与以太坊及 EVM 兼容链进行交互。它封装了处理钱包连接、合约调用、签名等所有底层逻辑。
    - **[RainbowKit](https://www.rainbowkit.com/):** 一个基于 Wagmi 构建的、开箱即用的钱包连接器 UI 库。它提供了美观、可定制的模态框和连接按钮，完美满足 PRD 中对用户体验的要求。
- **底层交互库 (Core Interaction):** [Viem](https://viem.sh/) - Wagmi 的核心依赖，是一个轻量、高效、类型安全的以太坊交互库，用于替代 ethers.js 或 web3.js。

## 3. 核心架构设计 (Core Architecture Design)

我们将采用基于 Provider 模式的架构，在应用的根部注入钱包连接所需的上下文(Context)，使得整个应用的所有子组件都能访问到连接状态和相关 hooks。

**设计概要:**
1.  **全局 Provider 组件 (`app/providers.tsx`):** 创建一个客户端组件 (`'use client'`)，用于统一管理和配置 `WagmiProvider` 和 `RainbowKitProvider`。
    - 在此组件中，将使用从 [WalletConnect Cloud](https://cloud.walletconnect.com/) 获取的 `projectId` 来初始化配置。
    - 定义需要支持的区块链网络 (Chains)，例如 `mainnet`, `sepolia`。
2.  **根布局集成 (`app/layout.tsx`):** 在应用的根布局 `<body>` 中，使用全局 Provider 组件包裹所有子页面和组件，确保 Web3 上下文在整个应用中可用。

## 4. 组件设计 (Component Design)

### 4.1. `ConnectWallet` 按钮组件

**路径:** `components/layout/ConnectWalletButton.tsx`

**设计方案:** 直接采用 `@rainbow-me/rainbowkit` 提供的 `ConnectButton` 组件。

**理由:** 该组件已内置了 PRD 中定义的全部核心功能，包括：
- 自动处理“连接/已连接”状态下的 UI 显示。
- 点击后弹出包含预设钱包列表（MetaMask, WalletConnect 等）的模态框。
- 连接成功后显示用户地址和网络信息，并提供断开连接的选项。
- 这种方案最大化地复用了成熟的社区库，减少了自定义开发的工作量，同时保证了高质量的用户体验。

## 5. 状态管理 (State Management)

本项目**无需**引入额外的状态管理库（如 Redux, Zustand）。`wagmi` 提供的 Hooks（如 `useAccount`, `useDisconnect`）已经能够满足所有与钱包状态相关的需求，并由 `ConnectButton` 组件在内部进行管理。

## 6. 样式与主题 (Styling & Theming)

- **全局样式:** 使用 `app/globals.css` 和 `tailwind.config.ts` 进行全局样式定义和 Tailwind 的配置。
- **RainbowKit 主题:** `RainbowKitProvider` 支持通过 `theme` 属性进行深度定制。可以导入预设主题（如 `lightTheme`, `darkTheme`）并覆盖其颜色、圆角等参数，以确保钱包连接界面的视觉风格与 DApp 整体保持一致。

## 7. 最终目录结构 (Final Directory Structure)

```
/multi-connect-wallet
├── app/
│   ├── layout.tsx              # 根布局, 引入 Providers
│   ├── page.tsx                # 主页面, 放置 ConnectWalletButton
│   └── providers.tsx           # Web3 Provider 配置文件
├── components/
│   └── layout/
│       └── ConnectWalletButton.tsx # 连接按钮组件
├── docs/
│   ├── requirements.md
│   └── technical-design.md     # 本文档
├── public/
│   └── ...
├── tailwind.config.ts
├── package.json
└── pnpm-lock.yaml
```