"use client";

import { cn, getHeadingScrollTop, textToId } from "@/lib/utils";

interface SideTocItemProps {
  depth: number;
  text: string;
  highlight: boolean;
}

export default function SideTocItem({
  depth,
  text,
  highlight,
}: SideTocItemProps) {
  const textId = textToId(text);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const targetElement = document.getElementById(textId);

    if (!targetElement) return;

    // Disable basic link operation
    e.preventDefault();

    // 헤딩이 헤더 바로 아래에 오도록 (하이라이트 breakpoint와 동일 공식)
    window.scrollTo({ top: getHeadingScrollTop(targetElement), behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "cursor-pointer",
        highlight &&
          "font-semibold text-foreground underline underline-offset-2",
        depth === 1 && "",
        depth === 2 && "ml-4 ",
        depth === 3 && "ml-8 ",
      )}
      onClick={handleClick}
    >
      {text}
    </div>
  );
}
