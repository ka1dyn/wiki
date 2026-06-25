import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

const card = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
  padding: 28,
  borderRadius: 16,
  background: "white",
  boxShadow: "0 10px 30px rgba(99, 102, 241, 0.18)",
};
const count = { fontSize: 48, fontWeight: 700, color: "#4f46e5", minWidth: 80, textAlign: "center" };
const row = { display: "flex", gap: 10 };
const btn = {
  border: "none",
  borderRadius: 10,
  padding: "10px 18px",
  fontSize: 16,
  fontWeight: 600,
  color: "white",
  background: "#6366f1",
  cursor: "pointer",
};

function Counter() {
  const [n, setN] = useState(0);
  return (
    <div style={card}>
      <div style={count}>{n}</div>
      <div style={row}>
        <button style={btn} onClick={() => setN((v) => v - 1)}>
          −1
        </button>
        <button style={{ ...btn, background: "#94a3b8" }} onClick={() => setN(0)}>
          reset
        </button>
        <button style={btn} onClick={() => setN((v) => v + 1)}>
          +1
        </button>
      </div>
      <div style={{ color: "#475569", fontSize: 13 }}>React {n === 0 ? "준비됨" : "동작 중"}</div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Counter />
  </StrictMode>,
);

// ── 자동높이: 콘텐츠 높이를 부모로 전송 (hello-box와 동일 스니펫) ──
function postHeight() {
  const h = Math.ceil(document.body.getBoundingClientRect().height);
  parent.postMessage({ type: "demo:height", height: h }, "*");
}
window.addEventListener("load", postHeight);
if (window.ResizeObserver) new ResizeObserver(postHeight).observe(document.body);
postHeight();
