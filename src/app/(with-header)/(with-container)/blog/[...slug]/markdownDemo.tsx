import { visit } from "unist-util-visit";

// ─── 데모 마커 → same-origin iframe ────────────────────────────────
// 글 본문의 ```demo 펜스 블록을 iframe으로 치환한다. format: "md" 유지
// (MDX 전환 없음 → 기존 글 영향 0). 글과 데모는 id로만 연결된다.
//
//   ```demo
//   id: hello-box
//   height: 420
//   ```
//
// 동작: rehypeDemo 플러그인이 <pre><code class="language-demo">를
// <demo-embed> 엘리먼트로 바꾼다(rehypePrism보다 먼저 실행 → 미등록 언어
// "demo"를 prism이 만나지 않게). components 맵의 "demo-embed"가 렌더한다.

// 헷지 원칙 ①: 데모 base URL은 변수 하나. 추후 외부 호스트로 전환해도 여기만.
const DEMO_BASE = process.env.NEXT_PUBLIC_DEMO_BASE ?? "/demos";
const DEFAULT_HEIGHT = 480;

export function DemoEmbed({
  id,
  height,
}: {
  id?: string;
  height?: string | number;
}) {
  if (!id) {
    return (
      <div className="my-8 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        ⚠️ demo 마커에 id가 없습니다.
      </div>
    );
  }

  const h = Number(height) || DEFAULT_HEIGHT;

  return (
    // 넉넉한 여백/큰 stage — glow·그림자 잘림 방지 (설계 결정 C)
    <div className="my-10 flex justify-center">
      <iframe
        // Next의 public 서빙은 디렉토리 경로를 index.html로 해석하지 않으므로 명시.
        // (DEMO_BASE만 바꾸면 외부 호스트로 전환 가능 — 헷지 원칙 ① 유지)
        src={`${DEMO_BASE}/${id}/index.html`}
        title={`demo: ${id}`}
        loading="lazy"
        className="w-full rounded-md border border-sidebar-border bg-white"
        style={{ height: `${h}px` }}
        data-demo-id={id}
      />
    </div>
  );
}

// ─── rehype 플러그인 ────────────────────────────────────────────────
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
    visit(tree as never, "element", (node: HastNode, index, parent: HastNode) => {
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
    });
  };
}
