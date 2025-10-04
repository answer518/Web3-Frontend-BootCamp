"use client";
import React, { memo } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

// 索引页：列出所有 hooks 并提供 Link 与编程式导航
function Index() {
  const navigate = useNavigate();
  const hooks = [
    { path: "/useState", label: "useState" },
    { path: "/useEffect", label: "useEffect" },
    { path: "/useMemo", label: "useMemo" },
    { path: "/useCallback", label: "useCallback" },
    { path: "/useRef", label: "useRef" },
    { path: "/useReducer", label: "useReducer" },
    { path: "/useContext", label: "useContext" },
    { path: "/useLayoutEffect", label: "useLayoutEffect" },
  ];
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>React Router：Hooks 导航演示</h1>
      <p style={{ color: "#666" }}>
        该页面在 Next 的 App Router 中嵌入了 React Router（设置 <code>basename=&quot;/reactRouterDemo&quot;</code>）。
        通过 Link 与 <code>useNavigate</code> 导航到不同的 hooks 子页面。
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {hooks.map((h) => (
          <li key={h.path} style={{ margin: "10px 0", display: "flex", gap: 12, alignItems: "center" }}>
            <Link to={h.path}>跳转到 {h.label}</Link>
            <button
              onClick={() => navigate(h.path)}
              style={{ padding: "4px 10px", borderRadius: 6, background: "#eee" }}
            >
              使用 useNavigate({h.label})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// useState
function UseStatePage() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h2>useState 演示</h2>
      <p>在 React Router 子路由页面中使用本地状态。</p>
      <button onClick={() => setCount((c) => c - 1)}>-1</button>
      <span style={{ margin: "0 8px" }}>{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}

// useEffect
function UseEffectPage() {
  const [val, setVal] = React.useState("");
  React.useEffect(() => {
    document.title = `Effect 活跃：${val}`;
    return () => { document.title = "React Router Hooks Demo"; };
  }, [val]);
  return (
    <div>
      <h2>useEffect 演示</h2>
      <p>在挂载、更新与卸载时执行副作用与清理。</p>
      <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="输入以触发副作用" />
    </div>
  );
}

// useMemo
function fibSlow(n: number): number { if (n <= 1) return n; return fibSlow(n - 1) + fibSlow(n - 2); }
function UseMemoPage() {
  const [n, setN] = React.useState(25);
  const [dark, setDark] = React.useState(false);
  const val = React.useMemo(() => fibSlow(n), [n]);
  return (
    <div style={{ padding: 12, borderRadius: 8, background: dark ? "#111" : "#f7f7f7", color: dark ? "#fff" : "#333" }}>
      <h2>useMemo 演示</h2>
      <p>缓存高开销计算，避免重复计算。</p>
      <input type="number" value={n} min={0} max={40} onChange={(e) => setN(Number(e.target.value))} />
      <button style={{ marginLeft: 8 }} onClick={() => setDark((d) => !d)}>{dark ? "浅色" : "深色"}</button>
      <div style={{ marginTop: 8 }}>fib({n}) = {val}</div>
    </div>
  );
}

// useCallback
const RenderInfo = memo(function RenderInfo() {
  const r = React.useRef(0);
  r.current += 1;
  return <span style={{ marginLeft: 6, color: "#666" }}>(渲染：{r.current})</span>;
});
const ChildBtn = memo(function ChildBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (<button onClick={onClick} style={{ padding: "4px 10px", borderRadius: 6, background: "#eee" }}>
    {label}
    <RenderInfo />
  </button>)
});
function UseCallbackPage() {
  const [c, setC] = React.useState(0);
  const [t, setT] = React.useState("");
  const incUnstable = () => setC((v) => v + 1);
  const incStable = React.useCallback(() => setC((v) => v + 1), []);
  return (
    <div>
      <h2>useCallback 演示</h2>
      <p>缓存函数引用，减少子组件不必要渲染。</p>
      <div style={{ marginBottom: 8 }}>计数：{c}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <ChildBtn onClick={incUnstable} label="未缓存增加" />
        <ChildBtn onClick={incStable} label="useCallback 增加" />
      </div>
      <input value={t} onChange={(e) => setT(e.target.value)} placeholder="触发父组件渲染" style={{ marginTop: 8 }} />
    </div>
  );
}

// useRef
function UseRefPage() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const renderRef = React.useRef(0);
  renderRef.current += 1;
  const focus = () => inputRef.current?.focus();
  return (
    <div>
      <h2>useRef 演示</h2>
      <p>持久化可变引用，常用于操作 DOM 或记录信息。</p>
      <input ref={inputRef} placeholder="点击按钮聚焦" />
      <button style={{ marginLeft: 8 }} onClick={focus}>聚焦</button>
      <div style={{ color: "#666", marginTop: 6 }}>页面渲染次数：{renderRef.current}</div>
    </div>
  );
}

// useReducer
type S = { count: number };
type A = { type: "inc" } | { type: "dec" } | { type: "reset" };
const reducer = (s: S, a: A): S => a.type === "inc" ? { count: s.count + 1 } : a.type === "dec" ? { count: s.count - 1 } : { count: 0 };
function UseReducerPage() {
  const [state, dispatch] = React.useReducer(reducer, { count: 0 });
  return (
    <div>
      <h2>useReducer 演示</h2>
      <p>集中管理状态变更逻辑，适合复杂状态。</p>
      <button onClick={() => dispatch({ type: "dec" })}>-1</button>
      <span style={{ margin: "0 8px" }}>{state.count}</span>
      <button onClick={() => dispatch({ type: "inc" })}>+1</button>
      <button style={{ marginLeft: 8 }} onClick={() => dispatch({ type: "reset" })}>重置</button>
    </div>
  );
}

// useContext
type Theme = "light" | "dark";
const ThemeCtx = React.createContext<{ theme: Theme; toggle: () => void } | null>(null);
function Deep() {
  const ctx = React.useContext(ThemeCtx);
  if (!ctx) return null;
  const btnStyle = ctx.theme === "dark" ? { background: "#ddd", color: "#111" } : { background: "#eee" };
  return (
    <div style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}>
      <div>深层组件当前主题：{ctx.theme}</div>
      <button style={{ ...btnStyle, padding: "4px 10px", borderRadius: 6, marginTop: 6 }} onClick={ctx.toggle}>在子组件切换主题</button>
    </div>
  );
}
function UseContextPage() {
  const [theme, setTheme] = React.useState<Theme>("light");
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
}

// useLayoutEffect
function UseLayoutEffectPage() {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  React.useLayoutEffect(() => {
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
      <h2>useLayoutEffect 演示</h2>
      <p>在绘制前同步测量与更新布局。</p>
      <div ref={boxRef} style={{ height: 80, background: "#dbeafe", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>盒子</div>
      <div style={{ marginTop: 6 }}>尺寸：{size.w}px × {size.h}px</div>
    </div>
  );
}

export default function ReactRouterDemoPage() {
  return (
    <BrowserRouter basename="/reactRouterDemo">
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <nav style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <Link to="/">索引</Link>
          <Link to="/useState">useState</Link>
          <Link to="/useEffect">useEffect</Link>
          <Link to="/useMemo">useMemo</Link>
          <Link to="/useCallback">useCallback</Link>
          <Link to="/useRef">useRef</Link>
          <Link to="/useReducer">useReducer</Link>
          <Link to="/useContext">useContext</Link>
          <Link to="/useLayoutEffect">useLayoutEffect</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/useState" element={<UseStatePage />} />
          <Route path="/useEffect" element={<UseEffectPage />} />
          <Route path="/useMemo" element={<UseMemoPage />} />
          <Route path="/useCallback" element={<UseCallbackPage />} />
          <Route path="/useRef" element={<UseRefPage />} />
          <Route path="/useReducer" element={<UseReducerPage />} />
          <Route path="/useContext" element={<UseContextPage />} />
          <Route path="/useLayoutEffect" element={<UseLayoutEffectPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}