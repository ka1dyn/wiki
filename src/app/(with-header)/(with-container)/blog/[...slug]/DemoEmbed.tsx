"use client";

import { useEffect, useRef, useState } from "react";

// ```demo 마커가 렌더하는 임베드 컴포넌트 (client — postMessage 리스너 필요).
// 데모(iframe 자식)가 보내는 높이 메시지를 받아 iframe 높이를 맞춘다.
//
// 헷지 원칙 ①: 데모 base URL은 변수 하나. 외부 호스트 전환 시 여기만.
// 헷지 원칙 ②: 높이 통신은 postMessage — same/cross-origin 모두 동작.

const DEMO_BASE = process.env.NEXT_PUBLIC_DEMO_BASE ?? "/demos";
const DEFAULT_HEIGHT = 480;

export function DemoEmbed({
  id,
  height,
}: {
  id?: string;
  height?: string | number;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  // 마커의 height는 자동높이 메시지가 오기 전까지의 초기값.
  const [h, setH] = useState<number>(Number(height) || DEFAULT_HEIGHT);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // 이 iframe이 보낸 메시지만 수용 (origin 무관 → same/cross 호환).
      if (!ref.current || e.source !== ref.current.contentWindow) return;
      const data = e.data;
      if (
        data &&
        data.type === "demo:height" &&
        typeof data.height === "number" &&
        data.height > 0
      ) {
        setH(Math.ceil(data.height));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!id) {
    return (
      <div className="my-8 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        ⚠️ demo 마커에 id가 없습니다.
      </div>
    );
  }

  return (
    // 넉넉한 여백/큰 stage — glow·그림자 잘림 방지 (설계 결정 C)
    <div className="my-10 flex justify-center">
      <iframe
        ref={ref}
        // Next의 public 서빙은 디렉토리 경로를 index.html로 해석하지 않으므로 명시.
        src={`${DEMO_BASE}/${id}/index.html`}
        title={`demo: ${id}`}
        loading="lazy"
        className="w-full rounded-md border border-sidebar-border bg-white"
        // box-sizing: content-box → height가 테두리에 먹히지 않고 콘텐츠 영역과
        // 정확히 일치(border-box면 테두리만큼 줄어 미세 내부 스크롤 발생).
        style={{ height: `${h}px`, boxSizing: "content-box" }}
        data-demo-id={id}
      />
    </div>
  );
}
