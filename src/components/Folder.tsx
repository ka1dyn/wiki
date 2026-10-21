import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Folder as FolderDefault,
  FolderOpen,
} from "lucide-react";

interface FolderProps {
  name: string;
  count: number;
  open: boolean;
  nodeClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Folder({ name, count, open, nodeClick }: FolderProps) {
  return (
    <div
      className={cn(
        "w-full rounded-r-lg flex items-center py-1.5 pl-2 hover:bg-accent/20",
      )}
      onClick={nodeClick}
    >
      <div className="flex items-center gap-3">
        <ChevronRight
          className={cn("text-primary w-4 h-4 shrink-0", open && "rotate-90")}
        />

        {open ? (
          <FolderOpen className={cn("text-primary w-4 h-4 shrink-0")} />
        ) : (
          <FolderDefault className={cn("text-primary w-4 h-4 shrink-0")} />
        )}
        <div className="flex gap-3 items-center">
          <span className="font-medium">{name}</span>
          <span className="font-light text-xs">{count}편</span>
        </div>
      </div>
    </div>
  );
}
