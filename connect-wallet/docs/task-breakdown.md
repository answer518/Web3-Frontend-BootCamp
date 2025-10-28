# 钱包连接功能 - 任务拆分计划

本文档基于《需求文档》和《技术方案》，将整个开发过程拆分为一系列具体、可执行、可验证的任务。开发将严格遵循此计划。

---

## 阶段一：项目初始化与基础环境搭建 (优先级: 高)

**目标**: 创建一个可运行的 Next.js 项目，并配置好所有基础依赖和开发环境。

| 任务 ID | 任务描述 | 预期产出/验证方式 |
| :--- | :--- | :--- |
| 1.1 | 使用 `pnpm create next-app` 初始化 Next.js 项目 (包含 TypeScript, Tailwind CSS, ESLint)。 | 一个可以成功运行 `pnpm dev` 并能在浏览器中访问的 Next.js 初始页面。 |
| 1.2 | 安装核心 Web3 依赖：`wagmi`, `viem`, `@rainbow-me/rainbowkit`。 | `package.json` 中包含正确的依赖版本，`pnpm install` 无错误。 |
| 1.3 | 根据技术方案创建项目目录结构 (如 `src/app`, `src/components`, `src/lib` 等)。 | 项目文件管理器中可见正确的文件夹结构。 |
| 1.4 | 创建 `.env.local` 文件并添加 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` 和 `NEXT_PUBLIC_INFURA_RPC_URL` 占位符。 | `.env.local` 文件存在，且包含指定的环境变量（值可以暂时为空）。 |

---

## 阶段二：Web3 Provider 配置与集成 (优先级: 高)

**目标**: 将 Wagmi 和 RainbowKit 的 Providers 正确集成到 Next.js 应用中。

| 任务 ID | 任务描述 | 预期产出/验证方式 |
| :--- | :--- | :--- |
| 2.1 | 在 `src/lib/wagmi.ts` 中创建并导出 `wagmi` 的配置 (`config`)。 | `wagmi.ts` 文件包含 `createConfig` 的调用，并配置了 `chains` 和 `transports`。 |
| 2.2 | 创建 `src/app/providers.tsx` 文件，封装 `WagmiProvider` 和 `RainbowKitProvider`。 | `providers.tsx` 文件存在，并导出一个包含所有 Web3 Provider 的 `Providers` 组件。 |
| 2.3 | 在根布局 `src/app/layout.tsx` 中引入并使用 `Providers` 组件，包裹整个应用。 | 应用可以正常运行，浏览器开发者工具的 React DevTools 中可以看到 `WagmiProvider` 和 `RainbowKitProvider` 包裹了 `children`。 |
| 2.4 | 引入 RainbowKit 的 CSS 样式 (`@rainbow-me/rainbowkit/styles.css`)。 | 引入样式后，应用无报错。后续 RainbowKit 模态框的样式将能正确显示。 |

---

## 阶段三：核心连接功能实现 (优先级: 中)

**目标**: 在 UI 上实现钱包的连接和断开功能。

| 任务 ID | 任务描述 | 预期产出/验证方式 |
| :--- | :--- | :--- |
| 3.1 | 创建 `src/components/wallet/ConnectButton.tsx` 组件，并从 `@rainbow-me/rainbowkit` 导入 `ConnectButton`。 | `ConnectButton.tsx` 文件存在，并导出一个简单的封装组件。 |
| 3.2 | 在主页 `src/app/page.tsx` 中引入并渲染 `ConnectButton` 组件。 | 页面上出现一个功能完备的 "Connect Wallet" 按钮。 |
| 3.3 | **验证连接流程**：点击按钮，能够成功弹出 RainbowKit 钱包选择模态框。 | 点击按钮后，屏幕上出现钱包选择列表。 |
| 3.4 | **验证连接与断开**：选择一个钱包（如 MetaMask）进行连接，连接成功后按钮变为钱包信息。再次点击可以断开连接。 | 能够完成一次完整的连接和断开流程，UI 状态随之正确变化。 |

---

## 阶段四：钱包信息展示与动态更新 (优先级: 中)

**目标**: 在连接后，根据需求文档展示详细的钱包信息。

| 任务 ID | 任务描述 | 预期产出/验证方式 |
| :--- | :--- | :--- |
| 4.1 | 创建一个新的组件（例如 `src/components/wallet/WalletInfo.tsx`）用于展示钱包信息。 | `WalletInfo.tsx` 文件被创建。 |
| 4.2 | 在 `WalletInfo.tsx` 中，使用 `wagmi` 的 Hooks (`useAccount`, `useBalance`, `useNetwork`) 获取地址、余额和网络信息。 | 组件内部能正确调用 Hooks。 |
| 4.3 | 在主页 `page.tsx` 中，根据连接状态 (`isConnected`) 条件渲染 `WalletInfo` 组件。 | 连接钱包后，页面上显示用户的钱包地址、余额和当前网络。 |
| 4.4 | **验证动态更新**：在钱包中切换账户或网络。 | 页面上显示的钱包地址、余额或网络信息应自动更新，无需刷新页面。 |

---

## 阶段五：UI/UX 优化与最终审查 (优先级: 低)

**目标**: 完善 UI 细节，确保响应式设计和良好的用户体验。

| 任务 ID | 任务描述 | 预期产出/验证方式 |
| :--- | :--- | :--- |
| 5.1 | 使用 Tailwind CSS 调整主页布局和样式，使其更加美观。 | 页面布局符合基本的设计美学，不再是简单的组件堆砌。 |
| 5.2 | **验证响应式设计**：在不同尺寸的浏览器窗口（桌面、平板、手机）中测试。 | 在各种屏幕尺寸下，`ConnectButton` 和钱包信息都显示正常，无布局错乱。 |
| 5.3 | 代码审查与重构：检查代码是否遵循技术方案中定义的规范，移除不必要的代码和 `console.log`。 | 代码整洁、可读性高，符合 ESLint 和 Prettier 规范。 |
| 5.4 | 最终功能测试：完整地测试所有功能，包括连接、断开、切换网络/账户。 | 所有功能均按预期工作，无明显 Bug。 |