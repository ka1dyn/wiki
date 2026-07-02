"use client";

import { cn, textToId, TOC_SCROLL_OFFSET } from "@/lib/utils";

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
