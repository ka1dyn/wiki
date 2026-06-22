import { visit } from "unist-util-visit";

// ─── 데모 마커 → <demo-embed> 치환 (rehype 플러그인) ─────────────────
// 글 본문의 ```demo 펜스 블록을 <demo-embed> 엘리먼트로 바꾼다. format: "md"
// 유지(MDX 전환 없음 → 기존 글 영향 0). 글과 데모는 id로만 연결된다.
//
//   ```demo
//   id: hello-box
//   height: 420
//   ```
//
// rehypePrism보다 먼저 실행해 미등록 언어 "demo"를 prism이 만나지 않게 한다.
// 실제 렌더(iframe)는 components 맵의 "demo-embed" → DemoEmbed(client)가 담당.

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

function hasDemoClass(code: HastNode): boolean {
  const cls = code.properties?.className;
  return Array.isArray(cls) && (cls as unknown[]).includes("language-demo");
}

function parseDemoBody(raw: string): { id?: string; height?: string } {
  const out: { id?: string; height?: string } = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([a-zA-Z]+)\s*:\s*(.+?)\s*$/);
    if (!m) continue;
    const [, key, val] = m;
    if (key === "id") out.id = val;
    else if (key === "height") out.height = val;
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
        if (!code || !hasDemoClass(code)) return;

        const { id, height } = parseDemoBody(getText(code));
        parent.children![index] = {
          type: "element",
          tagName: "demo-embed",
          properties: { id, height },
          children: [],
        };
      },
    );
  };
}
