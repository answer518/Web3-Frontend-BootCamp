"use client";

import React, { useLayoutEffect, useRef, useState } from "react";

export default function UseLayoutEffectDemo() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const update = () => {
      const rect = boxRef.current?.getBoundingClientRect();
      setSize({ width: Math.round(rect?.width || 0), height: Math.round(rect?.height || 0) });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">useLayoutEffect 演示</h1>
      <p className="text-sm text-gray-600 mb-6">
        useLayoutEffect 在浏览器绘制前同步执行，适合读取 DOM 布局并且进行同步更新，避免闪烁。
      </p>

      <div className="space-y-4 border rounded-md p-4">
        <div
          ref={boxRef}
          className="h-24 bg-blue-100 rounded flex items-center justify-center"
        >
          我是一个盒子（可调整窗口大小）
        </div>
        <div className="text-gray-700">
          盒子尺寸（实时测量）：{size.width}px × {size.height}px
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        提示：相较于 <code>useEffect</code>，<code>useLayoutEffect</code> 更适合需要同步读取并更新布局的场景。
      </div>
    </div>
  );
}