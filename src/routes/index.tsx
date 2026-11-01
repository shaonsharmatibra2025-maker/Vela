import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Clapperboard, Library, MonitorSmartphone, MessagesSquare, Captions, ListChecks } from "lucide-react";
import { counts, getDoc, rail } from "@/data/catalog";
import { discoverSearch } from "@/lib/search";
import { solidBtn, ghostBtn } from "@/lib/format";
import { useLibrary } from "@/lib/library";

const STAFF = [
  { name: "Sable", role: "Curator", img: "/art/staff-1.jpg", on: true },
  { name: "Ren", role: "Scheduler", img: "/art/staff-2.jpg", on: true },
  { name: "Ivo", role: "Notes", img: "/art/staff-3.jpg", on: true },
  { name: "Hana", role: "Trailers", img: "/art/staff-4.jpg", on: true },
  { name: "Otto", role: "Genres", img: "/art/staff-5.jpg", on: true },
  { name: "Bea", role: "Manga", img: "/art/staff-6.jpg", on: false },
  { name: "Noa", role: "Shelf", img: "/art/staff-7.jpg", on: true },
  { name: "Quill", role: "Queue", img: "/art/staff-8.jpg", on: false },
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Vela — anime and manga, free and beautiful" }] }),
  component: Landing,
});

