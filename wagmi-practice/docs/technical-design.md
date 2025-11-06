# Wagmi DApp 技术方案设计文档

## 1. 引言

本文档旨在为基于 `requirements.md` 中定义的需求，提供一个明确、可执行的技术实现方案。本文档将详细阐述项目架构、技术选型、组件设计、合约交互策略以及状态管理机制，作为后续开发工作的核心指导。

## 2. 系统架构与技术选型

### 2.1. 系统架构

本 DApp 将采用基于 Next.js 的单页面应用 (SPA) 架构。

- **前端框架:** Next.js (App Router) 将作为核心框架，利用其服务器端渲染 (SSR) 和客户端渲染 (CSR) 的混合能力，提供优秀的性能和开发体验。
- **区块链交互层:** `wagmi` 和 `viem` 将共同构成与以太坊区块链通信的核心。`wagmi` 提供符合 React 设计哲学的 Hooks，而 `viem` 作为底层库，负责处理 JSON-RPC 请求、数据编码和类型安全。
- **钱包集成层:** `@rainbow-me/rainbowkit` 将用于提供一个标准、美观且用户友好的多钱包连接界面。

### 2.2. 技术选型

- **核心框架:** Next.js
- **编程语言:** TypeScript
- **Web3 核心库:**
    - `wagmi`: 用于状态管理、区块链数据获取和合约交互的 React Hooks。
    - `viem`: 作为 `wagmi` 的底层依赖，提供与以太坊节点通信的低级接口。
- **钱包连接:** `@rainbow-me/rainbowkit`
- **UI 样式:** Tailwind CSS
- **目标网络:** Sepolia 测试网

### 2.3. 项目目录结构

```
/src
├── app/                # Next.js App Router 核心目录
│   ├── layout.tsx      # 全局布局
│   └── page.tsx        # 应用主页面
├── components/         # UI 组件
│   ├── ConnectWallet.tsx
│   ├── AccountInfo.tsx
│   ├── Erc20Actions.tsx
│   └── TokenBank.tsx
├── constants/          # 常量
│   ├── abi.ts          # 合约 ABI
│   └── addresses.ts    # 合约地址
├── context/            # React Context
│   └── Web3Provider.tsx # Wagmi 和 RainbowKit 的全局 Provider
└── utils/              # 工具函数
    └── format.ts       # 数据格式化函数 (例如: 地址, ether)
```

### 2.4. 合约信息

