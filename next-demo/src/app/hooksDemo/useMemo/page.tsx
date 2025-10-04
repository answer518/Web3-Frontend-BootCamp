"use client";

import React, { useMemo, useState } from "react";

// 一个耗时计算（示例）
function slowFib(n: number): number {
  if (n <= 1) return n;
  // 纯计算型递归，模拟高开销
  return slowFib(n - 1) + slowFib(n - 2);
}

export default function UseMemoDemo() {
  const [n, setN] = useState<number>(25);
  const [themeDark, setThemeDark] = useState<boolean>(false);

  // 只有 n 变化时才重新计算，避免无关状态引发的高开销重算
  const fibValue = useMemo(() => slowFib(n), [n]);

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">useMemo 演示</h1>
      <p className="text-sm text-gray-600 mb-6">
        useMemo 用于缓存计算结果，只有在依赖发生变化时才重新计算，避免不必要的性能开销。
      </p>

      <div className={`space-y-4 border rounded-md p-4 ${themeDark ? "bg-gray-900 text-gray-100" : "bg-white"}`}>
        <div className="flex items-center gap-3">
          <label htmlFor="n" className="font-medium">斐波那契 n：</label>
          <input
            id="n"
            type="number"
            min={0}
            max={40}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-24 px-3 py-2 border rounded"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="font-medium">切换主题（不应触发重新计算）：</span>
          <button className="px-3 py-1 rounded bg-gray-100" onClick={() => setThemeDark((v) => !v)}>
            {themeDark ? "浅色" : "深色"}
          </button>
        </div>

        <div className="text-gray-700">
          结果：fib({n}) = {fibValue}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        提示：只有 <code>n</code> 变化才会造成重新计算；切换主题不会触发 <code>slowFib</code> 重算。
      </div>
    </div>
  );
}