import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Bookmark, CircleHelp, Home, LayoutGrid, Search, Tv } from "lucide-react";
import type { Kind } from "@/data/catalog";
import { useLibrary } from "@/lib/library";
import { discoverSearch } from "@/lib/search";
import { cn } from "@/lib/cn";

const links = [
  { to: "/browse", label: "Home" },
  { to: "/discover", label: "Genres" },
  { to: "/schedule", label: "Schedule" },
  { to: "/guide", label: "How to use" },
] as const;

export function AppHeader({ showSearch = true }: { showSearch?: boolean }) {
  const kind = useLibrary((s) => s.kind);
  const setKind = useLibrary((s) => s.setKind);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  function goSearch(query: string) {
    void navigate({ to: "/discover", search: discoverSearch({ q: query.trim() }) });
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/browse" className="font-display text-xl font-extrabold tracking-tight text-accent">
          Vela
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "rounded-full px-3 py-2 text-sm text-muted transition-colors duration-200 hover:bg-surface hover:text-fg",
                path === link.to && "bg-surface text-fg",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {showSearch && (
            <form
              className="relative hidden md:block"
              onSubmit={(e) => {
                e.preventDefault();
                goSearch(q);
              }}
            >
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search titles"
                className="h-11 w-52 rounded-full border border-line bg-surface pr-3 pl-9 text-sm text-fg placeholder:text-faint"
                aria-label="Search titles"
              />
            </form>
          )}
          <div className="flex rounded-full border border-line bg-surface p-1">
            <KindButton active={kind === "ANIME"} onClick={() => setKind("ANIME")} icon={<Tv className="size-4" />}>
              Anime
            </KindButton>
            <KindButton active={kind === "MANGA"} onClick={() => setKind("MANGA")} icon={<BookOpen className="size-4" />}>
              Manga
            </KindButton>
          </div>
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-full border border-line px-3 text-sm text-fg md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            Menu
          </button>
        </div>
        {open && (
          <div className="flex w-full flex-col gap-2 md:hidden">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goSearch(q);
              }}
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search titles"
                className="h-11 w-full rounded-full border border-line bg-surface px-4 text-sm"
                aria-label="Search titles"
              />
            </form>
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="rounded-xl px-3 py-3 text-sm text-fg hover:bg-surface" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function KindButton({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm",
        active ? "bg-accent text-accent-ink" : "text-muted",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function Footer() {
  const reduceMotion = useLibrary((s) => s.reduceMotion);
  const setReduceMotion = useLibrary((s) => s.setReduceMotion);
  return (
    <footer className="mt-16 border-t border-line pb-24">
      <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-accent">Vela</p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            A night-cinema shelf for anime and manga. Trailers are official. Your queue stays in this browser.
          </p>
        </div>
        <div className="text-sm">
          <p className="text-micro tracking-wide text-faint uppercase">Browse</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/discover" search={discoverSearch()} className="text-muted hover:text-fg">
              All genres
            </Link>
            <Link to="/schedule" className="text-muted hover:text-fg">
              Schedule
            </Link>
            <Link to="/browse" className="text-muted hover:text-fg">
              Home rows
            </Link>
            <Link to="/guide" className="text-muted hover:text-fg">
              How to use
            </Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="text-micro tracking-wide text-faint uppercase">This device</p>
          <label className="mt-3 flex items-center gap-3 text-muted">
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(e) => setReduceMotion(e.target.checked)}
              className="size-4 accent-gold"
            />
            Quieter motion
          </label>
          <p className="mt-3 text-muted">Your list, notes, and motion stay in this browser. They do not change the shelf for anyone else.</p>
        </div>
      </div>
    </footer>
  );
}

export function Dock() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="Quick" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 px-2 pt-1 pb-2 backdrop-blur-md md:bottom-4 md:mx-auto md:w-fit md:rounded-full md:border md:px-1.5 md:py-1.5">
      <div className="mx-auto hidden max-w-md items-center justify-center gap-1 md:flex">
        <DockButton label="Back" onClick={() => window.history.back()}>
          <ArrowLeft className="size-4" />
        </DockButton>
        <DockButton label="Forward" onClick={() => window.history.forward()}>
          <ArrowRight className="size-4" />
        </DockButton>
        <DockLink to="/browse" label="Home" on={path === "/browse"}>
          <Home className="size-4" />
        </DockLink>
        <DockLink to="/browse" hash="list" label="Watchlist" on={false}>
          <Bookmark className="size-4" />
        </DockLink>
        <DockLink to="/guide" label="How to use" on={path === "/guide"}>
          <CircleHelp className="size-4" />
        </DockLink>
      </div>
      <div className="mx-auto flex max-w-md items-center justify-between md:hidden">
        <DockLink to="/browse" label="Home" on={path === "/browse"}>
          <Home className="size-4" />
        </DockLink>
        <DockLink to="/discover" label="Browse" on={path === "/discover"}>
          <LayoutGrid className="size-4" />
        </DockLink>
        <DockLink to="/discover" label="Search" on={false}>
          <Search className="size-4" />
        </DockLink>
        <DockLink to="/browse" hash="list" label="List" on={false}>
          <Bookmark className="size-4" />
        </DockLink>
        <DockLink to="/guide" label="Guide" on={path === "/guide"}>
          <CircleHelp className="size-4" />
        </DockLink>
      </div>
    </nav>
  );
}

function DockButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface hover:text-fg">
      {children}
    </button>
  );
}

function DockLink({
  to,
  hash,
  label,
  on,
  children,
}: {
  to: "/browse" | "/discover" | "/guide";
  hash?: string;
  label: string;
  on: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      hash={hash}
      search={to === "/discover" ? discoverSearch() : undefined}
      aria-label={label}
      title={label}
      className={cn("grid size-11 place-items-center rounded-full", on ? "bg-accent text-accent-ink" : "text-muted hover:bg-surface hover:text-fg")}
    >
      {children}
    </Link>
  );
}

export function Shell({ children, showSearch = true }: { children: ReactNode; showSearch?: boolean }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);
  return (
    <div className="min-h-screen bg-bg text-fg">
      <AppHeader showSearch={showSearch} />
      <div key={path} className="page-rise">
        {children}
      </div>
      <Footer />
      <Dock />
    </div>
  );
}

export function Score({ value, className }: { value: number; className?: string }) {
  if (!value) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-bg/80 px-1.5 py-0.5 text-micro font-semibold text-gold tabular-nums",
        className,
      )}
    >
      <StarIcon />
      {value}%
    </span>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-3 fill-gold" aria-hidden="true">
      <path d="M10 1.8 12.4 7l5.6.5-4.2 3.7 1.3 5.5L10 14.2 4.9 16.7 6.2 11.2 2 7.5 7.6 7 10 1.8Z" />
    </svg>
  );
}

export function useKind(): Kind {
  return useLibrary((s) => s.kind);
}