- **TokenBank 合约地址 (Sepolia):** `0x8Ff1927560f49488045025e71A2f596581411926`
- **Etherscan 链接:** [https://sepolia.etherscan.io/address/0x8Ff1927560f49488045025e71A2f596581411926#code](https://sepolia.etherscan.io/address/0x8Ff1927560f49488045025e71A2f596581411926#code)

## 3. 组件设计

### 3.1. `Web3Provider.tsx`
- **职责:** 初始化 `wagmi` 和 `RainbowKit` 的配置，并通过 React Context 提供给整个应用。
- **实现:**
    - 使用 `createConfig` 创建 `wagmi` 配置，指定 `chains` (Sepolia) 和 `transports`。
    - 使用 `WagmiProvider` 和 `RainbowKitProvider` 包裹子组件。

### 3.2. `ConnectWallet.tsx`
- **职责:** 渲染钱包连接按钮。
- **实现:** 直接使用 `@rainbow-me/rainbowkit` 提供的 `ConnectButton` 组件。

### 3.3. `AccountInfo.tsx`
- **职责:** 显示当前用户的账户信息，包括地址、ETH 余额和 ERC20 Token 余额。
- **实现:**
    - 使用 `useAccount` Hook 获取用户地址 `address`。
    - 使用 `useBalance` Hook 并传入 `address` 获取 ETH 余额。
    - 使用 `useBalance` Hook 并传入 `address` 和 ERC20 Token 合约地址，获取 Token 余额。

### 3.4. `Erc20Actions.tsx`
- **职责:** 处理 ERC20 Token 的转账和授权操作。
- **实现:**
    - **状态:**
        - `transferTo` (string): 存储转账目标地址。
        - `transferAmount` (string): 存储转账金额。
        - `approveAmount` (string): 存储授权金额。
    - **Hooks:**
        - `useWriteContract`: 用于发起 `transfer` 和 `approve` 交易。
        - `useWaitForTransactionReceipt`: 用于跟踪交易状态并提供反馈。
    - **逻辑:**
        - **转账:** 调用 `writeContract` 执行 ERC20 合约的 `transfer` 方法。
        - **授权:** 调用 `writeContract` 执行 ERC20 合约的 `approve` 方法，`spender` 参数固定为 `TokenBank` 合约地址。

### 3.5. `TokenBank.tsx`
- **职责:** 聚合所有与 `TokenBank` 合约的交互，包括数据读取和写入。
- **实现:**
    - **数据读取:**
        - 使用 `useReadContract` Hook 读取 `totalDeposited`。
        - 使用 `useReadContract` Hook 并传入当前用户地址，读取 `deposits`。
        - 使用 `useReadContract` Hook 读取 ERC20 合约的 `allowance`，以判断存款按钮是否可用。
    - **数据写入:**
        - **状态:**
            - `depositAmount` (string): 存储存款金额。
            - `withdrawAmount` (string): 存储取款金额。
        - **Hooks:**
            - `useWriteContract`: 用于发起 `deposit` 和 `withdraw` 交易。
            - `useWaitForTransactionReceipt`: 用于跟踪交易状态。
    - **逻辑:**
        - **存款:** 调用 `writeContract` 执行 `TokenBank` 合约的 `deposit` 方法。
        - **取款:** 调用 `writeContract` 执行 `TokenBank` 合约的 `withdraw` 方法。

## 4. 合约交互策略

所有与智能合约的交互将严格通过 `wagmi` Hooks 完成，以确保类型安全和统一的状态管理。

- **读取操作:**
    - **Hook:** `useReadContract`
    - **用途:** 获取 `totalDeposited`, `deposits`, `balanceOf`, `allowance` 等所有只读数据。
    - **配置:** `refetchInterval` 将被配置用于定期刷新数据，确保数据时效性。

- **写入操作:**
    - **Hook:** `useWriteContract`
    - **用途:** 执行 `transfer`, `approve`, `deposit`, `withdraw` 等所有会改变区块链状态的交易。
    - **返回:** `writeContract` 函数用于触发交易，`data` (交易 hash), `isPending`, `error` 用于 UI 反馈。

- **交易状态跟踪:**
    - **Hook:** `useWaitForTransactionReceipt`
    - **用途:** 监听由 `useWriteContract` 返回的交易 `hash`，获取交易的最终状态（成功或失败）。
    - **返回:** `isLoading` (确认中), `isSuccess` (已确认) 将用于向用户提供精确的实时反馈。

## 5. 状态管理与数据流

- **全局状态:** 由 `wagmi` 和 `RainbowKit` 内部管理，包括钱包连接状态、当前网络、用户地址等。`Web3Provider` 将此状态注入应用顶层。
- **远程状态:** 由 `wagmi` 的 `useReadContract` 和 `useBalance` Hooks 管理。`wagmi` 内部集成 `TanStack Query`，自动处理数据缓存、后台刷新和状态同步。
- **本地 UI 状态:** 组件内部的表单输入、模态框开关等状态，将使用 React 的 `useState` Hook 进行管理。
- **数据刷新机制:**
    - 对于任何成功的写入操作（例如存款成功），`useWaitForTransactionReceipt` 的 `onSuccess` 回调将被触发。
    - 在此回调中，将使用 `wagmi` 提供的 `useQueryClient` 来精确地使相关的 `useReadContract` 查询失效，从而触发数据自动重新获取，更新 UI。

## 6. 错误处理与用户反馈

- **输入验证:** 在前端对地址格式、数字输入进行校验，防止用户提交无效数据。
- **交易错误:**
    - `useWriteContract` 返回的 `error` 对象将包含用户拒绝交易、Gas 不足、合约 `require` 失败等错误信息。
    - 这些错误信息将通过一个统一的 `Toast` 通知组件展示给用户。
- **状态反馈:**
    - **等待确认:** `useWriteContract` 的 `isPending` 状态用于在等待用户钱包确认时禁用按钮并显示加载动画。
    - **确认中:** `useWaitForTransactionReceipt` 的 `isLoading` 状态用于在交易已发送、等待区块确认期间显示“确认中...”信息。
    - **成功:** `isSuccess` 状态用于显示“交易成功”的通知，并触发数据刷新。