import { visit } from "unist-util-visit";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

// ─── 데모 마커 → 엘리먼트/코드 치환 (rehype 플러그인, 서버 전용) ──────────
// 글 본문의 펜스 마커를 처리한다. format: "md" 유지(MDX 전환 없음 → 기존 글
// 영향 0). rehypePrism보다 먼저 실행해 미등록 언어를 prism이 만나지 않게 한다.
//
//   ```demo            → <demo-embed>  : 라이브 same-origin iframe (DemoEmbed)
//   ```demo-card       → <demo-card>   : 런타임/서버 데모 카드 (DemoCard)
//   ```src             → 실제 데모 파일을 읽어 코드블록으로 인라인(SSOT)
//   id: react-counter            blog/public/demos/<id>/_src/<file> 를 읽어
//   file: src/main.jsx           코드 노드에 채우고 언어를 확장자로 지정 →
//   lines: 12-30 (선택)          기존 rehype-prism이 그대로 하이라이트.

const FENCES: Record<string, string> = {
  demo: "demo-embed",
  "demo-card": "demo-card",
};

const EXT_LANG: Record<string, string> = {
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  css: "css",
  scss: "scss",
  html: "markup",
  htm: "markup",
  json: "json",
  md: "markdown",
  sh: "bash",
  bash: "bash",
  py: "python",
  go: "go",
  rs: "rust",
  java: "java",
  yml: "yaml",
  yaml: "yaml",
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

function fenceLang(code: HastNode): string | null {
  const cls = code.properties?.className;
  if (!Array.isArray(cls)) return null;
  const hit = (cls as unknown[]).find(
    (c) => typeof c === "string" && c.startsWith("language-"),
  ) as string | undefined;
  return hit ? hit.slice("language-".length) : null;
}

function parseBody(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([a-zA-Z][\w-]*)\s*:\s*(.+?)\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

// ```src 마커 → 복사된 실제 데모 파일 내용 + prism 언어. 파일 없으면 안내문구.
function loadSnippet(props: Record<string, string>): {
  text: string;
  lang: string | null;
} {
  const { id, file, lines } = props;
  if (!id || !file || file.includes("..")) {
    return { text: `// src 마커 오류: id/file 누락 또는 잘못된 경로`, lang: null };
  }
  const abs = path.join(process.cwd(), "public", "demos", id, "_src", file);
  if (!existsSync(abs)) {
    return {
      text: `// 데모 소스 없음: ${id}/${file}\n// demo/에서 pnpm build 후 다시 시도하세요.`,
      lang: null,
    };
  }
  let text = readFileSync(abs, "utf-8").replace(/\n+$/, "");
  const m = lines?.match(/^(\d+)-(\d+)$/);
  if (m) {
    text = text
      .split("\n")
      .slice(Number(m[1]) - 1, Number(m[2]))
      .join("\n");
  }
  const ext = file.split(".").pop()?.toLowerCase() ?? "";
  return { text, lang: EXT_LANG[ext] ?? null };
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
        if (!lang) return;

        // ```src — pre/code를 유지하되 내용을 실제 파일로 교체 → prism이 하이라이트
        if (lang === "src") {
          const { text, lang: codeLang } = loadSnippet(parseBody(getText(code)));
          code.properties = {
            className: codeLang ? [`language-${codeLang}`] : [],
          };
          code.children = [{ type: "text", value: text }];
          return;
        }

        // ```demo / ```demo-card — 커스텀 엘리먼트로 치환
        const tagName = FENCES[lang];
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
