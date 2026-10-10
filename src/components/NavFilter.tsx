"use client";

import { cn } from "@/lib/utils";
import { useNavTriggerStore } from "@/stores";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useShallow } from "zustand/shallow";

export default function NavFilter() {
  const { isPublish, triggerExpand, triggerCollapse, changePublish } =
    useNavTriggerStore(
      useShallow((state) => ({
        isPublish: state.isPublish,
        triggerExpand: state.triggerExpand,
        triggerCollapse: state.triggerCollapse,
        changePublish: state.changePublish,
      })),
    );

  return (
    <div className="pl-1 flex items-center justify-between text-sm text-primary">
      <div className="flex h-fit gap-2">
        <div
          className={cn(
            "text-sm text-primary py-0.5 px-1 rounded-md cursor-pointer hover:underline underline-offset-3",
            isPublish && "text-foreground font-semibold ",
          )}
          onClick={() => changePublish(true)}
        >
          출판글
        </div>
        <div className="w-px bg-primary scale-50"></div>
        <div
          className={cn(
            "text-sm text-primary py-0.5 px-1 rounded-md cursor-pointer hover:underline underline-offset-3",
            !isPublish && "text-foreground font-semibold",
          )}
          onClick={() => changePublish(false)}
        >
          메모
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <div
          className={`transition-transform active:scale-90 flex items-center gap-1 relative py-1 cursor-pointer`}
          onClick={() => triggerExpand()}
        >
          <ChevronsUpDown className="w-4 h-4" />
          <div>펼치기</div>
        </div>
        <div
          className={`transition-transform active:scale-90 flex items-center gap-1 relative py-1 cursor-pointer`}
          onClick={() => triggerCollapse()}
        >
          <ChevronsDownUp className="w-4 h-4" />
          <div>접기</div>
        </div>
      </div>
    </div>
  );
}
