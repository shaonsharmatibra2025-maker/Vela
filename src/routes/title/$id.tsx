import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Play, Shuffle, Share2 } from "lucide-react";
import { Shell } from "@/components/chrome";
import { Poster } from "@/components/poster";
import { getMedia, inCatalog, randomMedia, recsFor } from "@/data/catalog";
import { episodeTitle, episodeTotal, formatLabel, ghostBtn, runLabel, seasonText, solidBtn, statusLabel } from "@/lib/format";
import { useLibrary } from "@/lib/library";
import { discoverSearch } from "@/lib/search";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/title/$id")({
  head: ({ params }) => {
    const media = getMedia(Number(params.id));
    return { meta: [{ title: media ? `${media.title} · Vela` : "Vela" }] };
  },
  component: TitlePage,
});

const TABS = ["Overview", "Episodes", "Trailer", "More like this"] as const;

function TitlePage() {
  const { id } = Route.useParams();
  const media = getMedia(Number(id));
  const navigate = useNavigate();
  const saved = useLibrary((s) => (media ? s.watchlist.includes(media.id) : false));
  const toggle = useLibrary((s) => s.toggleWatch);
  const progress = useLibrary((s) => (media ? s.progress[String(media.id)] : undefined));
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [copied, setCopied] = useState(false);

  if (!media) {
    return (
      <Shell>
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">That title is not on the shelf</h1>
          <Link to="/browse" className="mt-4 inline-flex text-sm text-accent">Back to browse</Link>
        </main>
      </Shell>
    );
  }

  const total = episodeTotal(media);
  const resume = progress?.episode ?? 1;
  const paras = media.synopsis.split(/\n+/).filter(Boolean);
  const more = recsFor(media);

  return (
    <Shell>
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <img src={media.banner || media.cover} alt="" className="h-full w-full scale-105 object-cover opacity-40 blur-md" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/70 to-bg" />
        </div>
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pt-12 pb-8 text-center">
          <div className="relative">
            <img src={media.cover} alt="" className="w-40 rounded-2xl border border-line object-cover shadow-2xl sm:w-48" />
            <button
              type="button"
              aria-label={saved ? "Remove from list" : "Follow"}
              onClick={() => toggle(media.id)}
              className="absolute -right-2 -bottom-2 grid size-11 place-items-center rounded-full border border-line bg-bg"
            >
              <Heart className={cn("size-5", saved ? "fill-accent text-accent" : "text-fg")} />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-micro text-muted">
            {media.score > 0 && <span className="rounded-full bg-surface px-2 py-1 text-accent tabular-nums">★ {media.score}%</span>}
            <span className="rounded-full bg-surface px-2 py-1">{media.year ?? "—"}</span>
            <span className="rounded-full bg-surface px-2 py-1">{formatLabel(media.format)}</span>
            <span className="rounded-full bg-surface px-2 py-1">{runLabel(media)}</span>
            <span className="rounded-full bg-surface px-2 py-1 tracking-wide uppercase">{statusLabel(media.status)}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">{media.title}</h1>
          {media.native && media.native !== media.title && <p className="mt-1 text-sm text-muted">{media.native}</p>}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {media.genres.map((g) => (
              <Link key={g} to="/discover" search={discoverSearch({ genre: g })} className="text-sm text-muted hover:text-fg">
                {g}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/watch/$id" params={{ id: String(media.id) }} search={{ ep: resume }} className={solidBtn}>
              <Play className="size-4" fill="currentColor" />
              {progress ? `Continue ${resume}` : media.kind === "MANGA" ? "Open" : "Watch"}
            </Link>
            <button type="button" className={ghostBtn} onClick={() => toggle(media.id)}>
              {saved ? "Following" : "Follow"}
            </button>
            <button
              type="button"
              className={ghostBtn}
              onClick={() => {
                const next = randomMedia(media.kind);
                if (next) void navigate({ to: "/title/$id", params: { id: String(next.id) } });
              }}
            >
              <Shuffle className="size-4" />
              Random
            </button>
            <button
              type="button"
              className={ghostBtn}
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href).then(() => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1600);
                });
              }}
            >
              <Share2 className="size-4" />
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 pb-12">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Details</h2>
            <p className="text-sm text-muted">More about {media.title}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-1 overflow-x-auto rounded-2xl border border-line bg-surface p-1">
          {TABS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setTab(name)}
              className={cn(
                "h-11 shrink-0 rounded-xl px-3 text-sm",
                tab === name ? "bg-raised text-fg" : "text-muted",
              )}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-line bg-surface p-4 sm:p-6">
          {tab === "Overview" && (
            <div>
              <div className="flex flex-wrap gap-2">
                {media.genres.map((g) => (
                  <Link key={g} to="/discover" search={discoverSearch({ genre: g })} className="rounded-full bg-raised px-3 py-1 text-micro text-fg">
                    {g}
                  </Link>
                ))}
              </div>
              {media.relations.length > 0 && (
                <div className="mt-6">
                  <p className="text-micro tracking-widest text-faint uppercase">Related</p>
                  <ul className="mt-2 divide-y divide-line">
                    {media.relations.map((rel) => (
                      <li key={`${rel.relation}-${rel.id}`} className="flex items-center justify-between gap-3 py-2">
                        {inCatalog(rel.id) ? (
                          <Link to="/title/$id" params={{ id: String(rel.id) }} className="text-sm hover:text-accent">
                            {rel.title}
                          </Link>
                        ) : (
                          <span className="text-sm text-muted">{rel.title}</span>
                        )}
                        <span className="shrink-0 rounded-md bg-raised px-2 py-1 text-micro tracking-wide text-accent uppercase">
                          {rel.relation.replaceAll("_", " ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Fact k="Format" v={formatLabel(media.format)} />
                <Fact k={media.kind === "MANGA" ? "Chapters" : "Episodes"} v={String(media.kind === "MANGA" ? media.chapters ?? total : media.episodes ?? total)} />
                <Fact k="Duration" v={media.duration ? `${media.duration} min` : "—"} />
                <Fact k="Score" v={media.score ? `${media.score}%` : "—"} />
                <Fact k="Status" v={statusLabel(media.status)} />
                <Fact k="Studio" v={media.studio ?? "—"} />
                <Fact k="Source" v={media.kind === "MANGA" ? "Manga" : "Catalog"} />
                <Fact k="Season" v={seasonText(media)} />
              </dl>
              <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted">
                {paras.length ? paras.map((p) => <p key={p.slice(0, 24)}>{p}</p>) : <p>No synopsis on file.</p>}
              </div>
              <p className="mt-4 text-micro text-faint">(Metadata: AniList)</p>
            </div>
          )}

          {tab === "Episodes" && (
            <EpisodeList id={media.id} total={total} kindLabel={media.kind === "MANGA" ? "Chapter" : "Episode"} titles={media} />
          )}

          {tab === "Trailer" &&
            (media.trailer ? (
              <div className="aspect-video overflow-hidden rounded-xl">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${media.trailer}?rel=0`}
                  title={`${media.title} trailer`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="text-sm text-muted">No official trailer is on file for this title.</p>
            ))}

          {tab === "More like this" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {more.map((item) => (
                <Poster key={item.id} media={item} />
              ))}
            </div>
          )}
        </div>
      </main>
    </Shell>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-micro tracking-widest text-faint uppercase">{k}</dt>
      <dd className="mt-1 text-sm font-medium">{v}</dd>
    </div>
  );
}

function EpisodeList({
  id,
  total,
  kindLabel,
  titles,
}: {
  id: number;
  total: number;
  kindLabel: string;
  titles: NonNullable<ReturnType<typeof getMedia>>;
}) {
  const size = 24;
  const [range, setRange] = useState(0);
  const pages = Math.max(1, Math.ceil(total / size));
  const start = range * size;
  const count = Math.min(size, total - start);
  return (
    <div>
      {pages > 1 && (
        <label className="mb-3 flex items-center gap-2 text-sm text-muted">
          Range
          <select
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className="h-11 rounded-xl border border-line bg-bg px-3 text-fg"
          >
            {Array.from({ length: pages }, (_, i) => (
              <option key={i} value={i}>
                {i * size + 1}–{Math.min(total, (i + 1) * size)}
              </option>
            ))}
          </select>
        </label>
      )}
      <ul className="divide-y divide-line">
        {Array.from({ length: count }, (_, i) => {
          const n = start + i + 1;
          return (
            <li key={n}>
              <Link to="/watch/$id" params={{ id: String(id) }} search={{ ep: n }} className="flex items-center justify-between gap-3 py-3 text-sm hover:text-accent">
                <span>
                  {kindLabel} {n}
                  <span className="mt-0.5 block text-micro text-muted">{episodeTitle(titles, n)}</span>
                </span>
                <Play className="size-4 shrink-0" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

