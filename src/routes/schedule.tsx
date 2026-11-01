import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, useKind } from "@/components/chrome";
import { When } from "@/components/boot";
import { schedule } from "@/data/catalog";
import { formatLabel } from "@/lib/format";

export const Route = createFileRoute("/schedule")({
  head: () => ({ meta: [{ title: "Schedule · Vela" }] }),
  component: SchedulePage,
});

function SchedulePage() {
  const kind = useKind();
  const rows = schedule(kind);
  return (
    <Shell>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-micro tracking-widest text-faint uppercase">{kind === "MANGA" ? "Manga" : "Anime"}</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Airing next</h1>
        <p className="mt-2 text-sm text-muted">Times follow this device. Only titles with a dated next episode are listed.</p>
        {rows.length === 0 ? (
          <p className="mt-10 text-sm text-muted">Nothing is scheduled on this shelf. Switch to anime if you are on manga.</p>
        ) : (
          <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
            {rows.map((item) => (
              <li key={item.id}>
                <Link to="/title/$id" params={{ id: String(item.id) }} className="flex items-center gap-3 px-3 py-3 hover:bg-raised">
                  <img src={item.cover} alt="" className="h-16 w-11 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{item.title}</span>
                    <span className="text-micro text-muted">
                      Episode {item.nextAiring?.episode} · {formatLabel(item.format)}
                    </span>
                  </span>
                  {item.nextAiring && (
                    <span className="text-sm text-accent">
                      <When at={item.nextAiring.at} />
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </Shell>
  );
}
