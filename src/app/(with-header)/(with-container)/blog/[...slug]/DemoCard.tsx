// ```demo-card 마커가 렌더하는 카드 (서버 컴포넌트 — 훅 없음).
// 라이브 iframe으로 띄울 수 없는 "런타임/서버 데모"(Next.js·Express·Django·
// Docker 등)를 코드 repo 링크 + 재현 명령으로 안내한다. 스택은 tech 필드로
// 구분하므로 스택이 늘어도 마커/컴포넌트 변경이 필요 없다.
// 스크린샷은 본문 일반 이미지가 담당(여기서 다루지 않음).

const DEFAULT_NOTE =
  "⚡ 서버 런타임이 필요해 라이브 임베드 대신 코드로 제공합니다.";

export function DemoCard({
  title,
  tech,
  repo,
  run,
  note,
}: {
  title?: string;
  tech?: string;
  repo?: string;
  run?: string;
  note?: string;
}) {
  return (
    <div className="my-10 overflow-hidden rounded-md border border-sidebar-border bg-accent/20">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-sidebar-border">
        {tech && (
          <span className="rounded bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
            {tech}
          </span>
        )}
        <span className="font-semibold text-foreground">
          {title || "런타임 데모"}
        </span>
      </div>

      <div className="flex flex-col gap-3 px-4 py-3 text-sm">
        <p className="text-muted-foreground">{note || DEFAULT_NOTE}</p>

        {repo && (
          <a
            href={repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-1 rounded-md bg-primary px-3 py-1.5 font-medium text-white no-underline"
          >
            코드 보기 ↗
          </a>
        )}

        {run && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">재현</span>
            <pre className="overflow-x-auto rounded-md bg-slate-900 px-3 py-2 text-xs text-slate-100">
              <code>{run}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
