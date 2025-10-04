"use client";

import React, { useEffect, useState } from "react";

export default function UseEffectDemo() {
  const [count, setCount] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  // 副作用：同步 document.title，并在卸载时清理
  useEffect(() => {
    document.title = `计数：${count}`;
    return () => {
      // 清理示例：恢复标题
      document.title = "Next Hooks Demo";
    };
  }, [count]);

  // 模拟订阅：组件挂载时开启，卸载时清理
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      // 每 5s 打印一次，代表某种订阅活动
      // eslint-disable-next-line no-console
      console.log("订阅活动：定时器仍在运行...");
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">useEffect 演示</h1>
      <p className="text-sm text-gray-600 mb-6">
        useEffect 用于在渲染后执行副作用（如数据获取、订阅、DOM 操作）。依赖数组控制副作用的触发时机，返回函数用于清理。
      </p>

      <div className="space-y-4 border rounded-md p-4">
        <div className="flex items-center gap-3">
          <span className="font-medium">计数器：</span>
          <button className="px-3 py-1 rounded bg-gray-100" onClick={() => setCount((c) => c - 1)}>-1</button>
          <span className="px-3 py-1 rounded bg-blue-50">{count}</span>
          <button className="px-3 py-1 rounded bg-gray-100" onClick={() => setCount((c) => c + 1)}>+1</button>
        </div>

        <div className="text-gray-700">组件已挂载：{mounted ? "是" : "否"}</div>
        <div className="text-gray-700">当前页面标题会同步展示计数值。</div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        提示：依赖数组为 <code>[count]</code> 时，计数变化才会重新运行副作用；为空数组时只在挂载与卸载时运行。
      </div>
    </div>
  );
}