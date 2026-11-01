import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Media } from "@/data/catalog";
import { formatLabel, runLabel, statusLabel } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Score } from "@/components/chrome";

export function Poster({ media, className }: { media: Media; className?: string }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [box, setBox] = useState<{ top: number; left: number } | null>(null);
  const [deep, setDeep] = useState(false);
  const fine = useRef(false);

  useEffect(() => {
    fine.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  useEffect(() => {
    if (!box) return;
    const t = window.setTimeout(() => setDeep(true), 650);
    return () => window.clearTimeout(t);
  }, [box]);

  const still = deep && media.trailer ? `https://i.ytimg.com/vi/${media.trailer}/hqdefault.jpg` : media.banner || media.cover;

  return (
    <>
      <Link
        ref={cardRef}
        to="/title/$id"
        params={{ id: String(media.id) }}
        className={cn("group relative block overflow-hidden rounded-xl bg-surface", className)}
        onMouseEnter={() => {
          if (!fine.current || !cardRef.current) return;
          const rect = cardRef.current.getBoundingClientRect();
          const width = 288;
          let left = rect.right + 10;
          if (left + width > window.innerWidth - 8) left = rect.left - width - 10;
          left = Math.max(8, left);
          const top = Math.min(Math.max(8, rect.top), window.innerHeight - 300);
          setDeep(false);
          setBox({ top, left });
        }}
        onMouseLeave={() => setBox(null)}
      >
        <div className="aspect-poster overflow-hidden">
          <img
            src={media.cover}
            alt=""
            loading="lazy"
            className="poster-still h-full w-full object-cover transition duration-300 motion-safe:group-hover:scale-105"
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/75 to-transparent px-2 pt-12 pb-2">
          <p className="truncate text-sm font-semibold text-fg">{media.title}</p>
          <p className="text-micro text-muted">
            {formatLabel(media.format)} · {media.year ?? "—"}
          </p>
        </div>
        <span className="absolute top-2 left-2">
          <Score value={media.score} />
        </span>
        {media.status === "RELEASING" && (
          <span className="absolute top-2 right-2 rounded-md bg-accent px-1.5 py-0.5 text-micro font-semibold text-accent-ink">
            Airing
          </span>
        )}
      </Link>
      {box && (
        <div
          className="pointer-events-none fixed z-50 hidden w-72 overflow-hidden rounded-xl border border-line bg-raised shadow-2xl md:block"
          style={{ top: box.top, left: box.left }}
        >
          <div className="relative h-36">
            <img src={still} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-raised to-transparent" />
          </div>
          <div className="space-y-2 p-3">
            <p className="font-semibold text-fg">{media.title}</p>
            <p className="text-micro text-muted">
              {media.year ?? "—"} · {formatLabel(media.format)} · {runLabel(media)}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Score value={media.score} />
              <span className="text-micro tracking-wide text-muted uppercase">{statusLabel(media.status)}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {media.genres.slice(0, 4).map((g) => (
                <span key={g} className="rounded-full bg-surface px-2 py-0.5 text-micro text-muted">
                  {g}
                </span>
              ))}
            </div>
            <p className="text-micro text-faint">{deep ? "Trailer still" : "Hold for a trailer still"}</p>
          </div>
        </div>
      )}
    </>
  );
}

export function Rail({ title, items, action }: { title: string; items: Media[]; action?: ReactNode }) {
  if (!items.length) return null;
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      <div className="scroller flex w-full min-w-0 gap-3 overflow-x-auto pb-2">
        {items.map((item) => (
          <div key={item.id} className="w-36 shrink-0 sm:w-40">
            <Poster media={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
