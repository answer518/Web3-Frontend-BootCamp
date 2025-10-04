"use client";

import React, { useReducer } from "react";

type State = { count: number };
type Action = { type: "inc" } | { type: "dec" } | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "inc":
      return { count: state.count + 1 };
    case "dec":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      return state;
  }
}

export default function UseReducerDemo() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">useReducer 演示</h1>
      <p className="text-sm text-gray-600 mb-6">
        useReducer 适用于管理复杂状态与状态变更逻辑，将更新集中到 reducer 中以提升可维护性与可预测性。
      </p>

      <div className="space-y-4 border rounded-md p-4">
        <div className="flex items-center gap-3">
          <span className="font-medium">计数器：</span>
          <button className="px-3 py-1 rounded bg-gray-100" onClick={() => dispatch({ type: "dec" })}>-1</button>
          <span className="px-3 py-1 rounded bg-blue-50">{state.count}</span>
          <button className="px-3 py-1 rounded bg-gray-100" onClick={() => dispatch({ type: "inc" })}>+1</button>
          <button className="px-3 py-1 rounded bg-gray-100" onClick={() => dispatch({ type: "reset" })}>重置</button>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        提示：通过 <code>dispatch</code> 分发不同的 action，统一由 <code>reducer</code> 处理状态更新。
      </div>
    </div>
  );
}