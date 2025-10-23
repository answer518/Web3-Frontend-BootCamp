# Echarts 可视化项目技术方案

## 1. 概述

本文档基于《Echarts 可视化需求分析》编写，旨在为该项目提供一套完整、可行且具备前瞻性的技术方案。方案将围绕 React + Vite 技术栈，使用 pnpm 作为包管理器，并重点关注项目结构、编码规范、组件设计与性能优化，确保项目具备良好的可维护性、扩展性与性能表现。

## 2. 技术选型

| 分类 | 技术 | 版本/库 | 备注 |
| :--- | :--- | :--- | :--- |
| **核心框架** | React | 18.x | 采用函数式组件与 Hooks 范式。 |
| **构建工具** | Vite | 5.x | 提供极速的开发服务器与优化的构建输出。 |
| **包管理器** | pnpm | 9.x | 高效利用磁盘空间，安装速度快。 |
| **编程语言** | TypeScript | 5.x | 为项目提供静态类型检查，提升代码健壮性。 |
| **图表库** | Echarts | 5.x | 功能强大的数据可视化库。 |
| **React封装**| `echarts-for-react` | 3.x | 在 React 中优雅地使用 Echarts 的官方封装。 |
| **路由管理** | `react-router-dom` | 6.x | （可选）若需多页面导航，则引入此库。 |
| **代码规范** | ESLint & Prettier | 最新 | 保证代码风格一致性与质量。 |
| **样式方案** | CSS Modules | - | 默认集成在 Vite 中，实现样式隔离，避免全局污染。 |

## 3. 项目初始化与环境配置

1.  **项目初始化**：
    使用 `pnpm` 结合 Vite 官方模板创建项目。
    ```bash
    pnpm create vite echarts-visual --template react-ts
    cd echarts-visual
    ```

2.  **依赖安装**：
    安装核心依赖。
    ```bash
    # 安装 Echarts 核心库与 React 封装
    pnpm add echarts echarts-for-react

    # （可选）安装路由
    pnpm add react-router-dom
    ```

3.  **环境配置**：
    - **`tsconfig.json`**：配置 `paths` 别名，简化模块导入路径，例如 `@/*` 指向 `src/*`。
    - **`vite.config.ts`**：配置 `resolve.alias` 以支持 `tsconfig.json` 中的路径别名。

## 4. 目录结构设计

清晰的目录结构是保证项目可维护性的关键。设计如下：

