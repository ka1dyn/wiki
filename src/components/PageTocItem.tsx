"use client";

import { cn, smoothScrollToHeading, textToId } from "@/lib/utils";
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

    // 헤딩으로 스크롤 (데모 로드로 목표가 밀려도 안정될 때까지 재조준)
    smoothScrollToHeading(targetElement);
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
