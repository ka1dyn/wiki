import { cn, dateFormat } from "@/lib/utils";
import { Clock, FolderOpen, Star } from "lucide-react";
import Link from "next/link";
import readingTime from "reading-time";
import Category from "./Category";
import { forwardRef } from "react";

interface PostCardProps {
  slug: string;
  thumbnail: string;
  title: string;
  date: Date;
  category: string;
  lock: boolean;
  description: string;
  content: string;
  recommended: boolean;
}

const PostCard = forwardRef<HTMLAnchorElement, PostCardProps>(
  (
    {
      slug,
      thumbnail,
      title,
      date,
      category,
      lock,
      description,
      content,
      recommended,
    },
    ref,
  ) => {
    const formattedDate = dateFormat(date);

    const readTime = readingTime(content);
    const readMinute = Math.ceil(readTime.minutes);

    return (
      <Link
        ref={ref}
        href={`/blog${slug}`}
        className={cn(
          "relative h-[430px] w-full max-w-[420px] flex flex-col rounded-sm overflow-hidden border border-sidebar-border/50",
          "transition-all ease-out group shadow-lg hover:shadow-xl opacity-0 -translate-y-5",
          "data-[visible='true']:opacity-100 data-[visible='true']:translate-y-0 data-[visible='true']:hover:-translate-y-2",
        )}
        data-visible="false"
      >
        {/* <span className="absolute top-3 left-4 z-10 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow"> */}
        {recommended && (
          <Star className="absolute top-3 left-3 text-transparent size-4.5 fill-yellow-300" />
        )}
        {/* </span> */}
        <div className="h-47 shrink-0 flex items-center overflow-hidden">
          <img className="w-full min-h-full" src={thumbnail} />
        </div>
        <div className="flex-1 px-5 py-4 bg-card w-full">
          <div className="relative h-full flex flex-col">
            <div className="flex flex-col mb-3">
              <h2 className="font-semibold text-[1.25rem] group-hover:text-primary">
                {title}
              </h2>
              {/* <div className="text-sm flex gap-1 items-center pl-0.5">
                <FolderOpen className="w-3 h-3 text-primary" />
                <span className="text-muted-foreground/70 text-xs">
                  {slug.replace("/blog", "")}
                </span>
              </div> */}
            </div>
            <p className="text-xs text-muted-foreground break-all">
              {description.slice(0, 90)}
            </p>
            <div className="absolute bottom-10 right-0">
              <Category name={category} className="mb-2" disabled />
            </div>

            <div className="absolute bottom-0 w-full text-xs text-foreground flex justify-between">
              <div className="absolute -top-4 left-0 w-16 h-px bg-primary/30"></div>
              <span>{formattedDate}</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="-translate-y-px">{readMinute}분</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  },
);

export default PostCard;
