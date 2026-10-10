import BreadCrumbUpdater from "@/components/BreadCrumbUpdater";
import HomeCards from "./HomeCards";
import { getAllSeries, getPublishedPosts } from "@/lib/posts";
import { cn, dateFormat } from "@/lib/utils";
import Link from "next/link";
import HeroBackground from "@/components/HeroBackground";
import TextType from "@/components/TextType";
import { Star } from "lucide-react";

export default function Page() {
  const { published, sortedSlugs } = getPublishedPosts();
  const seriesInfo = getAllSeries();

  const totalCount = sortedSlugs.length;
  const recentDate =
    sortedSlugs.length > 0
      ? dateFormat(new Date(published[sortedSlugs[0]].front.date))
      : "-";
  const seriesCount = Object.keys(seriesInfo).length - 1;

  const recentSlugs = sortedSlugs.slice(0, 3);
  const recommendedSlugs = sortedSlugs.filter(
    (s) => published[s].front.recommended,
  );

  return (
    <div className="flex flex-col flex-1 items-center">
      <BreadCrumbUpdater path={"/"} />

      {/* Hero section */}
      <section className="relative flex justify-center items-center bg-background-dark w-full mb-20 py-16 h-[calc(100vh-80px)] max-h-[1100px] overflow-hidden">
        <HeroBackground />
        <div className="relative w-full max-w-6xl min-w-0 h-100 flex flex-col  md:flex-row md:items-center justify-between gap-10 mt-5 px-6">
          {/* Left section */}
          <div className="w-full md:w-80 flex flex-col h-full md:shrink-0">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <h1 className="text-4xl font-bold tracking-tight text-[#f5f1e8]">
                  Kaidyn Wiki
                </h1>
                <p className="text-[#f5f1e8]/70 text-lg max-w-sm">
                  개발하며 배운 것들을 기록합니다
                </p>
              </div>
              <Link
                href="/blog/published"
                className="relative w-fit flex gap-1 bg-primary/30 text-[#f5f1e8] transition-all duration-200 ease-out hover:bg-primary hover:text-white border border-primary/20 px-4 py-2 rounded-lg font-medium z-30"
              >
                글 목록 보기 →
              </Link>
            </div>

            <div className="absolute hidden md:flex bottom-0 gap-3 text-sm items-center font-light justify-center md:justify-start translate-x-1 text-[#f5f1e8]/80">
              <span>
                글 <span className="font-bold">{totalCount}편</span>
              </span>
              <div className="h-4 w-px bg-[#f5f1e8]/30" />
              <span>
                <span className="font-bold">{seriesCount}</span>개 모음집
              </span>
              <div className="h-4 w-px bg-[#f5f1e8]/30" />
              <span>업데이트: {recentDate}</span>
            </div>
          </div>

          {/* Right section */}
          <div className="relative flex flex-col justify-between w-full max-w-150 h-full md:flex md:items-start">
            <div className="hidden md:flex w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-mono text-xs text-[#f5f1e8]/70 leading-relaxed backdrop-blur-md">
              <div className="leading-7">
                <TextType
                  text={[
                    'const blog = { \n  author: "ka1dyn", \n  focus: "Frontend", \n  github: "https://github.com/ka1dyn", \n  portfolio: "https://test.com", \n};',
                  ]}
                  typingSpeed={40}
                  showCursor
                  cursorCharacter="_"
                  cursorBlinkDuration={0.5}
                  loop={false}
                />
              </div>
            </div>

            <div className="w-full h-fit md:absolute md:top-[calc(100%-60px)] flex flex-col gap-6 items-start">
              <div
                className={cn(
                  "flex items-center gap-3 text-[#f5f1e8]/40 text-xs font-medium uppercase tracking-[0.2em]",
                  "animate-slide-in-left opacity-0",
                )}
              >
                <div className="h-px w-8 bg-primary/30" />
                tech stack series
              </div>
              <div className="flex flex-wrap justify-start gap-2.5">
                {Object.entries(seriesInfo)
                  .filter(([key]) => key !== "전체")
                  .map(([key, value], index) => (
                    <Link
                      href={`/blog/published?series=${key}`}
                      key={key}
                      className={cn(
                        "px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[#f5f1e8]/80 text-sm hover:bg-primary/40 hover:text-white hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300 ease-out backdrop-blur-sm group",
                        "animate-slide-in-up opacity-0",
                        "cursor-pointer z-30",
                      )}
                      style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                    >
                      <span className="text-primary/60 group-hover:text-primary transition-colors mr-1">
                        #
                      </span>
                      {key}
                      <span className="ml-2 text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                        {value}편
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl min-w-0 flex flex-col gap-20 px-4 sm:px-8">
          {/* Recommended posts */}
          {recommendedSlugs.length > 0 && (
            <section className="flex flex-col gap-8 w-full">
              <div className="flex flex-col items-center gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-center md:text-start text-2xl font-semibold">
                    추천 글
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    꼭 한번 읽어보시길 추천하는 글이에요
                  </p>
                </div>
                <Link
                  href="/blog/published"
                  className="hidden md:block text-xs text-primary hover:underline underline-offset-4 decoration-accent transition-all"
                >
                  전체 글 보기 →
                </Link>
              </div>
              <div className="grid w-fit justify-center justify-items-center grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                <HomeCards
                  cards={recommendedSlugs.slice(0, 6).map((slug) => ({
                    slug,
                    thumbnail: published[slug].front.thumbnail,
                    title: published[slug].front.title,
                    date: published[slug].front.date,
                    category: published[slug].front.category,
                    lock: published[slug].front.lock,
                    description: published[slug].front.description,
                    content: published[slug].content,
                    recommended: published[slug].front.recommended,
                  }))}
                />
              </div>
            </section>
          )}

          {/* Recent Posts */}
          {recentSlugs.length > 0 && (
            <section className="flex flex-col gap-8 w-full">
              <div className="flex flex-col items-center gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-center md:text-start text-2xl font-semibold">
                    최신 글
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    서재에 새로 추가된 글이에요
                  </p>
                </div>
                <Link
                  href="/blog/published"
                  className="hidden md:block text-xs text-primary hover:underline underline-offset-4 decoration-accent transition-all"
                >
                  전체 글 보기 →
                </Link>
              </div>
              <div className="grid w-fit justify-center justify-items-center grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                <HomeCards
                  cards={recentSlugs.map((slug) => ({
                    slug,
                    thumbnail: published[slug].front.thumbnail,
                    title: published[slug].front.title,
                    date: published[slug].front.date,
                    category: published[slug].front.category,
                    lock: published[slug].front.lock,
                    description: published[slug].front.description,
                    content: published[slug].content,
                    recommended: published[slug].front.recommended,
                  }))}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
