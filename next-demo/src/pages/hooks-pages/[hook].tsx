import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, createContext, useContext } from "react";
import { useRouter } from "next/router";

// 小型演示组件集合
const UseStateDemo = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>useState：用于在函数组件中管理本地状态。</p>
      <button onClick={() => setCount((c) => c - 1)}>-1</button>
      <span style={{ margin: "0 8px" }}>{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
};

const UseEffectDemo = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `计数：${count}`;
    return () => { document.title = "Next Hooks Demo"; };
  }, [count]);

  return (
    <div>
      <p>useEffect：在渲染后执行副作用与清理。</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <span style={{ marginLeft: 8 }}>{count}</span>
    </div>
  );
};

function slow(n: number): number {
  if (n <= 1) return n;
  return slow(n - 1) + slow(n - 2);
}
const UseMemoDemo = () => {
  const [n, setN] = useState(24);
  const [themeDark, setThemeDark] = useState(false);
  const val = useMemo(() => slow(n), [n]);
  return (
    <div style={{ padding: 10, borderRadius: 8, background: themeDark ? "#111" : "#f7f7f7", color: themeDark ? "#fff" : "#333" }}>
      <p>useMemo：缓存高开销计算结果，避免不必要的重算。</p>
      <input type="number" value={n} min={0} max={40} onChange={(e) => setN(Number(e.target.value))} />
      <button style={{ marginLeft: 8 }} onClick={() => setThemeDark((v) => !v)}>{themeDark ? "浅色" : "深色"}</button>
      <div>fib({n}) = {val}</div>
    </div>
  );
};

const RenderInfo = memo(function RenderInfo() {
  const renders = useRef(0);
  renders.current += 1;
  return <span style={{ marginLeft: 6, color: "#666" }}>(渲染：{renders.current})</span>;
});
const ChildBtn = memo(function ChildBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{ padding: "4px 10px", borderRadius: 6, background: "#eee" }}>
      {label}
      <RenderInfo />
    </button>
  );
});
const UseCallbackDemo = () => {
  const [c, setC] = useState(0);
  const [t, setT] = useState("");
  const incUnstable = () => setC((v) => v + 1);
  const incStable = useCallback(() => setC((v) => v + 1), []);
  return (
    <div>
      <p>useCallback：缓存函数引用，降低子组件不必要渲染。</p>
      <div style={{ marginBottom: 8 }}>计数：{c}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <ChildBtn onClick={incUnstable} label="未缓存增加" />
        <ChildBtn onClick={incStable} label="useCallback 增加" />
      </div>
      <input value={t} onChange={(e) => setT(e.target.value)} placeholder="触发父组件渲染" style={{ marginTop: 8 }} />
    </div>
  );
};

const UseRefDemo = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const focus = () => inputRef.current?.focus();
  return (
    <div>
      <p>useRef：持久化可变引用，常用于 DOM 操作与记录信息。</p>
      <input ref={inputRef} placeholder="点击按钮聚焦" />
      <button style={{ marginLeft: 8 }} onClick={focus}>聚焦</button>
    </div>
  );
};

type S = { count: number };
type A = { type: "inc" } | { type: "dec" } | { type: "reset" };
const reducer = (s: S, a: A): S => a.type === "inc" ? { count: s.count + 1 } : a.type === "dec" ? { count: s.count - 1 } : { count: 0 };
const UseReducerDemo = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <div>
      <p>useReducer：集中管理状态变更逻辑，适合复杂状态。</p>
      <button onClick={() => dispatch({ type: "dec" })}>-1</button>
      <span style={{ margin: "0 8px" }}>{state.count}</span>
      <button onClick={() => dispatch({ type: "inc" })}>+1</button>
      <button style={{ marginLeft: 8 }} onClick={() => dispatch({ type: "reset" })}>重置</button>
    </div>
  );
};

type Theme = "light" | "dark";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void } | null>(null);
const Deep = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) return null;
  const btnStyle = ctx.theme === "dark" ? { background: "#ddd", color: "#111" } : { background: "#eee" };
  return (
    <div style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}>
      <div>深层组件当前主题：{ctx.theme}</div>
      <button style={{ ...btnStyle, padding: "4px 10px", borderRadius: 6, marginTop: 6 }} onClick={ctx.toggle}>在子组件切换主题</button>
    </div>
  );
};
const UseContextDemo = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const style = theme === "dark" ? { background: "#111", color: "#fff", padding: 10, borderRadius: 8 } : { padding: 10, borderRadius: 8, background: "#fafafa" };
  const btnStyle = theme === "dark" ? { background: "#ddd", color: "#111" } : { background: "#eee" };
  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      <div style={style}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>当前主题：</span>
          <span style={{ padding: "2px 8px", borderRadius: 6, background: "#cfe3ff", color: "#333" }}>{theme}</span>
          <button style={{ ...btnStyle, padding: "4px 10px", borderRadius: 6 }} onClick={toggle}>切换主题</button>
        </div>
        <div style={{ marginTop: 10 }}>
          <Deep />
        </div>
      </div>
    </ThemeCtx.Provider>
  );
};

const UseLayoutEffectDemo = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const update = () => {
      const rect = boxRef.current?.getBoundingClientRect();
      setSize({ w: Math.round(rect?.width || 0), h: Math.round(rect?.height || 0) });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return (
    <div>
      <p>useLayoutEffect：在绘制前同步测量与更新布局。</p>
      <div ref={boxRef} style={{ height: 80, background: "#dbeafe", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>盒子</div>
      <div>尺寸：{size.w}px × {size.h}px</div>
    </div>
  );
};

const demos: Record<string, React.ReactNode> = {
  useState: <UseStateDemo />,
  useEffect: <UseEffectDemo />,
  useMemo: <UseMemoDemo />,
  useCallback: <UseCallbackDemo />,
  useRef: <UseRefDemo />,
  useReducer: <UseReducerDemo />,
  useContext: <UseContextDemo />,
  useLayoutEffect: <UseLayoutEffectDemo />,
};

export default function HookPage() {
  const router = useRouter();
  const hook = router.query.hook as string;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h2>Page Router：{hook} 演示</h2>
      <p style={{ color: "#666" }}>使用 <code>next/router</code> 的动态路由，根据 URL 渲染对应 Hook 的小型示例。</p>
      <div style={{ marginTop: 12 }}>{demos[hook] || <div>未知 Hook：{hook}</div>}</div>
      <div style={{ marginTop: 16 }}>
        <button onClick={() => router.push("/hooks-pages")} style={{ padding: "6px 12px", borderRadius: 6, background: "#eee" }}>返回索引</button>
      </div>
    </div>
  );
}