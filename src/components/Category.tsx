"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface CategoryProps {
  name: string;
  className?: string;
  bgColor?: boolean;
  disabled?: boolean;
}

export default function Category({
  name,
  className,
  bgColor = false,
  disabled = false,
}: CategoryProps) {
  const [isHovered, setIsHovered] = useState(false);

  let fontColor = "";
  switch (name) {
    case "일반":
      fontColor = "#3d3529";
      break;
    case "기능구현":
      fontColor = "#5b8300";
      break;
    case "문제해결":
      fontColor = "#c25450";
      break;
    case "성능개선":
      fontColor = "#2b7db1";
      break;
    case "추천":
      fontColor = "#cd660c";
      break;

    default:
      fontColor = "#3d3529";
  }

  const accent = !disabled && (bgColor || isHovered);

  return (
    <div
      className={cn(
        "px-2 py-1 bolder text-[13px] rounded-md w-fit border transition-all duration-300 ease-out",
        accent ? "font-bold" : "font-semibold",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor: `${fontColor}77`,
        backgroundColor: accent ? `${fontColor}aa` : "",
      }}
    >
      <span
        className="text-white"
        style={{
          color: accent ? `#ffffff` : `${fontColor}`,
        }}
      >
        {name}
      </span>
    </div>
  );
}
