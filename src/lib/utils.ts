import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateFormat(date: Date) {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const getTocData = (source: string) => {
  let isCodeBlock = false;

  // Check code block
  const headings = source.split("\n").filter((str) => {
    const trimmedStr = str.trim();

    if (trimmedStr.startsWith("```")) {
      isCodeBlock = !isCodeBlock;
      return false;
    }

    return !isCodeBlock && str.match(/^#+/);
  });

  const orderCntArr = [0, 0, 0, 0];

  return headings.map((str) => {
    const match = str.match(/^#+/) as RegExpMatchArray;

    const depth = match[0].length || 0;
    orderCntArr[depth] += 1;
    const headingText = str.replace(/^#+/, "").trim();

    let orderTxt = "";
    if (depth === 1) {
      orderCntArr[2] = 0;
      orderCntArr[3] = 0;
      orderTxt = `${orderCntArr[1]}. `;
    } else if (depth === 2) {
      orderCntArr[3] = 0;
      orderTxt = `${orderCntArr[1]}.${orderCntArr[2]}. `;
    } else if (depth === 3) {
      orderTxt = `${orderCntArr[1]}.${orderCntArr[2]}.${orderCntArr[3]}. `;
    }

    return { orderTxt: orderTxt, depth: depth, text: headingText };
  });
};

export const generateTree = (posts: PostData) => {
  const tree: TreeObj = {
    name: "root",
    count: 0,
    children: {},
    isLeaf: false,
  };

  let slugs = Object.keys(posts);

  slugs.forEach((slug) => {
    const segments = slug.split("/").filter((segment) => Boolean(segment));

    let curObj = tree;
    curObj.count += 1;

    segments.forEach((segment, idx) => {
      if (!curObj.children[segment]) {
        curObj.children[segment] = {
          name: segment,
          count: 0,
          children: {},
          isLeaf: false,
        };
      }

      if (idx === segments.length - 1) {
        curObj.children[segment].isLeaf = true;
        curObj.children[segment].path = slug;
        curObj.children[segment].createdDate = posts[slug].front.date;
        curObj.children[segment].isPublish = posts[slug].front.isPublish;
      }

      curObj.children[segment].count += 1;
      curObj = curObj.children[segment];
    });
  });

  return tree;
};

export const replaceSrc = (src: string) => {
  let publicSrc = src;
  if (src.startsWith("images/")) {
    publicSrc = `/content-${src}`;
  } else if (src.includes("images/")) {
    const fileName = src.split("images/").pop();
    publicSrc = `/content-images/${fileName}`;
  } else {
    publicSrc = `/content-images/${src}`;
  }

  return publicSrc;
};

// 헤딩 스크롤 기준 오프셋: sticky 헤더(h-20 = 80px) + 여유 20px.
// 클릭 시 헤딩이 헤더 바로 아래에 오고, TOC 하이라이트도 같은 지점에서 활성화된다.
export const TOC_SCROLL_OFFSET = 100;

// 헤딩이 헤더 아래(TOC_SCROLL_OFFSET 지점)에 오도록 하는 문서 기준 스크롤 위치.
// 정수로 반올림해 subpixel 오차를 제거한다 — 클릭 착지(scrollTo)와 하이라이트
// breakpoint가 이 하나의 공식을 공유하므로, 별도 허용 오차(epsilon) 없이 일치한다.
export const getHeadingScrollTop = (el: Element): number =>
  Math.round(el.getBoundingClientRect().top + window.scrollY) -
  TOC_SCROLL_OFFSET;

export const textToId = (text: string) => {
  return (
    text
      .toString() // 1. 문자열로 변환
      .toLowerCase() // 2. 소문자로 변환
      .trim() // 3. 앞뒤 공백 제거
      .replace(/\s+/g, "-") // 4. 공백을 -로 교체
      .replace(/[^\w\-가-힣]+/g, "") // 5. 알파벳, 숫자, 대시, 한글 외 특수문자 제거
      // .replace(/\-\-+/g, "-") // 6. 연속된 대시(--)를 하나로 축소 -> deprecated
      .replace(/^-+/, "") // 7. 시작 부분 대시 제거
      .replace(/-+$/, "")
  ); // 8. 끝 부분 대시 제거
};
