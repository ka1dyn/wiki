import { MDXRemote } from "next-mdx-remote-client/rsc";
import BreadCrumbUpdater from "@/components/BreadCrumbUpdater";
import { mdCustomOption, mdCustomStyle } from "./markdownOptions";
import { Calendar, FolderOpen, List, Tag } from "lucide-react";
import { dateFormat, getTocData, replaceSrc } from "@/lib/utils";
import Category from "@/components/Category";
import PageTocItem from "@/components/PageTocItem";
import React from "react";
import SideToc from "@/components/SideToc";
import { getDailyPosts, getPosts } from "@/lib/posts";
// import BreadCrumbRenderer from "@/components/BreadCrumbRenderer";

export async function generateStaticParams() {
  const posts = getPosts();
  const { dailySortedSlugs } = getDailyPosts();
  const slugs = [...Object.keys(posts), ...dailySortedSlugs];

  return slugs.map((slug) => {
    const slugPieces = slug
      .replace(".md", "")
      .split("/")
      .filter((el) => Boolean(el));

    return {
      slug: slugPieces,
    };
  });
}

export const dynamicParams = false;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const posts = getPosts();
  const { dailyPosts, dailySortedSlugs } = getDailyPosts();

  const decodedSlug = slug.map((segment) => decodeURIComponent(segment));
  const path = `/${decodedSlug.join("/")}`;

  const { content, front } = path in posts ? posts[path] : dailyPosts[path];
  const { title, date, category, lock } = front;

  const tocData = getTocData(content);
  const dateKR = dateFormat(new Date(date));

  const mdxComponents = {
    img: (props: any) => {
      const { src, alt } = props;
      // Image path change
      const publicSrc = replaceSrc(src);

      return <img src={publicSrc} alt={alt || "no image"} />;
    },
    ...mdCustomStyle,
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <BreadCrumbUpdater path={path} />

      <div className="absolute h-full top-0 right-30 max-w-[250px] min-[1800px]:max-w-[300px] break-all translate-x-full hidden 2xl:block">
        <SideToc tocData={tocData} />
      </div>

      <div className="w-full max-w-[90ch] text-foreground flex flex-col gap-10">
        <div
          className="w-full flex flex-col px-3 py-6 sm:p-8 pb-5 bg-card gap-5 sm:gap-10 rounded-md"
          style={{
            boxShadow: "var(--paper-shadow)",
          }}
        >
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-semibold mb-5">{title}</h1>
            <div className="flex flex-col gap-3">
              <div className="flex gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <Category
                    name={category}
                    className="text-sm py-0.5 px-1.5"
                    disabled={true}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{dateKR}</span>
                </div>
              </div>
              <div className="text-base flex gap-2 items-center pl-0.5">
                <FolderOpen className="w-4 h-4 text-primary/70 translate-y-px" />
                <span className="text-muted-foreground/70 text-sm">
                  {path.replace("/blog", "")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <div className="px-2 py-2 flex items-center gap-2">
              <List className="w-5 h-5 text-primary" />
              <span className="text-md font-semibold text-foreground">
                목차
              </span>
            </div>
            <div
              id="toc"
              className="flex flex-col max-h-[500px] overflow-auto border-y border-sidebar-border"
            >
              {tocData.map((data) => {
                const { orderTxt, depth, text } = data;

                return (
                  <React.Fragment key={text}>
                    <PageTocItem
                      depth={depth}
                      text={text}
                      orderTxt={orderTxt}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="w-full px-2 py-6 sm:p-8 bg-card gap-10 rounded-md font-pretendard text-sm sm:text-base"
          style={{
            boxShadow: "var(--paper-shadow)",
          }}
        >
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={mdCustomOption}
          />
        </div>

        {/*
          스크롤 스파이 하단 여유(스페이서).
          글 끝 헤딩(들)은 그 아래 컨텐츠가 짧으면 상단까지 스크롤될 수 없어,
          사이드 TOC 하이라이트가 안 켜지고 클릭해도 상단에 고정되지 않는다.
          아래에 스크롤 거리를 더 확보해 마지막 헤딩까지 정상 동작하게 한다.

          값 튜닝: 마지막 헤딩이 착지 지점(TOC_SCROLL_OFFSET=100px)까지 오르려면
          이론상 ≈ (100vh − 100px − 마지막헤딩_아래_컨텐츠높이)가 필요하다.
          마지막 헤딩까지 확실히 고정하려면 100vh 근처로 올리고, 빈 공간이
          거슬리면 낮춘다(그만큼 맨 끝 헤딩 고정이 느슨해짐).
          TODO: 빈 공간이므로 추후 추천글/관련글/댓글 등 실제 컨텐츠로 교체.
        */}
        <div aria-hidden className="h-[30vh]" />
      </div>
    </div>
  );
}
