"use client";

import { cn, textToId, TOC_SCROLL_OFFSET } from "@/lib/utils";
import Link from "next/link";

interface PageTocItemProps {
  depth: number;
  text: string;
  orderTxt: string;
}

export default function PageTocItem({
  depth,
  text,
  orderTxt,
}: PageTocItemProps) {
  const textId = textToId(text);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const targetElement = document.getElementById(textId);

    if (!targetElement) return;

    // Disable basic link operation
    e.preventDefault();

    // document 기준 위치 - 헤더 오프셋 → 헤딩이 헤더 바로 아래에 온다
    const top =
      targetElement.getBoundingClientRect().top +
      window.scrollY -
      TOC_SCROLL_OFFSET;

    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "cursor-pointer bg-card px-2 py-2.5 border-x border-b border-sidebar-border text-sm",
        depth === 1 && "bg-accent/30",
        depth === 2 && "bg-accent/10",
        depth === 3 && "",
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          "flex gap-2",
          depth === 1 && "",
          depth === 2 && "ml-4",
          depth === 3 && "ml-8",
        )}
      >
        <span>{orderTxt}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
