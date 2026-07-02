"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SideTocItem from "./SideTocItem";
import { cn, textToId, TOC_SCROLL_OFFSET } from "@/lib/utils";

interface SideToc {
  tocData: {
    orderTxt: string;
    depth: number;
    text: string;
  }[];
}

export default function SideToc({ tocData }: SideToc) {
  const [scrollIdx, setScrollIdx] = useState<number>(0);
  const prevScrollIdx = useRef<number>(0);
  const filteredTocData = useMemo(() => {
    return tocData.filter((el) => el.depth !== 3);
  }, [tocData]);

  useEffect(() => {
    // 감지=scroll(빠른 스크롤에 강함), 재측정=ResizeObserver(데모 iframe 리사이즈 등
    // 레이아웃 변화 시 헤딩 위치를 다시 잰다). breakPoint[0]=0은 "맨 위" 센티넬.
    let breakPoint: number[] = [0];

    const computeBreakpoints = () => {
      const bp: number[] = [0];
      filteredTocData.forEach((toc) => {
        const el = document.getElementById(textToId(toc.text));
        if (!el) {
          bp.push(bp.at(-1) ?? 0);
          return;
        }
        // document 기준 위치 - 헤더 오프셋 (클릭 착지 지점과 동일 기준)
        bp.push(
          el.getBoundingClientRect().top + window.scrollY - TOC_SCROLL_OFFSET,
        );
      });
      breakPoint = bp;
      updateActive(); // 재측정 직후 현재 위치로 즉시 갱신
    };

    const getScrollIdx = (scroll: number) => {
      let ret = 0;
      breakPoint.forEach((point, idx) => {
        if (scroll >= point) ret = idx;
      });
      return ret;
    };

    const updateActive = () => {
      const idx = getScrollIdx(window.scrollY);
      if (idx !== prevScrollIdx.current) {
        prevScrollIdx.current = idx;
        setScrollIdx(idx);
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    };

    computeBreakpoints();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", computeBreakpoints);
    // 본문 높이가 바뀌면(데모 iframe 자동높이 등) 헤딩 위치 재측정
    const ro = new ResizeObserver(() => computeBreakpoints());
    ro.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", computeBreakpoints);
      ro.disconnect();
    };
  }, [filteredTocData]);

  return (
    <div
      className={cn(
        "sticky top-40 left-0 flex flex-col gap-1.5 text-sm text-muted-foreground pl-3 font-pretendard border-l-2 border-accent/30",
        "transition-all duration-400 ease-out opacity-100 pointer-events-auto",
        scrollIdx === 0 && "opacity-0 pointer-events-none",
      )}
    >
      {filteredTocData.map((toc, idx) => {
        const { orderTxt, depth, text } = toc;
        if (depth === 3) return;
        return (
          <SideTocItem
            depth={depth}
            text={text}
            key={orderTxt}
            highlight={scrollIdx - 1 === idx}
          />
        );
      })}
    </div>
  );
}
