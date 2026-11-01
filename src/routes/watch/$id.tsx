import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Shell, Score } from "@/components/chrome";
import { Comments } from "@/components/comments";
import { Theater } from "@/components/player";
import { Poster } from "@/components/poster";
import { getMedia, inCatalog, recsFor } from "@/data/catalog";
import { episodeThumb, episodeTitle, episodeTotal, formatLabel, statusLabel } from "@/lib/format";
import { resolvePlayback } from "@/lib/playback";
import { readWatchSearch } from "@/lib/search";
import { useLibrary } from "@/lib/library";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/watch/$id")({
  validateSearch: (search) => readWatchSearch(search as Record<string, unknown>),
  head: ({ params }) => {
    const media = getMedia(Number(params.id));
    return { meta: [{ title: media ? `${media.title} · Vela` : "Watch · Vela" }] };
  },
  component: WatchPage,
});

function sourceLine(media: NonNullable<ReturnType<typeof getMedia>>, episode: number) {
  const play = resolvePlayback(media, episode);
  if (play.type === "youtube") return "Source · YouTube";
  if (play.type === "file") return "Source · Video file";
  if (play.type === "image") return "Source · Still";
  if (play.type === "iframe") return "Source · Embed";
  return "No playable source on this episode";
}

function WatchPage() {
  const { id } = Route.useParams();
  const { ep } = Route.useSearch();
  const navigate = useNavigate();
  const media = getMedia(Number(id));
  const mark = useLibrary((s) => s.markProgress);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    if (!media) return;
    const current = media;
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) return;
      const total = episodeTotal(current);
      if (e.key === "ArrowRight" && ep < total) {
        void navigate({ to: "/watch/$id", params: { id: String(current.id) }, search: { ep: ep + 1 } });
      }
      if (e.key === "ArrowLeft" && ep > 1) {
        void navigate({ to: "/watch/$id", params: { id: String(current.id) }, search: { ep: ep - 1 } });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [media, ep, navigate]);

  if (!media) {
    return (
      <Shell>
        <main className="px-4 py-24 text-center">
          <h1 className="text-2xl font-semibold">This title is not on the shelf</h1>
          <Link to="/browse" className="mt-3 inline-flex text-sm text-accent">Back</Link>
        </main>
      </Shell>
    );
  }

  const total = episodeTotal(media);
  const safeEp = Math.min(Math.max(1, ep), total);
  const label = media.kind === "MANGA" ? "Chapter" : "Episode";
  const sequel = media.relations.find((r) => r.relation === "SEQUEL" || r.relation === "SIDE_STORY");
  const more = recsFor(media).slice(0, 10);
  const size = 30;
  const page = Math.floor((safeEp - 1) / size);
  const start = page * size;
  const count = Math.min(size, total - start);

  return (
    <Shell>
      <main className="mx-auto max-w-screen-2xl px-4 py-4">
        <Link to="/title/$id" params={{ id: String(media.id) }} className="inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-fg">
          <ArrowLeft className="size-4" />
          Back to series
        </Link>
        <div className={cn("mt-2 grid grid-cols-1 items-start gap-4", !focus && "lg:grid-cols-[minmax(0,1fr)_22rem]")}>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{media.title}</h1>
            <p className="mt-1 text-sm text-muted">
              {label} {safeEp} · {episodeTitle(media, safeEp)}
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-micro text-muted">
              <span>{formatLabel(media.format)}</span>
              <span>{media.year ?? "—"}</span>
              {media.score > 0 && <Score value={media.score} />}
              {media.genres.slice(0, 3).map((g) => (
                <span key={g}>{g}</span>
              ))}
            </p>
            <div className="mt-4">
              <Theater media={media} episode={safeEp} onPlay={() => mark(media.id, safeEp)} />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
              <p>{sourceLine(media, safeEp)}</p>
              <div className="flex gap-2">
                {safeEp < total && (
                  <Link to="/watch/$id" params={{ id: String(media.id) }} search={{ ep: safeEp + 1 }} className="inline-flex h-11 items-center rounded-full border border-line px-3 text-fg">
                    Next {label.toLowerCase()}
                  </Link>
                )}
                <button type="button" className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-3 font-semibold text-accent-ink" onClick={() => mark(media.id, safeEp)}>
                  <Check className="size-4" />
                  Mark logged
                </button>
                <button type="button" className="inline-flex h-11 items-center rounded-full border border-line px-3 text-fg" onClick={() => setFocus((v) => !v)}>
                  {focus ? "Show shelf" : "Focus"}
                </button>
              </div>
            </div>

            {sequel && (
              <div className="mt-4">
                {inCatalog(sequel.id) ? (
                  <Link to="/title/$id" params={{ id: String(sequel.id) }} className="flex min-w-0 items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                    <span className="shrink-0 text-micro tracking-widest text-faint uppercase">{sequel.relation.replaceAll("_", " ")}</span>
                    <span className="min-w-0 truncate font-medium">{sequel.title}</span>
                  </Link>
                ) : (
                  <p className="rounded-2xl border border-line bg-surface p-3 text-sm text-muted">
                    {sequel.relation.replaceAll("_", " ")} · {sequel.title}
                  </p>
                )}
              </div>
            )}

            {!focus && (
            <>
            <section className="mt-8">
              <h2 className="text-sm font-semibold tracking-widest text-faint uppercase">Recommended</h2>
              <div className="scroller mt-3 flex w-full min-w-0 gap-3 overflow-x-auto">
                {more.map((item) => (
                  <div key={item.id} className="w-32 shrink-0">
                    <Poster media={item} />
                  </div>
                ))}
              </div>
            </section>
            <Comments mediaId={media.id} episode={safeEp} />
            </>
            )}
          </div>

          {!focus && (
          <aside className="min-w-0 rounded-2xl border border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line px-3 py-3">
              <h2 className="text-sm font-semibold">{label}s</h2>
              <span className="text-micro text-muted">{statusLabel(media.status)} · {total}</span>
            </div>
            {total > size && (
              <label className="flex items-center gap-2 px-3 pt-3 text-micro text-muted">
                Jump
                <select
                  value={page}
                  onChange={(e) => {
                    const next = Number(e.target.value) * size + 1;
                    void navigate({ to: "/watch/$id", params: { id: String(media.id) }, search: { ep: next } });
                  }}
                  className="h-11 flex-1 rounded-xl border border-line bg-bg px-2 text-sm text-fg"
                >
                  {Array.from({ length: Math.ceil(total / size) }, (_, i) => (
                    <option key={i} value={i}>
                      {i * size + 1}–{Math.min(total, (i + 1) * size)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <ul className="max-h-[70vh] overflow-y-auto p-2">
              {Array.from({ length: count }, (_, i) => {
                const n = start + i + 1;
                const on = n === safeEp;
                return (
                  <li key={n}>
                    <Link
                      to="/watch/$id"
                      params={{ id: String(media.id) }}
                      search={{ ep: n }}
                      className={cn("flex gap-3 rounded-xl p-2", on ? "bg-raised" : "hover:bg-bg")}
                    >
                      <img src={episodeThumb(media, n)} alt="" className="h-14 w-24 rounded-lg object-cover" />
                      <span className="min-w-0">
                        <span className={cn("block text-sm font-medium", on && "text-accent")}>
                          {label} {n}
                        </span>
                        <span className="line-clamp-2 text-micro text-muted">{episodeTitle(media, n)}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
          )}
        </div>
      </main>
    </Shell>
  );
}
