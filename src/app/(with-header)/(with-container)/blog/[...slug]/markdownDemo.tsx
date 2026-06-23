import { visit } from "unist-util-visit";

// ─── 데모 마커 → 엘리먼트 치환 (rehype 플러그인) ─────────────────────
// 글 본문의 펜스 마커를 커스텀 엘리먼트로 바꾼다. format: "md" 유지
// (MDX 전환 없음 → 기존 글 영향 0). rehypePrism보다 먼저 실행해 미등록
// 언어(demo/demo-card)를 prism이 만나지 않게 한다.
//
//   ```demo            → <demo-embed>  : 라이브 same-origin iframe (DemoEmbed)
//   id: hello-box
//   height: 420
//   ```
//
//   ```demo-card       → <demo-card>   : 런타임/서버 데모 카드 (DemoCard)
//   title: ...
//   tech: Next.js
//   repo: https://...
//   run: npx degit ...
//   ```
//
// 실제 렌더는 components 맵의 "demo-embed"/"demo-card"가 담당.

const FENCES: Record<string, string> = {
  demo: "demo-embed",
  "demo-card": "demo-card",
};

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function getText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  if (node.children) return node.children.map(getText).join("");
  return "";
}

// code 엘리먼트의 펜스 언어("demo"/"demo-card"/…)를 반환.
function fenceLang(code: HastNode): string | null {
  const cls = code.properties?.className;
  if (!Array.isArray(cls)) return null;
  const hit = (cls as unknown[]).find(
    (c) => typeof c === "string" && c.startsWith("language-"),
  ) as string | undefined;
  return hit ? hit.slice("language-".length) : null;
}

// 마커 본문을 범용 key:value로 파싱(값에 URL의 `https://`도 그대로 포함).
function parseBody(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([a-zA-Z][\w-]*)\s*:\s*(.+?)\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

export function rehypeDemo() {
  return (tree: HastNode) => {
    visit(
      tree as never,
      "element",
      (node: HastNode, index, parent: HastNode) => {
        if (node.tagName !== "pre" || index == null || !parent) return;
        const code = node.children?.find(
          (c) => c.type === "element" && c.tagName === "code",
        );
        if (!code) return;

        const lang = fenceLang(code);
        const tagName = lang ? FENCES[lang] : undefined;
        if (!tagName) return;

        parent.children![index] = {
          type: "element",
          tagName,
          properties: parseBody(getText(code)),
          children: [],
        };
      },
    );
  };
}
