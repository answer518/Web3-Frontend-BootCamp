"use client";

import React, { memo, useCallback, useRef, useState } from "react";

// 记录子组件渲染次数
const RenderCounter: React.FC = memo(function RenderCounter() {
  const renders = useRef<number>(0);
  renders.current += 1;
  return <span className="text-xs text-gray-500">(渲染次数：{renders.current})</span>;
});

const ChildButton = memo(function ChildButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={onClick}>
      {label} <RenderCounter />
    </button>
  );
});

export default function UseCallbackDemo() {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>("");

  // 未使用 useCallback：每次渲染函数引用都会变化，导致子组件重新渲染
  const incUnstable = () => setCount((c) => c + 1);

  // 使用 useCallback：当依赖不变时，函数引用保持稳定，减少子组件不必要渲染
  const incStable = useCallback(() => setCount((c) => c + 1), []);

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">useCallback 演示</h1>
      <p className="text-sm text-gray-600 mb-6">
        useCallback 用于缓存函数引用，避免在父组件重新渲染时，子组件因接收到新的函数引用而不必要地重新渲染。
      </p>

      <div className="space-y-4 border rounded-md p-4">
        <div className="flex items-center gap-3">
          <span className="font-medium">计数器：</span>
          <span className="px-3 py-1 rounded bg-blue-50">{count}</span>
        </div>

        <div className="flex items-center gap-3">
          <ChildButton onClick={incUnstable} label="未使用 useCallback 增加" />
          <ChildButton onClick={incStable} label="使用 useCallback 增加" />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="text" className="font-medium">输入任意文本（触发父组件重渲染）：</label>
          <input
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="改变父组件状态"
            className="flex-1 px-3 py-2 border rounded"
          />
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        提示：观察两个按钮下的渲染次数，使用 <code>useCallback</code> 的按钮在父组件状态变化时不会增加渲染次数。
      </div>
    </div>
  );
}