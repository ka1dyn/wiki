"use client";

import { cn, smoothScrollToHeading, textToId } from "@/lib/utils";

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

    // 헤딩으로 스크롤 (데모 로드로 목표가 밀려도 안정될 때까지 재조준)
    smoothScrollToHeading(targetElement);
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
