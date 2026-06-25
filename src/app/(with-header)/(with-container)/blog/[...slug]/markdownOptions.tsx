import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { DemoEmbed } from "./DemoEmbed";
import { DemoCard } from "./DemoCard";
import { rehypeDemo } from "./markdownDemo";

export const mdCustomStyle = {
  h1: ({ ...props }) => {
    const text = props.children?.toString() || "";
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    return (
      <h1
        id={id}
        className="text-3xl mb-10 mt-12 first:mt-0 font-semibold
        before:content-['📌'] 
        before:mr-2 
        before:not-italic
        befor:text-3xl
        "
        {...props}
      />
    );
  },
  h2: ({ ...props }) => {
    const text = props.children?.toString() || "";
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    return (
      <h2
        id={id}
        className="text-2xl mb-10 mt-10 first:mt-0 pb-3 border-b-2 border-primary/20 font-semibold"
        {...props}
      />
    );
  },
  h3: ({ ...props }) => {
    const text = props.children?.toString() || "";
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    return <h3 id={id} className="text-xl mb-4 mt-10 font-bold" {...props} />;
  },
  p: ({ ...props }) => (
    <p
      className="text-lg mb-4 last:mb-0 leading-relaxed text-foreground/90"
      {...props}
    />
  ),
  ul: ({ ...props }) => (
    <ul
      className="list-none space-y-2 mb-4 ml-6 [&>li]:pl-4 [&>li]:before:content-[''] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.6em] [&>li]:before:w-1.5 [&>li]:before:h-1.5 [&>li]:before:bg-primary/60 [&>li]:before:rounded-full"
      {...props}
    />
  ),
  ol: ({ ...props }) => (
    <ol className="list-decimal space-y-2 mb-4 ml-6 [&>li]:pl-2" {...props} />
  ),
  li: ({ ...props }) => <li className="text-lg relative" {...props} />,
  // code: ({
  //   className,
  //   children,
  //   ...props
  // }: {
  //   className: string;
  //   children: any;
  //   props: any;
  // }) => {
  //   const match = /language-(\w+)/.exec(className || "");
  //   return match ? (
  //     <code
  //       className={`${className} block bg-slate-900 text-slate-100 rounded-lg p-4 mb-4 text-sm`}
  //       {...props}
  //     >
  //       {children}
  //     </code>
  //   ) : (
  //     <code
  //       className="bg-accent/30 text-primary px-1.5 py-0.5 rounded text-sm"
  //       {...props}
  //     >
  //       {children}
  //     </code>
  //   );
  // },
  // pre: ({ ...props }) => (
  //   <pre
  //     className="mb-4 rounded-lg whitespace-pre-wrap w-full overflow-x-auto"
  //     style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
  //     {...props}
  //   />
  // ),
  blockquote: ({ ...props }) => (
    <blockquote
      className="border-l-4 border-primary/60 bg-accent/30 px-4 py-3 mb-8 italic 
      [&_p]:before:content-['💡'] 
      [&_p]:before:mr-2 
      [&_p]:before:not-italic
      [&_p]:text-base
      "
      {...props}
    />
  ),
  strong: ({ ...props }) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  a: ({ ...props }) => (
    <a
      className="underline underline-offset-4 text-primary mr-2
      after:content-['↗']
      after:text-[0.8em]"
      target="_blank"
      {...props}
    />
  ),
  // GFM 표 — 넓은 표는 가로 스크롤로 감싸 본문이 안 깨지게
  table: ({ ...props }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: ({ ...props }) => <thead className="bg-accent/30" {...props} />,
  th: ({ ...props }) => (
    <th
      className="border border-sidebar-border px-3 py-2 text-left font-semibold text-foreground"
      {...props}
    />
  ),
  td: ({ ...props }) => (
    <td
      className="border border-sidebar-border px-3 py-2 align-top text-foreground/90"
      {...props}
    />
  ),
  // ```demo 펜스 마커 → same-origin iframe (markdownDemo.tsx 참고)
  "demo-embed": DemoEmbed,
  // ```demo-card 펜스 마커 → 런타임/서버 데모 카드
  "demo-card": DemoCard,
};

export const mdCustomOption = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkBreaks],
    rehypePlugins: [
      // rehypeDemo는 rehypePrism보다 먼저 — language-demo 블록을 먼저 치환해
      // 미등록 언어 "demo"를 prism이 만나지 않게 한다.
      rehypeDemo,
      rehypeSlug,
      [rehypePrism, { showLineNumbers: true }],
    ] as any,
    format: "md" as const,
  },
};
