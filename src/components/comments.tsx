import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { getMedia } from "@/data/catalog";
import { Ago } from "@/components/boot";
import { useLibrary, type UserNote } from "@/lib/library";
import { seededNotes, type SeedNote } from "@/lib/seeds";
import { cn } from "@/lib/cn";

type Row = SeedNote | UserNote;

export function threadFor(mediaId: number, userNotes: UserNote[], episode?: number) {
  const seeds = seededNotes(mediaId);
  const mine = userNotes.filter((n) => n.mediaId === mediaId && (episode == null || n.episode === episode || n.episode === 0));
  return [...mine, ...seeds].sort((a, b) => b.at - a.at);
}

export function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange?: (n: number) => void;
}) {
  return (
    <span className="inline-flex gap-0.5" role={onChange ? "radiogroup" : undefined} aria-label="Rating">
      {Array.from({ length: 10 }, (_, i) => {
        const n = i + 1;
        const on = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(n)}
            className={cn("text-sm leading-none", on ? "text-gold" : "text-faint", !onChange && "cursor-default")}
            aria-label={`${n} out of 10`}
          >
            ★
          </button>
        );
      })}
    </span>
  );
}

export function Comments({ mediaId, episode }: { mediaId: number; episode: number }) {
  const notes = useLibrary((s) => s.notes);
  const hiddenNotes = useLibrary((s) => s.hiddenNotes);
  const addNote = useLibrary((s) => s.addNote);
  const nick = useLibrary((s) => s.nick);
  const setNick = useLibrary((s) => s.setNick);
  const ratingKey = `${mediaId}:${episode}`;
  const rating = useLibrary((s) => s.ratings[ratingKey] ?? 0);
  const setRating = useLibrary((s) => s.setRating);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const rows = threadFor(mediaId, notes, episode).filter((row) => !hiddenNotes.includes(row.id));
  const replyName = rows.find((r) => r.id === replyTo)?.name;

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">Notes ({rows.length})</h2>
      <p className="mt-1 text-sm text-muted">Rate this episode</p>
      <div className="mt-2">
        <Stars value={rating} onChange={(n) => setRating(ratingKey, n)} />
      </div>
      <form
        className="mt-4 rounded-2xl border border-line bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault();
          const body = text.trim();
          if (!body) return;
          addNote({
            mediaId,
            episode,
            name: nick || "Guest",
            text: replyName ? `@${replyName} ${body}` : body,
            rating,
            parentId: replyTo ?? undefined,
          });
          setText("");
          setReplyTo(null);
        }}
      >
        <label className="block text-micro text-faint">
          Name
          <input
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-line bg-bg px-3 text-sm text-fg"
            maxLength={24}
          />
        </label>
        <label className="mt-3 block text-micro text-faint">
          {replyTo ? `Reply to ${replyName}` : "Your note"}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="What stayed with you?"
            className="mt-1 w-full resize-none rounded-xl border border-line bg-bg px-3 py-2 text-sm text-fg placeholder:text-faint"
          />
        </label>
        <div className="mt-3 flex items-center justify-between gap-3">
          {replyTo ? (
            <button type="button" className="text-sm text-muted" onClick={() => setReplyTo(null)}>
              Cancel reply
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="h-11 rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink">
            Post note
          </button>
        </div>
      </form>
      <ul className="mt-4 space-y-4">
        {rows.map((row) => (
          <li key={row.id} className={cn("flex gap-3", row.parentId && "ml-8")}>
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-raised text-micro font-semibold text-accent">
              {row.name.slice(0, 1)}
            </span>
            <div>
              <p className="text-sm">
                <span className="font-semibold">{row.name}</span>
                <span className="ml-2 text-micro text-faint">
                  <Ago at={row.at} />
                </span>
                {row.rating > 0 && <span className="ml-2 text-micro text-accent tabular-nums">{row.rating}/10</span>}
              </p>
              <p className="mt-1 text-sm text-muted">{row.text}</p>
              <button type="button" className="mt-1 text-micro text-faint hover:text-fg" onClick={() => setReplyTo(row.id)}>
                Reply
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RecentNotes({ ids }: { ids: number[] }) {
  const user = useLibrary((s) => s.notes);
  const rows = [...user, ...ids.flatMap((id) => seededNotes(id).slice(0, 1))]
    .sort((a, b) => b.at - a.at)
    .slice(0, 6);
  return (
    <ul className="divide-y divide-line">
      {rows.map((row) => {
        const media = getMedia(row.mediaId);
        return (
          <li key={row.id} className="flex items-start gap-3 py-3">
            {media && (
              <Link to="/title/$id" params={{ id: String(media.id) }} className="shrink-0">
                <img src={media.cover} alt="" className="h-14 w-10 rounded-md object-cover" />
              </Link>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{media?.title}</p>
              <p className="truncate text-sm text-muted">
                <span className="text-fg">{row.name}</span> · {row.text}
              </p>
              <p className="text-micro text-faint">
                <Ago at={row.at} />
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
