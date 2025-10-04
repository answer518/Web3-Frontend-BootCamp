"use client";

import React, { useEffect, useRef, useState } from "react";

export default function UseRefDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCountRef = useRef<number>(0);
  const prevValueRef = useRef<string>("");

  const [value, setValue] = useState<string>("");

  // 记录渲染次数与前一个 value
  useEffect(() => {
    renderCountRef.current += 1;
    prevValueRef.current = value;
  }, [value]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">useRef 演示</h1>
      <p className="text-sm text-gray-600 mb-6">
        useRef 提供一个可变的引用对象，其 <code>.current</code> 属性在整个生命周期内保持不变。适合保存不参与渲染的值或引用 DOM 元素。
      </p>

      <div className="space-y-4 border rounded-md p-4">
        <div className="flex items-center gap-3">
          <label htmlFor="refInput" className="font-medium">输入框：</label>
          <input
            id="refInput"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="试试聚焦按钮"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button className="px-3 py-1 rounded bg-gray-100" onClick={focusInput}>聚焦</button>
        </div>

        <div className="text-gray-700">
          当前值：{value}；前一个值：{prevValueRef.current || "(无)"}
        </div>
        <div className="text-gray-700">
          渲染次数（通过 ref 记录）：{renderCountRef.current}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        提示：<code>useRef</code> 更新不会触发重新渲染，适用于记录信息与操作 DOM。
      </div>
    </div>
  );
}