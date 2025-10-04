"use client";

import React, { useState } from "react";

export default function UseStateDemo() {
  const [count, setCount] = useState<number>(0);
  const [name, setName] = useState<string>("");

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">useState 演示</h1>
      <p className="text-sm text-gray-600 mb-6">
        useState 用于在函数组件中添加本地状态。每次调用都会返回当前值和一个用于更新该值的函数。
      </p>

      <div className="space-y-4 border rounded-md p-4">
        <div className="flex items-center gap-3">
          <span className="font-medium">计数器：</span>
          <button className="px-3 py-1 rounded bg-gray-100" onClick={() => setCount((c) => c - 1)}>-1</button>
          <span className="px-3 py-1 rounded bg-blue-50">{count}</span>
          <button className="px-3 py-1 rounded bg-gray-100" onClick={() => setCount((c) => c + 1)}>+1</button>
          <button className="px-3 py-1 rounded bg-gray-100" onClick={() => setCount(0)}>重置</button>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="name" className="font-medium">姓名：</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入你的名字"
            className="flex-1 px-3 py-2 border rounded"
          />
        </div>

        <div className="text-gray-700">你好，{name || "陌生人"}！</div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        提示：每次点击按钮或输入内容都会触发状态更新，从而引发组件重新渲染。
      </div>
    </div>
  );
}