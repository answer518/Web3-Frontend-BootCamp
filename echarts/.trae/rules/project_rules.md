# Echarts 可视化项目 AI 辅助开发规则

本文档为 Echarts 可视化项目提供了一套 AI 辅助开发规则，旨在确保 AI 生成的代码与项目的架构、编码风格和最佳实践保持一致。

## 1. 核心技术

- **框架**: React 18.x (函数式组件与 Hooks)
- **构建工具**: Vite 5.x
- **包管理器**: pnpm 9.x
- **语言**: TypeScript 5.x
- **图表库**: Echarts 5.x, 配合 `echarts-for-react`
- **样式**: CSS Modules

## 2. NPM 包管理

- **始终使用 `pnpm` 进行包管理。**
  - `pnpm add [package-name]` 用于添加依赖。
  - `pnpm add -D [package-name]` 用于添加开发依赖。
  - `pnpm remove [package-name]` 用于移除依赖。
- **请勿使用 `npm` 或 `yarn`。**

## 3. 项目目录结构

请遵循以下目录结构：

```
echarts-visual/
├── public/                # 静态资源
├── src/
│   ├── assets/            # CSS、图片等
│   ├── components/        # 可复用的 UI 组件
│   │   └── EchartsChart/  # 核心 Echarts 封装组件
│   ├── config/            # 项目配置 (例如 Echarts 主题)
│   ├── data/              # 用于模拟的静态 JSON 数据
│   ├── hooks/             # 自定义 React Hooks
│   ├── layouts/           # 布局组件
│   ├── pages/             # 页面级组件
│   ├── router/            # 路由配置
│   ├── styles/            # 全局样式和 CSS 变量
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   └── main.tsx           # 应用入口文件
├── .eslintrc.cjs
├── .prettierrc
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 4. 编码风格与约定

### 4.1. 命名约定

- **目录**: `kebab-case` (例如 `line-tvl`)
- **组件文件**: `PascalCase` (例如 `EchartsChart.tsx`)
- **非组件 TS/TSX 文件**: `camelCase` (例如 `useDataFetch.ts`)
- **变量/函数**: `camelCase`
- **类型/接口**: `PascalCase` (不带 `I` 或 `T` 前缀, 例如 `interface ChartProps`)

### 4.2. 代码风格

- **组件**: 仅使用函数式组件和 Hooks。
- **状态管理**:
  - 对简单状态使用 `useState` 或 `useReducer`。
  - 对跨组件共享的状态使用 `useContext`。
- **导入顺序**: 遵循以下顺序：
  1. React 和第三方库
  2. 布局/页面/组件
  3. 工具函数/Hooks
  4. 类型定义
  5. 样式文件
- **自动化**: 必须使用 ESLint 和 Prettier。确保所有生成的代码都已正确格式化。

### 4.3. 注释

- **组件**: 在每个组件的顶部添加 JSDoc 注释，以解释其用途和 props。
- **复杂逻辑**: 为复杂的函数、算法或业务逻辑提供注释。

## 5. Echarts 实现

- **按需加载**: 始终使用 Echarts 的按需加载以减小打包体积。`src/utils/echarts.ts` 文件负责注册所需的图表和组件。
- **封装组件**: 所有图表渲染都应使用位于 `src/components/EchartsChart/index.tsx` 的 `EchartsChart` 组件。不要在页面中直接使用 `echarts-for-react`。

## 6. 性能优化

- **懒加载**: 使用 `React.lazy` 和 `Suspense` 进行代码分割和页面组件的懒加载。
- **记忆化 (Memoization)**:
  - 使用 `useMemo` 缓存图表 `option` 的复杂计算。
  - 使用 `React.memo` 包装图表页面或组件，以防止不必要的重新渲染。
- **数据处理**: 避免在渲染函数中进行大规模的数据转换。应在 `useEffect` 或 `useMemo` 中执行。

通过遵循这些规则，AI 助手将能够为该项目生成高质量、一致且可维护的代码。

## 7. AI 助手任务执行规范

1. **严格按照任务拆分执行**：必须严格遵守 `/Users/guotingjie/study/web3/Web3-Frontend-BootCamp/echarts/docs/task-breakdown.md` 中的任务范围定义，不能超出范围。
2. **单一任务原则**：每次只执行一个明确指定的任务（如“任务 1.1”、“任务 1.2”等），完成后等待用户确认再进行下一步。
3. **严禁自动扩展**：不得基于技术架构文档或其他文档自行扩展任务范围，如果需要扩展需要通知用户确认。