function Landing() {
  const landing = getDoc().appearance.landing;
  const stats = counts();
  const titles = rail("popular").slice(0, 18).map((m) => m.title);
  const messages = useLibrary((s) => s.messages);
  const addMessage = useLibrary((s) => s.addMessage);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="bg-bg text-fg">
      <section className="relative min-h-svh">
        <img src={landing.image || "/art/swords.jpg"} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/75 via-bg/55 to-bg" />
        <div className="relative mx-auto flex min-h-svh max-w-5xl flex-col px-4 pt-6 pb-16">
          <nav className="mx-auto flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full border border-line bg-bg/70 p-1 backdrop-blur-md">
            <span className="px-3 font-display text-sm font-extrabold tracking-tight text-accent">Vela</span>
            <a href="#features" className="rounded-full px-3 py-2 text-sm text-fg">Features</a>
            <a href="#crew" className="rounded-full px-3 py-2 text-sm text-muted">Crew</a>
            <a href="#notes" className="rounded-full px-3 py-2 text-sm text-muted">Notes</a>
            <a href="#contact" className="rounded-full px-3 py-2 text-sm text-muted">Contact</a>
            <Link to="/browse" className="rounded-full bg-accent px-3 py-2 text-sm font-semibold text-accent-ink">
              View titles
            </Link>
          </nav>
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-micro tracking-widest text-muted uppercase">{stats.all} titles in the catalog</p>
            <h1 className="mt-4 bg-gradient-to-b from-fg to-accent bg-clip-text font-display text-6xl font-extrabold tracking-tight text-transparent sm:text-8xl">
              {landing.headline || "Vela"}
            </h1>
            <p className="mt-4 max-w-md text-lg text-fg">{landing.sub}</p>
            <p className="mt-2 max-w-md text-sm text-muted">Official trailers, a personal queue, and notes that never leave this browser.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/browse" className={solidBtn}>
                Enter Vela
              </Link>
              <Link to="/discover" search={discoverSearch()} className={ghostBtn}>
                Browse catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-line bg-bg">
        <div className="marquee-track gap-8 py-3 text-sm text-muted">
          {[...titles, ...titles].map((title, i) => (
            <span key={`${title}-${i}`} className="shrink-0">
              {title}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto grid max-w-5xl grid-cols-2 gap-3 px-4 py-12 lg:grid-cols-4">
        <Stat n={`${stats.anime}`} label="Anime series" />
        <Stat n={`${stats.manga}`} label="Manga" />
        <Stat n="Zero" label="Paywalls" />
        <Stat n={`${stats.trailers}`} label="Official trailers" />
      </section>

      <section id="features" className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="text-center font-display text-3xl font-bold">Everything you need</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted">
          Built like a late-night catalog. Here is what is actually on the shelf.
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <Feature icon={<Clapperboard className="size-4" />} title="Official trailers" body="Press play and the studio trailer runs in the player. Episode picks are your log, not a bootleg." />
          <Feature icon={<ListChecks className="size-4" />} title="Queue and continue" body="Follow a title or hit play. The row on the home shelf remembers where you left off." />
          <Feature icon={<MessagesSquare className="size-4" />} title="Notes" body="Rate an episode and leave a note. Replies stay with the title, on this device." />
          <Feature icon={<Library className="size-4" />} title="Genres and filters" body="Grid or list, score or year, one genre at a time. The shelf is the whole point." />
          <Feature icon={<Captions className="size-4" />} title="Anime and manga" body="Switch the catalog from the header. Same posters, same queue." />
          <Feature icon={<MonitorSmartphone className="size-4" />} title="This device" body="No account. Your list, notes, and theme stay in this browser." />
        </div>
      </section>

      <section id="crew" className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-center font-display text-3xl font-bold">Who keeps the shelf</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted">The people behind the catalog. A warm dot means they are on tonight.</p>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STAFF.map((person) => (
            <li key={person.name} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
              <img src={person.img} alt="" className="size-12 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{person.name}</p>
                <p className="flex items-center gap-1.5 text-micro text-muted">
                  <span className={person.on ? "size-1.5 rounded-full bg-accent" : "size-1.5 rounded-full bg-faint"} />
                  {person.role}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="notes" className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="text-center font-display text-3xl font-bold">What shipped</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <article className="rounded-2xl border border-line bg-surface p-4">
            <h3 className="font-semibold">Shelf</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Home rows for the season, the year, and quieter scores</li>
              <li>Hover a poster for the still</li>
              <li>Schedule of what is actually airing</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-line bg-surface p-4">
            <h3 className="font-semibold">Personal</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Follow, continue, and a 10-point rating</li>
              <li>Notes under each episode</li>
              <li>A short guide for every control</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-line bg-surface p-4">
            <h3 className="font-semibold">Honest limits</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Trailers only — full episodes stay with the studios</li>
              <li>Covers and facts from AniList</li>
              <li>Your notes and queue stay on this device</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="font-display text-3xl font-bold">Ready to dive in?</h2>
        <p className="mt-2 text-sm text-muted">Free, on this device, and already full of titles.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/browse" className={solidBtn}>Get started</Link>
          <Link to="/discover" search={discoverSearch()} className={ghostBtn}>Browse catalog</Link>
          <Link to="/guide" className="inline-flex h-11 items-center text-sm text-muted hover:text-fg">How to use</Link>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-xl px-4 pb-16">
        <h2 className="font-display text-2xl font-bold">Leave a private note</h2>
        <p className="mt-1 text-sm text-muted">It stays in this browser. Nobody else can read it.</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const text = draft.trim();
            if (!text) return;
            addMessage(text);
            setDraft("");
            setSent(true);
          }}
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder="A title to add, a row that feels wrong..."
            className="w-full resize-none rounded-2xl border border-line bg-surface px-3 py-3 text-sm placeholder:text-faint"
            suppressHydrationWarning
          />
          <button type="submit" className={solidBtn}>Keep on this device</button>
          {sent && <p className="text-sm text-muted">Kept. {messages.length} note{messages.length === 1 ? "" : "s"} on this device.</p>}
        </form>
      </section>

      <footer className="border-t border-line px-4 py-6 text-center text-micro text-faint">
        Vela · trailers via YouTube · metadata via AniList
      </footer>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-4 py-5 text-center">
      <p className="font-display text-3xl font-extrabold text-accent tabular-nums">{n}</p>
      <p className="mt-1 text-micro tracking-widest text-faint uppercase">{label}</p>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-line bg-surface p-4">
      <div className="grid size-9 place-items-center rounded-full bg-raised text-accent">{icon}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </article>
  );
}
