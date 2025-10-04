"use client";

import React, { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

function DeepChild() {
  const ctx = useContext(ThemeContext);
  if (!ctx) return null;
  const btnClass =
    ctx.theme === "dark"
      ? "mt-2 px-3 py-1 rounded bg-gray-200 text-gray-900 hover:bg-gray-300"
      : "mt-2 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200";
  return (
    <div className="p-3 rounded border">
      <div>我是深层子组件，当前主题：{ctx.theme}</div>
      <button className={btnClass} onClick={ctx.toggle}>在子组件中切换主题</button>
    </div>
  );
}

export default function UseContextDemo() {
  const [theme, setTheme] = useState<Theme>("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const btnClass =
    theme === "dark"
      ? "px-3 py-1 rounded bg-gray-200 text-gray-900 hover:bg-gray-300"
      : "px-3 py-1 rounded bg-gray-100 hover:bg-gray-200";

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div className={`mx-auto max-w-xl p-6 ${theme === "dark" ? "bg-gray-900 text-gray-100" : ""}`}>
        <h1 className="text-2xl font-bold mb-4">useContext 演示</h1>
        <p className="text-sm text-gray-600 mb-6">
          useContext 用于跨组件层级共享数据，避免繁琐的 props 传递。通过 Context Provider 提供值，消费者组件可在任意深度获取。
        </p>

        <div className="space-y-4 border rounded-md p-4">
          <div className="flex items-center gap-3">
          <span className="font-medium">当前主题：</span>
          <span className={btnClass}>{theme}</span>
          <button className={btnClass} onClick={toggle}>切换主题</button>
        </div>

          <DeepChild />
        </div>

        <div className="mt-6 text-sm text-gray-600">
          提示：Provider 的值变更会通知所有使用该 Context 的后代组件重新渲染。
        </div>
      </div>
    </ThemeContext.Provider>
  );
}