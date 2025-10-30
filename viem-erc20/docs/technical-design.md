# Viem ERC20 DApp - 技术设计文档

## 1. 引言

本文档旨在为基于 `requirements.md` 的去中心化应用（DApp）提供详细的技术设计方案。应用将围绕与特定 ERC20 合约的交互构建，涵盖转账、数据读取和代币铸造等核心功能。

## 2. 技术选型

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **包管理器**: pnpm
- **Web3 库**: Viem
- **钱包连接**: RainbowKit
- **UI 样式**: Tailwind CSS
- **以太坊环境**: Sepolia 测试网

## 3. 项目架构

### 3.1 目录结构

为了确保代码的模块化和可维护性，项目将采用以下目录结构：

```
viem-erc20/
├── .next/
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx         # 应用主页面
│   ├── components/          # UI 组件
│   │   ├── ConnectButton.tsx  # 连接钱包按钮
│   │   ├── EthTransfer.tsx    # ETH 转账组件
│   │   └── Erc20Interaction.tsx # ERC20 交互组件
│   ├── config/
│   │   └── wagmi.ts         # Wagmi 和 Viem 客户端配置
│   ├── constants/
│   │   └── index.ts         # 合约地址、ABI 等常量
│   ├── context/
│   │   └── Web3Provider.tsx   # Web3 全局 Provider
│   └── utils/
│       └── format.ts        # 格式化工具函数
├── .gitignore
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

### 3.2 核心组件设计

- **`Web3Provider.tsx`**:
  - **职责**: 初始化 `WagmiConfig` 和 `RainbowKitProvider`，为整个应用提供 Web3 环境。
  - **实现**: 在 `src/app/layout.tsx` 中包裹主应用，配置所需的公链（Sepolia）和 RPC 提供商。

- **`ConnectButton.tsx`**:
  - **职责**: 提供用户友好的钱包连接/断开界面。
  - **实现**: 直接使用 RainbowKit 提供的 `ConnectButton` 组件，它内置了账户信息展示、网络切换等功能。

- **`EthTransfer.tsx`**:
  - **职责**: 处理原生代币（ETH）转账。
  - **实现**:
    - 包含两个输入框：接收方地址和转账金额。
    - 使用 Viem 的 `useSendTransaction` hook 发起交易。
    - 通过 `useWaitForTransactionReceipt` hook 监听交易状态，并向用户显示交易成功或失败的反馈。

- **`Erc20Interaction.tsx`**:
  - **职责**: 封装所有与 ERC20 合约的交互逻辑。
  - **实现**:
    - **数据读取**: 使用 `useReadContracts` hook 并行读取合约的 `owner`, `balanceOf`, `totalSupply` 等数据。数据将实时展示在 UI 上。
    - **代币铸造 (Mint)**: 提供一个输入框让用户输入铸造数量，并设置上限（10,000）。使用 `useWriteContract` hook 调用合约的 `mint` 方法。
    - **余额刷新**: 铸造交易成功后，通过 `useWaitForTransactionReceipt` 的回调函数重新触发 `useReadContracts` 来刷新用户余额。

## 4. 技术实现方案

### 4.1 Web3 客户端配置

在 `src/config/wagmi.ts` 文件中，我们将配置 Wagmi 和 Viem：

- 使用 `createConfig` 创建 Wagmi 配置。
- 指定 `chains` 为 `[sepolia]`。
- 使用 `http` transport 创建一个指向 Sepolia RPC 端点的 Viem 客户端。
- 集成 RainbowKit 的 `getDefaultWallets` 以支持主流钱包（如 MetaMask, WalletConnect）。

```typescript
// src/config/wagmi.ts
import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

const { wallets } = getDefaultWallets({
  appName: 'Viem ERC20 DApp',
  projectId: 'YOUR_PROJECT_ID', // 需要从 WalletConnect Cloud 获取
  chains: [sepolia],
});

export const config = createConfig({
  chains: [sepolia],
  connectors: wallets,
  transports: {
    [sepolia.id]: http(), // 使用默认的公共 RPC
  },
});
```

### 4.2 合约交互

所有合约交互都将通过 Viem 的 Action 和 Wagmi Hooks 完成。

- **合约 ABI**: 在 `src/constants/index.ts` 中定义一个最小化的 ERC20 ABI，只包含需要用到的函数：`owner`, `balanceOf`, `totalSupply`, `mint`。

```typescript
// src/constants/index.ts
export const erc20ContractAddress = '0xa7d726B7F1085F943056C2fB91abE0204eC6d6DA';

export const erc20Abi = [
  { name: 'owner', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'mint', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [] },
] as const;
```

- **读取操作**:

```typescript
// 在 Erc20Interaction.tsx 中
import { useAccount, useReadContracts } from 'wagmi';
import { erc20ContractAddress, erc20Abi } from '@/constants';

const { address } = useAccount();
const { data, isPending, refetch } = useReadContracts({
  contracts: [
    { abi: erc20Abi, address: erc20ContractAddress, functionName: 'owner' },
    { abi: erc20Abi, address: erc20ContractAddress, functionName: 'totalSupply' },
    { abi: erc20Abi, address: erc20ContractAddress, functionName: 'balanceOf', args: [address!] },
  ],
  query: { enabled: !!address }, // 仅在连接钱包后执行
});
```

- **写入操作 (Mint)**:

```typescript
// 在 Erc20Interaction.tsx 中
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';

const { data: hash, writeContract } = useWriteContract();
const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

const handleMint = () => {
  writeContract({
    abi: erc20Abi,
    address: erc20ContractAddress,
    functionName: 'mint',
    args: [address!, parseUnits('10000', 18)], // 假设代币精度为 18
  });
};

// 使用 useEffect 监听 isSuccess 状态，成功后调用 refetch() 刷新数据
```

## 5. 开发与部署

### 5.1 初始化项目

```bash
# 1. 创建 Next.js 项目
pnpm create next-app@latest viem-erc20 --typescript --tailwind --eslint --app

# 2. 进入项目目录
cd viem-erc20

# 3. 安装依赖
pnpm install viem wagmi @rainbow-me/rainbowkit
```

### 5.2 环境变量

在项目根目录创建 `.env.local` 文件，用于存放敏感信息，例如 WalletConnect 的 `projectId`。

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="YOUR_PROJECT_ID"
```

### 5.3 运行开发服务器

```bash
pnpm dev
```

应用将在 `http://localhost:3000` 上运行。