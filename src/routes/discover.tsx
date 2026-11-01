import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Shell, Score, useKind } from "@/components/chrome";
import { Poster } from "@/components/poster";
import { facetValues, filterMedia, genreCounts } from "@/data/catalog";
import { formatLabel, runLabel, statusLabel } from "@/lib/format";
import { discoverSearch, readDiscoverSearch, type DiscoverSearch } from "@/lib/search";
import { cn } from "@/lib/cn";

const PAGE = 20;

export const Route = createFileRoute("/discover")({
  validateSearch: (search) => readDiscoverSearch(search as Record<string, unknown>),
  head: () => ({ meta: [{ title: "Genres · Vela" }] }),
  component: Discover,
});

function Discover() {
  const search = Route.useSearch();
  const kind = useKind();
  const items = filterMedia({
    kind,
    q: search.q,
    genre: search.genre,
    format: search.format,
    status: search.status,
    sort: search.sort,
  });
  const pages = Math.max(1, Math.ceil(items.length / PAGE));
  const page = Math.min(search.page, pages);
  const slice = items.slice((page - 1) * PAGE, page * PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const noun = kind === "MANGA" ? "Manga" : "Anime";

  return (
    <Shell>
      <main className="mx-auto max-w-screen-2xl px-4 py-6">
        <p className="text-micro tracking-widest text-faint uppercase">{noun} genres</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">{search.genre || `All ${noun}`}</h1>
            <p className="mt-1 text-sm text-muted">
              Showing {slice.length} of {items.length}
              {search.q ? ` for “${search.q}”` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-full border border-line bg-surface p-1">
              <ViewLink search={search} view="grid" label="Grid" icon={<LayoutGrid className="size-4" />} />
              <ViewLink search={search} view="list" label="List" icon={<List className="size-4" />} />
            </div>
            <Link
              to="/discover"
              search={discoverSearch({ ...search, sort: search.sort === "score" ? "popular" : "score", page: 1 })}
              className={cn(
                "inline-flex h-11 items-center rounded-full border px-4 text-sm",
                search.sort === "score" ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface text-fg",
              )}
            >
              {search.sort === "score" ? "Top rated" : "Popular"}
            </Link>
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm"
            >
              <SlidersHorizontal className="size-4" />
              Filters
            </button>
          </div>
        </div>

        {filtersOpen && <Filters search={search} kind={kind} onClose={() => setFiltersOpen(false)} />}

        {slice.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-lg font-semibold">Nothing on this shelf</p>
            <p className="mt-1 text-sm text-muted">Clear a filter or try another word.</p>
            <Link to="/discover" search={discoverSearch({ view: search.view })} className="mt-4 inline-flex h-11 items-center text-sm text-accent">
              Reset filters
            </Link>
          </div>
        ) : search.view === "list" ? (
          <ul className="mt-6 space-y-3">
            {slice.map((item) => (
              <li key={item.id}>
                <Link to="/title/$id" params={{ id: String(item.id) }} className="flex gap-3 rounded-2xl border border-line bg-surface p-2">
                  <img src={item.cover} alt="" className="h-28 w-20 rounded-xl object-cover" />
                  <div className="min-w-0 py-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{item.title}</h2>
                      <Score value={item.score} />
                    </div>
                    <p className="mt-1 text-micro text-muted">
                      {formatLabel(item.format)} · {item.year ?? "—"} · {runLabel(item)} · {statusLabel(item.status)}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{item.synopsis}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {slice.map((item) => (
              <Poster key={item.id} media={item} />
            ))}
          </div>
        )}

        <Pager page={page} pages={pages} search={search} />
      </main>
    </Shell>
  );
}

function ViewLink({
  search,
  view,
  label,
  icon,
}: {
  search: DiscoverSearch;
  view: "grid" | "list";
  label: string;
  icon: ReactNode;
}) {
  const on = search.view === view;
  return (
    <Link
      to="/discover"
      search={discoverSearch({ ...search, view, page: 1 })}
      className={cn("inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm", on ? "bg-accent text-accent-ink" : "text-muted")}
    >
      {icon}
      {label}
    </Link>
  );
}

function Filters({
  search,
  kind,
  onClose,
}: {
  search: DiscoverSearch;
  kind: ReturnType<typeof useKind>;
  onClose: () => void;
}) {
  const [genre, setGenre] = useState(search.genre);
  const [format, setFormat] = useState(search.format);
  const [status, setStatus] = useState(search.status);
  const [sort, setSort] = useState(search.sort);
  const genres = genreCounts(kind);
  const formats = facetValues(kind, "format");
  const statuses = facetValues(kind, "status");
  const navigate = useNavigate();

  return (
    <form
      className="mt-4 rounded-2xl border border-line bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();
        void navigate({
          to: "/discover",
          search: discoverSearch({ ...search, genre, format, status, sort, page: 1 }),
        });
        onClose();
      }}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ChipSet label="Genre" value={genre} onChange={setGenre} options={genres.map(([name]) => ({ id: name, label: name }))} />
        <div className="space-y-4">
          <ChipSet label="Format" value={format} onChange={setFormat} options={formats.map((id) => ({ id, label: formatLabel(id) }))} />
          <ChipSet label="Status" value={status} onChange={setStatus} options={statuses.map((id) => ({ id, label: statusLabel(id) }))} />
          <ChipSet
            label="Sort"
            value={sort}
            onChange={setSort}
            allowEmpty={false}
            options={[
              { id: "popular", label: "Popular" },
              { id: "score", label: "Score" },
              { id: "year", label: "Year" },
              { id: "title", label: "Title" },
            ]}
          />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="submit" className="h-11 rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink">
          Apply
        </button>
        <Link to="/discover" search={discoverSearch({ view: search.view })} className="inline-flex h-11 items-center px-3 text-sm text-muted" onClick={onClose}>
          Clear
        </Link>
      </div>
    </form>
  );
}

function ChipSet({
  label,
  value,
  onChange,
  options,
  allowEmpty = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
  allowEmpty?: boolean;
}) {
  return (
    <fieldset>
      <legend className="text-micro tracking-widest text-faint uppercase">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {allowEmpty && (
          <Chip on={value === ""} onClick={() => onChange("")}>
            Any
          </Chip>
        )}
        {options.map((opt) => (
          <Chip key={opt.id} on={value === opt.id} onClick={() => onChange(opt.id)}>
            {opt.label}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 rounded-full border px-3 text-sm",
        on ? "border-accent bg-accent text-accent-ink" : "border-line text-muted",
      )}
    >
      {children}
    </button>
  );
}

function Pager({ page, pages, search }: { page: number; pages: number; search: DiscoverSearch }) {
  if (pages <= 1) return null;
  const nums = new Set([1, pages, page - 1, page, page + 1]);
  const list = [...nums].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pages">
      <PageLink search={search} page={Math.max(1, page - 1)} disabled={page === 1} label="Previous">
        <ChevronLeft className="size-4" />
      </PageLink>
      {list.map((n, i) => {
        const prev = list[i - 1];
        return (
          <span key={n} className="flex items-center gap-2">
            {prev && n - prev > 1 && <span className="text-faint">…</span>}
            <Link
              to="/discover"
              search={discoverSearch({ ...search, page: n })}
              className={cn(
                "grid size-11 place-items-center rounded-xl border text-sm tabular-nums",
                n === page ? "border-accent bg-accent text-accent-ink" : "border-line text-muted",
              )}
            >
              {n}
            </Link>
          </span>
        );
      })}
      <PageLink search={search} page={Math.min(pages, page + 1)} disabled={page === pages} label="Next">
        <ChevronRight className="size-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  search,
  page,
  disabled,
  label,
  children,
}: {
  search: DiscoverSearch;
  page: number;
  disabled: boolean;
  label: string;
  children: ReactNode;
}) {
  if (disabled) {
    return <span className="inline-flex h-11 items-center gap-1 px-2 text-sm text-faint">{children}{label}</span>;
  }
  return (
    <Link to="/discover" search={discoverSearch({ ...search, page })} className="inline-flex h-11 items-center gap-1 px-2 text-sm text-fg">
      {children}
      {label}
    </Link>
  );
}
