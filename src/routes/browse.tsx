import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Shell, useKind } from "@/components/chrome";
import { Rail, Poster } from "@/components/poster";
import { RecentNotes } from "@/components/comments";
import { Ago, When } from "@/components/boot";
import {
  filterMedia,
  genreCounts,
  getDoc,
  getMedia,
  heroSlides,
  homeRows,
  randomMedia,
  schedule,
  sectionOn,
  topRated,
  type Media,
} from "@/data/catalog";
import { formatLabel, ghostBtn, runLabel, statusLabel, episodeTotal } from "@/lib/format";
import { useLibrary } from "@/lib/library";
import { discoverSearch } from "@/lib/search";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/browse")({
  head: () => ({ meta: [{ title: "Home · Vela" }] }),
  component: Browse,
});

function Browse() {
  const kind = useKind();
  const navigate = useNavigate();
  const slides = heroSlides(kind);
  const [index, setIndex] = useState(0);
  const [q, setQ] = useState("");
  const slide = slides[index % Math.max(slides.length, 1)];
  const rotate = getDoc().hero.rotate;
  const intervalMs = getDoc().hero.intervalMs || 7000;

  useEffect(() => {
    setIndex(0);
  }, [kind]);

  useEffect(() => {
    if (!rotate || slides.length < 2) return;
    const t = window.setInterval(() => setIndex((n) => (n + 1) % slides.length), intervalMs);
    return () => window.clearInterval(t);
  }, [slides.length, kind, rotate, intervalMs]);

  const hits = q.trim().length > 1 ? filterMedia({ kind, q, sort: "popular" }).slice(0, 6) : [];
  const progress = useLibrary((s) => s.progress);
  const watchlist = useLibrary((s) => s.watchlist);
  const dismissed = useLibrary((s) => s.dismissed);
  const dismiss = useLibrary((s) => s.dismiss);
  const continueItems = Object.entries(progress)
    .map(([id, p]) => ({ media: getMedia(Number(id)), episode: p.episode, at: p.at }))
    .filter((row): row is { media: Media; episode: number; at: number } => !!row.media && row.media.kind === kind)
    .sort((a, b) => b.at - a.at);
  const saved = watchlist.map((id) => getMedia(id)).filter((m): m is Media => !!m && m.kind === kind);
  const airing = schedule(kind).slice(0, 6);
  const top = topRated(kind, 8);
  const genres = genreCounts(kind);
  const commentIds = slides.slice(0, 8).map((m) => m.id);
  const rows = homeRows(kind);

  return (
    <Shell showSearch={false}>
      {sectionOn("hero") && slide && (
        <section className="relative min-h-[28rem]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img key={slide.id} src={slide.banner || slide.cover} alt="" className="hero-fade absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/30" />
          </div>
          <div className="relative z-10 mx-auto flex min-h-[28rem] max-w-3xl flex-col items-center justify-end px-4 pt-16 pb-8 text-center">
            <p className="text-micro tracking-widest text-muted uppercase">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </p>
            <div className="relative">
              <img src={slide.cover} alt="" className="h-44 w-32 rounded-2xl border border-line object-cover shadow-2xl" />
              <span className="pointer-events-none absolute -top-6 -right-10 font-display text-7xl font-extrabold text-fg/10 sm:-right-16">
                {String(slide.episodes ?? index + 1).padStart(2, "0").slice(-2)}
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-6xl">{slide.title}</h1>
            <p className="mt-2 text-sm text-muted">
              {[slide.year ?? "—", formatLabel(slide.format), runLabel(slide) === formatLabel(slide.format) ? null : runLabel(slide), statusLabel(slide.status)]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {slide.genres.slice(0, 3).map((g) => (
                <Link key={g} to="/discover" search={discoverSearch({ genre: g })} className="rounded-full bg-surface/80 px-3 py-1 text-micro text-fg">
                  {g}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/watch/$id" params={{ id: String(slide.id) }} search={{ ep: 1 }} className="inline-flex h-11 items-center rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink">
                {kind === "MANGA" ? "Open" : "Watch"}
              </Link>
              <Link to="/discover" search={discoverSearch()} className={ghostBtn}>
                Browse
              </Link>
            </div>
            <form
              className="relative z-30 mt-6 w-full max-w-xl"
              onSubmit={(e) => {
                e.preventDefault();
                const query = q.trim();
                if (!query) return;
                void navigate({ to: "/discover", search: discoverSearch({ q: query }) });
              }}
            >
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={kind === "MANGA" ? "Search manga" : "Search anime"}
                className="h-12 w-full rounded-full border border-line bg-bg/80 pr-4 pl-11 text-sm backdrop-blur"
                aria-label="Search the catalog"
                aria-expanded={hits.length > 0}
                aria-controls="catalog-search-results"
              />
              {hits.length > 0 && (
                <ul id="catalog-search-results" className="absolute bottom-full z-30 mb-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-line bg-raised text-left shadow-xl">
                  {hits.map((hit) => (
                    <li key={hit.id}>
                      <Link to="/title/$id" params={{ id: String(hit.id) }} className="flex items-center gap-3 px-3 py-2 hover:bg-surface">
                        <img src={hit.cover} alt="" className="h-12 w-8 rounded object-cover" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{hit.title}</span>
                          <span className="text-micro text-muted">{hit.year} · {formatLabel(hit.format)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </form>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Link to="/discover" search={discoverSearch()} className="inline-flex h-11 items-center rounded-full border border-line bg-bg/70 px-4 text-sm">
                Filters
              </Link>
              <button
                type="button"
                className="inline-flex h-11 items-center rounded-full border border-line bg-bg/70 px-4 text-sm"
                onClick={() => {
                  const next = randomMedia(kind);
                  if (next) void navigate({ to: "/title/$id", params: { id: String(next.id) } });
                }}
              >
                Surprise
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              {slides.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Show ${item.title}`}
                  onClick={() => setIndex(i)}
                  className={cn("h-2 rounded-full", i === index ? "w-6 bg-accent" : "w-2 bg-fg/40")}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <main className="mx-auto max-w-screen-2xl px-4 pb-8">
        {sectionOn("continue") && (
        <section className="mt-8 rounded-2xl border border-line bg-surface p-4">
          <h2 className="text-sm font-semibold">Continue</h2>
          {continueItems.length === 0 ? (
            <Empty title="No watch history" body="Start a trailer and the episode you opened will sit here." action="Browse the shelf" />
          ) : (
            <div className="scroller mt-3 flex w-full min-w-0 gap-3 overflow-x-auto">
              {continueItems.map((row) => (
                <Link key={row.media.id} to="/watch/$id" params={{ id: String(row.media.id) }} search={{ ep: row.episode }} className="w-64 shrink-0 overflow-hidden rounded-xl border border-line">
                  <img src={row.media.banner || row.media.cover} alt="" className="h-28 w-full object-cover" />
                  <div className="h-1 bg-line">
                    <div className="h-full bg-gold" style={{ width: `${Math.min(100, Math.round((row.episode / episodeTotal(row.media)) * 100))}%` }} />
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold">{row.media.title}</p>
                    <p className="text-micro text-muted">Episode {row.episode} · <Ago at={row.at} /></p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
        )}

        {sectionOn("list") && (
        <section id="list" className="mt-4 rounded-2xl border border-line bg-surface p-4">
          <h2 className="text-sm font-semibold">Your list</h2>
          {saved.length === 0 ? (
            <Empty title="Your list is empty" body="Follow a title from its page. It stays on this device." action="Find something" />
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-8">
              {saved.map((item) => (
                <Poster key={item.id} media={item} />
              ))}
            </div>
          )}
        </section>
        )}
        {!dismissed.includes("device") && (
          <div className="mt-4 flex items-start justify-between gap-3 rounded-2xl border border-line bg-raised px-4 py-3">
            <p className="text-sm text-muted">
              <span className="font-semibold text-fg">Kept on this device. </span>
              Follows and notes stay on this device. They are not uploaded.
            </p>
            <button type="button" className="grid size-11 shrink-0 place-items-center text-muted" aria-label="Dismiss" onClick={() => dismiss("device")}>
              <X className="size-4" />
            </button>
          </div>
        )}

        {(sectionOn("notes") || sectionOn("airing")) && (
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          {sectionOn("notes") && (
          <section className="min-w-0 rounded-2xl border border-line bg-surface p-4">
            <h2 className="text-sm font-semibold">Recent notes</h2>
            <RecentNotes ids={commentIds} />
          </section>
          )}
          {sectionOn("airing") && (
          <section className="min-w-0 rounded-2xl border border-line bg-surface p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <h2 className="text-sm font-semibold">Airing next</h2>
                <ul className="mt-2 divide-y divide-line">
                  {airing.length === 0 && <li className="py-3 text-sm text-muted">Nothing dated on this shelf right now.</li>}
                  {airing.map((item) => (
                    <li key={item.id}>
                      <Link to="/title/$id" params={{ id: String(item.id) }} className="flex items-center gap-3 py-2">
                        <img src={item.cover} alt="" className="h-12 w-8 rounded object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm">{item.title}</span>
                          <span className="text-micro text-muted">Ep {item.nextAiring?.episode}</span>
                        </span>
                        {item.nextAiring && <span className="text-micro text-faint"><When at={item.nextAiring.at} /></span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold">Top of the shelf</h2>
                <ol className="mt-2 space-y-2">
                  {top.map((item, i) => (
                    <li key={item.id}>
                      <Link to="/title/$id" params={{ id: String(item.id) }} className="flex items-center gap-3">
                        <span className="w-5 text-micro text-faint tabular-nums">{i + 1}</span>
                        <img src={item.cover} alt="" className="h-10 w-7 rounded object-cover" />
                        <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
                        <span className="text-micro text-accent tabular-nums">{item.score}%</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
          )}
        </div>
        )}

        {sectionOn("rails") && rows.map((row) => (
          <Rail
            key={row.id}
            title={row.title}
            items={row.items}
            action={
              <Link to="/discover" search={discoverSearch({ sort: row.title.includes("rated") || row.title.includes("year") ? "score" : "popular" })} className="text-sm text-muted hover:text-fg">
                View all
              </Link>
            }
          />
        ))}

        {sectionOn("genres") && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Genres</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {["Action", "Fantasy", "Drama", "Romance", "Horror"].map((name) => {
              const sample = filterMedia({ kind, genre: name, sort: "popular" })[0];
              const count = genres.find(([g]) => g === name)?.[1];
              return (
                <Link key={name} to="/discover" search={discoverSearch({ genre: name })} className="relative h-28 overflow-hidden rounded-2xl border border-line">
                  {sample && <img src={sample.banner || sample.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />}
                  <span className="absolute inset-0 bg-bg/60" />
                  <span className="relative flex h-full flex-col justify-end p-3">
                    <span className="font-semibold">{name}</span>
                    {count != null && <span className="text-micro text-muted">{count} titles</span>}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
        )}
      </main>
    </Shell>
  );
}

function Empty({ title, body, action }: { title: string; body: string; action: string }) {
  return (
    <div className="py-6 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
      <Link to="/discover" search={discoverSearch()} className="mt-3 inline-flex text-sm text-accent">
        {action}
      </Link>
    </div>
  );
}
