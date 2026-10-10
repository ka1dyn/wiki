"use client";

import { BreakPointQuery } from "@/enums";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useNavTriggerStore } from "@/stores";
import { NotebookText, StickyNote, Dot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LeafProps {
  name: string;
  path?: string;
  isPublish: boolean;
}

export default function Leaf({ name, path, isPublish }: LeafProps) {
  const fullPath = path ? `/blog${path}` : "/";
  const xl2 = useMediaQuery(BreakPointQuery.XL2);
  const navClose = useNavTriggerStore((state) => state.navClose);
  const pathname = decodeURIComponent(usePathname());

  return (
    <Link
      href={fullPath}
      onClick={() => !xl2 && navClose()}
      className={cn(
        "w-full rounded-lg flex items-center py-1.5 pl-2 group/leaf relative",
        "hover:bg-accent/20",
        fullPath === pathname && "bg-accent/20",
      )}
    >
      {/* <div className="w-4"></div> */}
      <div className="ml-1 flex items-center gap-3">
        <Dot className="text-primary/50 w-5 h-5 shrink-0" />
        <div className="flex gap-2 items-center pr-2">
          <span className="font-medium text-foreground/80 group-hover/leaf:text-foreground">
            {name}
          </span>
        </div>

        {/* <div
          className={cn(
            "absolute top-1/2 right-2 size-1 rounded-full -translate-y-1/2",
            isPublish ? "bg-muted-foreground/80" : "bg-muted-foreground/30",
          )}
        ></div> */}
      </div>
    </Link>
  );
}
