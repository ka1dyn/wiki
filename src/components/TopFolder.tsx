import { cn } from "@/lib/utils";

interface TopFolderProps {
  name: string;
}

export default function TopFolder({ name }: TopFolderProps) {
  return (
    <div
      className={cn("w-full rounded-r-lg flex items-center py-1.5 px-1.5 mb-1")}
    >
      <div className="flex gap-2 items-center">
        <span className="font-light text-[13px]">{name}</span>
      </div>
    </div>
  );
}