```
echarts-visual/
├── public/                # 静态资源，如图片、字体
├── src/
│   ├── assets/            # 样式、图片等静态资源文件
│   ├── components/        # 可复用的 UI 组件
│   │   └── EchartsChart/  # Echarts 封装组件（核心）
│   ├── config/            # 项目配置文件，如 Echarts 主题
│   ├── data/              # 存放静态 JSON 模拟数据
│   ├── hooks/             # 自定义 React Hooks
│   ├── layouts/           # 布局组件，如通用页头、侧边栏
│   ├── pages/             # 页面级组件，对应各个图表展示页
│   │   ├── LineTVL/
│   │   ├── BarDEX/
│   │   ├── PieHolders/
│   │   └── KlineToken/
│   ├── router/            # 路由配置（如果使用 react-router-dom）
│   ├── styles/            # 全局样式与 CSS 变量
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 通用工具函数
│   └── main.tsx           # 应用入口文件
├── .eslintrc.cjs          # ESLint 配置文件
├── .prettierrc            # Prettier 配置文件
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 5. 核心组件设计与性能优化

### 5.1 Echarts 按需引入与封装

为避免全量引入 Echarts 导致打包体积过大，必须采用按需引入的方式。我们将创建一个通用的 `EchartsChart` 组件来封装此逻辑。

**设计思路**：

1.  **创建 `echarts.ts` 文件**：此文件负责按需注册 Echarts 的图表、组件和渲染器。

    ```typescript
    // src/utils/echarts.ts
    import * as echarts from 'echarts/core';

    // 引入需要的图表类型
    import { LineChart, BarChart, PieChart, CandlestickChart } from 'echarts/charts';

    // 引入需要的组件
    import {
        TitleComponent,
        TooltipComponent,
        GridComponent,
        LegendComponent,
        DataZoomComponent,
        MarkPointComponent
    } from 'echarts/components';

    // 引入渲染器
    import { CanvasRenderer } from 'echarts/renderers';

    // 注册
    echarts.use([
        LineChart, BarChart, PieChart, CandlestickChart,
        TitleComponent, TooltipComponent, GridComponent, LegendComponent,
        DataZoomComponent, MarkPointComponent, CanvasRenderer
    ]);

    export default echarts;
    ```

2.  **封装 `EchartsChart` 组件**：使用 `echarts-for-react`，并传入按需构建的 `echarts` 实例。

    ```tsx
    // src/components/EchartsChart/index.tsx
    import ReactEChartsCore from 'echarts-for-react/lib/core';
    import echarts from '@/utils/echarts'; // 引入按需构建的实例
    import { EChartsOption } from 'echarts';

    interface EchartsChartProps {
        option: EChartsOption;
        style?: React.CSSProperties;
    }

    const EchartsChart: React.FC<EchartsChartProps> = ({ option, style }) => {
        return (
            <ReactEChartsCore
                echarts={echarts}
                option={option}
                notMerge={true}
                lazyUpdate={true}
                style={style || { height: '400px', width: '100%' }}
            />
        );
    };

    export default EchartsChart;
    ```

### 5.2 其他性能优化策略

-   **组件懒加载**：如果项目包含多个页面，使用 `React.lazy` 和 `Suspense` 对页面组件进行代码分割，实现按路由懒加载。
-   **Memoization**：
    -   对于图表的 `option` 数据，如果其计算过程复杂，使用 `useMemo` 进行缓存，避免不必要的重复计算。
    -   使用 `React.memo` 包裹图表页面或组件，防止因父组件不相关的状态变更而导致的重渲染。
-   **数据处理**：避免在渲染函数中进行大规模数据转换。如果数据需要处理，应在 `useEffect` 或 `useMemo` 中进行。
-   **事件节流**：`echarts-for-react` 内部已对 `resize` 事件做了优化。对于其他需要监听的高频事件（如滚动），应使用节流（throttle）或防抖（debounce）处理。

## 6. 编码规范

### 6.1 命名规范

-   **目录**：全部使用小写 `kebab-case`（短横线连接），例如 `line-tvl`。
-   **组件文件**：使用 `PascalCase`（大驼峰命名），例如 `EchartsChart.tsx`。
-   **非组件文件**：使用 `camelCase`（小驼峰命名），例如 `useDataFetch.ts`。
-   **变量/函数**：使用 `camelCase`。
-   **类型/接口**：使用 `PascalCase`，不加 `I` 或 `T` 前缀，例如 `interface ChartProps`。

### 6.2 代码风格

-   **组件**：统一使用函数式组件与 Hooks。
-   **状态管理**：简单场景使用 `useState`、`useReducer`；跨组件共享状态考虑 `useContext`。
-   **导入顺序**：
    1.  React 及第三方库
    2.  布局/页面/组件
    3.  工具函数/Hooks
    4.  类型定义
    5.  样式文件
-   **自动化工具**：强制使用 ESLint 和 Prettier，在 `package.json` 中配置 `lint` 和 `format`脚本，并建议在 CI/CD 流程中加入检查步骤。

### 6.3 注释规范

-   **组件**：在组件顶部使用 JSDoc 注释，说明组件用途、Props 等。
-   **复杂逻辑**：对复杂的函数、算法或业务逻辑，添加必要的行内或块级注释。

## 7. 开发流程建议

1.  **环境搭建**：完成项目初始化、依赖安装与规范配置。
2.  **核心封装**：优先开发 `EchartsChart` 封装组件与按需引入逻辑。
3.  **静态实现**：开发各个图表页面，使用 `src/data/` 下的静态 JSON 数据完成基础渲染。
4.  **交互开发**：根据需求文档，为各图表添加 Tooltip、DataZoom 等交互功能。
5.  **联调与测试**：（若有后端）接入 API，处理数据请求、加载状态与异常情况。
6.  **优化与部署**：进行性能复查与优化，最后执行 `pnpm build` 并部署。