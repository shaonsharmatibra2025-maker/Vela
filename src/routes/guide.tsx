import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Shell } from "@/components/chrome";
import { discoverSearch } from "@/lib/search";

export const Route = createFileRoute("/guide")({
  head: () => ({ meta: [{ title: "How to use · Vela" }] }),
  component: Guide,
});

const STEPS = [
  { id: "move", title: "Move around" },
  { id: "find", title: "Find a title" },
  { id: "open", title: "Open a title" },
  { id: "watch", title: "Watch" },
  { id: "yours", title: "Your list and notes" },
  { id: "look", title: "Look and schedule" },
  { id: "phone", title: "On a phone" },
  { id: "limits", title: "What it does not do" },
] as const;

function Guide() {
  return (
    <Shell>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-micro tracking-widest text-faint uppercase">Vela</p>
        <h1 className="mt-1 font-display text-3xl font-bold">How to use the site</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          The shelf, the player, and every control a visitor can reach. Follows, notes, and the look stay in this browser. They are not uploaded.
        </p>

        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
          {STEPS.map((step) => (
            <a key={step.id} href={`#${step.id}`} className="inline-flex h-11 items-center rounded-full border border-line px-3 text-sm text-muted hover:text-fg">
              {step.title}
            </a>
          ))}
        </nav>

        <div className="mt-8 space-y-3">
          <Section id="move" title="Move around">
            <p>
              The word <strong className="font-semibold text-fg">Vela</strong> always returns to the home shelf. On a wide screen the header lists Home, Genres, Schedule, and How to use. On a phone those sit behind <strong className="font-semibold text-fg">Menu</strong>.
            </p>
            <ul>
              <li>The Anime / Manga switch in the header flips the whole shelf. Search, rows, and the schedule follow whichever side is on.</li>
              <li>The search field in the header (or inside Menu) opens Genres with that word already filled in.</li>
              <li>The bar along the bottom is the quick dock. On a wide screen it is Back, Forward, Home, your list, and this guide. On a phone it is Home, Browse, Search, List, and Guide.</li>
            </ul>
            <Links items={[{ label: "Home", to: "/browse" }]} />
          </Section>

          <Section id="find" title="Find a title">
            <p>Home is the shelf. The banner can be searched, filtered, or skipped with Surprise, which opens a random title on the current side.</p>
            <ul>
              <li>The dots under the banner step through the featured titles chosen for the shelf.</li>
              <li>Continue shows the last episode you opened. Your list is everything you followed.</li>
              <li>Airing next and Top of the shelf sit beside recent notes. Genre tiles and the rows underneath jump into Genres.</li>
              <li>Genres filters by name, genre, format, status, and score. Switch Grid or List, and flip Popular or Top rated. Pages sit at the bottom.</li>
            </ul>
            <Links
              items={[
                { label: "Home", to: "/browse" },
                { label: "Genres", to: "/discover" },
              ]}
            />
          </Section>

          <Section id="open" title="Open a title">
            <p>A poster opens the title page. The chips under the name are year, format, length, and status. Genre names are links.</p>
            <ul>
              <li>Watch, or Continue if you already opened an episode, starts playback. Manga uses Open instead of Watch.</li>
              <li>Follow, or the heart on the cover, keeps the title on Home under Your list. Tap again to drop it.</li>
              <li>Random jumps to another title on the same side. Share copies the page address.</li>
              <li>The tabs are Overview, Episodes, Trailer, and More like this. An episode row opens that episode.</li>
            </ul>
          </Section>

          <Section id="watch" title="Watch">
            <p>
              The player uses the source saved on that episode. The line under the picture says which one: YouTube, a video file, a still, or an embed. If nothing was saved, it says there is no playable source.
            </p>
            <ul>
              <li>Next episode moves forward. Mark logged writes this episode into Continue.</li>
              <li>Focus hides the episode list and the notes so the picture can take the page. Show shelf brings them back.</li>
              <li>Left and right arrow keys change episode when you are not typing in a field.</li>
              <li>A long series has a Jump menu, thirty episodes at a time.</li>
              <li>Back to series returns to the title page. A sequel, when one is on the shelf, sits under the player.</li>
            </ul>
          </Section>

          <Section id="yours" title="Your list and notes">
            <p>These live only in this browser. Clearing site data for Vela removes them.</p>
            <ul>
              <li>Follow puts a title on Home under Your list. The bookmark in the dock jumps there.</li>
              <li>Continue remembers the last episode you opened or marked.</li>
              <li>On the watch page, ten stars rate that episode. A note sits under the same episode. Set a name if you want one; otherwise it is saved as Guest.</li>
              <li>Some titles already show sample notes. Yours are the ones you typed. Hiding a note is not available on the public site.</li>
              <li>The welcome page can keep a private note for this device. Nobody else can read it.</li>
            </ul>
            <Links items={[{ label: "Your list", to: "/browse", hash: "list" }]} />
          </Section>

          <Section id="look" title="Look and schedule">
            <p>The look of the shelf is set for everyone. Visitors cannot restyle it, pin the banner, or edit titles.</p>
            <ul>
              <li>Night, Ember, Dawn, and Custom are published looks. What you see is the one currently published.</li>
              <li>Quieter motion, in the footer, only calms animation on this device.</li>
              <li>Schedule lists only episodes that have not aired yet. Times follow this device. Manga often has nothing dated — switch to Anime if the list is empty.</li>
            </ul>
            <Links items={[{ label: "Schedule", to: "/schedule" }]} />
          </Section>

          <Section id="phone" title="On a phone">
            <p>The header search hides. Open Menu for search and for Home, Genres, Schedule, and How to use.</p>
            <ul>
              <li>The bottom dock becomes Home, Browse, Search, List, and Guide.</li>
              <li>Rows scroll sideways. Filters on Genres open in a panel so the poster grid can stay narrow.</li>
              <li>Focus on the watch page is the easiest way to give the picture the screen.</li>
            </ul>
          </Section>

          <Section id="limits" title="What this site does not do">
            <p>There is no watch-together room and no shared chat. Playback is one person, on this device.</p>
            <ul>
              <li>Full episodes are not hosted here unless a source link was added for that title. Most previews are official trailers.</li>
              <li>Covers and facts come from the catalog. A score of zero means none was recorded.</li>
              <li>There is no visitor account. A different browser, or a cleared one, starts with an empty list.</li>
            </ul>
          </Section>
        </div>
      </main>
    </Shell>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-line bg-surface p-4">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-4">
        {children}
      </div>
    </section>
  );
}

function Links({
  items,
}: {
  items: { label: string; to: "/browse" | "/discover" | "/schedule"; hash?: string }[];
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((link) =>
        link.to === "/discover" ? (
          <Link key={link.label} to={link.to} search={discoverSearch()} className="inline-flex h-11 items-center rounded-full border border-line px-3 text-sm text-fg">
            {link.label}
          </Link>
        ) : (
          <Link key={link.label} to={link.to} hash={link.hash} className="inline-flex h-11 items-center rounded-full border border-line px-3 text-sm text-fg">
            {link.label}
          </Link>
        ),
      )}
    </div>
  );
}
