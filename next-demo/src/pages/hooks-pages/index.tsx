import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const hooks = [
  "useState",
  "useEffect",
  "useMemo",
  "useCallback",
  "useRef",
  "useReducer",
  "useContext",
  "useLayoutEffect",
];

export default function HooksPagesIndex() {
  const router = useRouter();

  const go = (hook: string) => {
    router.push(`/hooks-pages/${hook}`);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1>Page Router：Hooks 导航演示</h1>
      <p style={{ color: "#666" }}>
        本页基于 Page Router（src/pages）。点击链接或使用按钮进行编程式导航，前往对应的 Hook 演示页。
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {hooks.map((h) => (
          <li key={h} style={{ margin: "10px 0", display: "flex", gap: 12 }}>
            <Link href={`/hooks-pages/${h}`}>跳转到 {h}</Link>
            <button
              onClick={() => go(h)}
              style={{ padding: "4px 10px", borderRadius: 6, background: "#eee" }}
            >
              使用 useRouter.push({h})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}