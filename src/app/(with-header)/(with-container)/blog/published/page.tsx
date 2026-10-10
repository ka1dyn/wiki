import BreadCrumbUpdater from "@/components/BreadCrumbUpdater";
import Category from "@/components/Category";
import { getAllSeries, getPublishedPosts } from "@/lib/posts";
import { cn, dateFormat } from "@/lib/utils";
import { Filter } from "lucide-react";
import Link from "next/link";
import AnimatedGrid from "./AnimatedGrid";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category: string; series: string }>;
}) {
  let { category, series } = await searchParams;
  if (!category) category = "전체";
  if (!series) series = "전체";

  const { published, sortedSlugs } = getPublishedPosts();
  const seriesInfo = getAllSeries();

  const slugs = sortedSlugs.filter((slug) => {
    const post = published[slug];
    const { front } = post;
    const {
      category: frontCategory,
      series: frontSeries,
      recommended: frontRecommended,
    } = front;

    const filterCategory =
      category === "전체" ||
      (category === "추천" && frontRecommended) ||
      category === frontCategory;
    const filterSeries = series === "전체" || frontSeries.includes(series);

    return filterCategory && filterSeries;
  });
  const publishedCount = slugs.length;

  const recentUpdated =
    slugs.length === 0
      ? "-"
      : dateFormat(new Date(published[slugs[0]].front.date));

  const isSeries = series !== "전체";

  return (
    <div className="flex flex-col">
      <BreadCrumbUpdater path={"/Published"} />

      <div className="flex flex-col items-center md:items-start mb-16">
        <div className="text-3xl mb-6 font-semibold">모음집</div>
        <div className="flex justify-center md:justify-start flex-wrap gap-3">
          {Object.entries(seriesInfo).map(([key, value], index) => (
            <Link
              href={`/blog/published?series=${key}`}
              key={key}
              className={cn(
                "px-4 py-2 rounded-lg bg-accent/10 border border-primary/30 text-foreground text-sm hover:bg-primary/90 hover:text-white transition-all duration-300 ease-out backdrop-blur-sm group",
                "animate-slide-in-up opacity-0",
                "cursor-pointer z-30",
                series === key && "bg-primary/90 text-white",
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="transition-colors mr-1">#</span>
              {key}
              <span className="ml-2 text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                {value}편
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col md:flex-row justify-between mb-8 md:mb-12">
        <div className="flex flex-col gap-6 md:m-0">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl mb-2 font-semibold">
              <span className="-translate-y-0.5">출판글</span>
            </h1>
            <p className="hidden text-foreground md:block">
              {isSeries ? (
                <span>
                  <span className="font-semibold underline underline-offset-1">
                    {series}
                  </span>{" "}
                  주제에 관련된 글 모음입니다
                </span>
              ) : (
                "서재에 보관된 모든 글을 둘러보세요"
              )}
            </p>
          </div>
          <div className="gap-4 text-sm items-center font-light hidden md:flex">
            <span>
              총 <span className="font-bold">{publishedCount}편</span>
            </span>
            <div className="h-2/3 w-px bg-primary/30"></div>
            <span>최근 업데이트: {recentUpdated}</span>
          </div>
        </div>
        <div className="flex-col items-center gap-2 hidden md:flex md:gap-3 md:items-end md:absolute md:bottom-0 md:right-0">
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-foreground text-sm">카테고리 필터</span>
          </div>
          <div className="w-fit flex text gap-2 text-primary">
            <Link href={`/blog/published?series=${series}&category=전체`}>
              <Category
                name="전체"
                bgColor={category === "전체"}
                className="cursor-pointer"
              />
            </Link>
            <Link href={`/blog/published?series=${series}&category=추천`}>
              <Category
                name="추천"
                bgColor={category === "추천"}
                className="cursor-pointer"
              />
            </Link>
            <Link href={`/blog/published?series=${series}&category=성능개선`}>
              <Category
                name="성능개선"
                bgColor={category === "성능개선"}
                className="cursor-pointer"
              />
            </Link>
            <Link href={`/blog/published?series=${series}&category=문제해결`}>
              <Category
                name="문제해결"
                bgColor={category === "문제해결"}
                className="cursor-pointer"
              />
            </Link>
            <Link href={`/blog/published?series=${series}&category=기능구현`}>
              <Category
                name="기능구현"
                bgColor={category === "기능구현"}
                className="cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid view */}
      {slugs.length > 0 ? (
        <AnimatedGrid slugs={slugs} published={published} />
      ) : (
        <div className="py-20 text-center text-muted-foreground bg-card/50 rounded-xl border border-border/50">
          아직 등록된 글이 없습니다.
        </div>
      )}
    </div>
  );
}
