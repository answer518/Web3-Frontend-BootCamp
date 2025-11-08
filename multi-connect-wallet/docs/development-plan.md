# 多钱包连接功能开发任务拆分计划

本文档基于《产品需求文档》和《技术设计文档》，将多钱包连接功能的开发过程拆分为一系列具体、可执行的任务。AI 将严格遵循此计划进行开发。

---

### 任务 1: 项目初始化与基础设置 (Project Initialization & Basic Setup)

- **目标:** 搭建一个基于 Next.js 和 Tailwind CSS 的全新项目，集成 Web3 依赖并配置好环境变量。
- **子任务:**
    1.  在 `/Users/guotingjie/study/web3/Web3-Frontend-BootCamp/` 目录下，使用 `pnpm` 命令创建名为 `multi-connect-wallet` 的 Next.js 项目。
    2.  进入 `multi-connect-wallet` 目录，使用 `pnpm` 安装 `wagmi`, `viem`, `@rainbow-me/rainbowkit` 核心依赖。
    3.  在项目根目录创建 `.env.local.example` 文件，并写入 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=''` 作为环境变量模板。
- **可验证成果:**
    - 成功创建 `multi-connect-wallet` 项目目录。
    - `package.json` 文件中包含所有必需的依赖项。
    - 项目根目录下存在 `.env.local.example` 文件。

---

### 任务 2: 实现核心 Web3 Provider (Implement Core Web3 Provider)

- **目标:** 配置 Wagmi 和 RainbowKit，并通过一个全局 Provider 将 Web3 上下文注入到整个应用中。
- **子任务:**
    1.  创建 `multi-connect-wallet/app/providers.tsx` 文件。
    2.  在该文件中，配置 `WagmiProvider` 和 `RainbowKitProvider`。需要从 WalletConnect Cloud 获取一个 `projectId` 用于配置。
    3.  定义应用需要支持的区块链网络（例如：`mainnet`, `sepolia`）。
    4.  修改 `multi-connect-wallet/app/layout.tsx`，使用创建的 `Providers` 组件包裹整个应用的 `children`。
- **可验证成果:**
    - 应用在后台已经具备了 Web3 的能力，虽然此时没有任何可见的 UI 变化。

---

### 任务 3: 实现并集成基础连接按钮 (Implement & Integrate Basic Connect Button)

- **目标:** 创建一个全局共享的页头，并在其中集成功能完整的钱包连接按钮。
- **子任务:**
    1.  创建 `multi-connect-wallet/components/layout/ConnectWalletButton.tsx` 组件，在该组件中直接渲染从 `@rainbow-me/rainbowkit` 导入的 `ConnectButton`。
    2.  创建 `multi-connect-wallet/components/layout/Header.tsx` 组件，在其中引入并使用 `ConnectWalletButton` 组件。
    3.  修改 `multi-connect-wallet/app/layout.tsx`，在 `Providers` 内部、`children` 外部引入并使用 `Header` 组件，使其成为全局页头。
    4.  清空 `multi-connect-wallet/app/page.tsx` 的默认内容，仅保留一个简单的欢迎信息。
- **可验证成果:**
    - 应用每个页面顶部都出现一个包含“Connect Wallet”按钮的页头。
    - 点击按钮后，会弹出一个包含 MetaMask、WalletConnect 等选项的模态框。
    - 用户可以成功通过浏览器插件或扫码连接钱包。
    - 连接成功后，按钮上会显示用户的钱包地址。

---

### 任务 4: UI/UX 优化与主题定制 (UI/UX Refinement & Theming)

- **目标:** 根据品牌风格定制 RainbowKit 组件的视觉样式，提升用户体验。
- **子任务:**
    1.  在 `multi-connect-wallet/app/providers.tsx` 中，为 `RainbowKitProvider` 配置一个自定义主题（例如，修改强调色 `accentColor` 和边框圆角 `borderRadius`）。
- **可验证成果:**
    - 连接按钮和弹出的模态框的颜色、圆角等视觉元素发生变化，符合自定义的样式。

---

### 任务 5: 最终验证与文档完善 (Final Verification & Documentation)

- **目标:** 确保所有功能符合 PRD 要求，并为项目创建清晰的说明文档。
- **子任务:**
    1.  **详细测试验证:** 至少完成以下场景的测试：
        - a) 使用 MetaMask 浏览器插件成功连接与断开。
        - b) 使用手机钱包 App (如 Bitget Wallet) 扫描 WalletConnect 二维码成功连接与断开。
        - c) 连接后按钮正确显示钱包地址。
        - d) 在钱包插件中拒绝连接请求后，应用状态保持正常。
    2.  在 `multi-connect-wallet` 项目的根目录下创建一份 `README.md` 文件。
    3.  在 `README.md` 中，提供清晰的指引，说明如何设置和运行此项目，特别是如何从 `.env.local.example` 创建 `.env.local` 文件并配置 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`。
- **可验证成果:**
    - 项目功能完整、无缺陷，并通过所有指定的测试场景。
    - 其他开发者可以根据 `README.md` 轻松地在本地启动和测试该项目。