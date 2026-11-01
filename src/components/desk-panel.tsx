import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { blankMedia, commitDoc, getDoc, replaceDoc, subscribeCatalog, type Episode, type Kind, type Media, type PlaySource } from "@/data/catalog";
import { fontStack, type Palette, type SectionId, type ThemeName } from "@/data/site";
import { classifyUrl } from "@/lib/playback";
import { saveSite, setDeskPassword, deskIdentity, unlockDesk } from "@/lib/desk-api";
import { clearToken, currentToken, currentUser, rememberSession } from "@/lib/site-sync";
import { useLibrary } from "@/lib/library";
import { cn } from "@/lib/cn";

const TABS = ["Library", "Edit", "Rows", "Home", "Look", "Login"] as const;
type Tab = (typeof TABS)[number];

const inputCls = "h-11 w-full rounded-xl border border-line bg-bg px-3 text-sm text-fg placeholder:text-faint";
const areaCls = "w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-fg placeholder:text-faint";

function useDoc() {
  return useSyncExternalStore(subscribeCatalog, getDoc, getDoc);
}

async function pushDoc(docText: string) {
  const token = currentToken();
  if (!token) return { ok: false as const, error: "locked" as const };
  return saveSite({ data: { token, doc: docText } });
}

let pendingDoc: ReturnType<typeof getDoc> | null = null;
let publishTimer = 0;

function publish(mutator: (doc: ReturnType<typeof getDoc>) => void) {
  const next = structuredClone(pendingDoc ?? getDoc());
  mutator(next);
  if (!pendingDoc) next.revision = getDoc().revision + 1;
  pendingDoc = next;
  replaceDoc(next);
  window.clearTimeout(publishTimer);
  publishTimer = window.setTimeout(() => {
    if (!pendingDoc) return;
    const stamped = commitDoc(pendingDoc);
    pendingDoc = null;
    void pushDoc(JSON.stringify(stamped)).then((res) => {
      if (!res.ok && res.error === "locked") clearToken();
    });
  }, 400);
  return Promise.resolve({ ok: true as const, error: undefined });
}

export function DeskApp() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setToken(currentToken());
    setUser(currentUser());
    setReady(true);
  }, []);
  if (!ready) {
    return <div className="grid min-h-svh place-items-center bg-bg text-muted">Opening the desk…</div>;
  }
  if (!token) return <Lock onUnlock={(next, username) => { setToken(next); setUser(username); }} />;
  return (
    <Panel
      user={user}
      onUser={setUser}
      onLock={() => {
        clearToken();
        setToken(null);
        setUser(null);
      }}
    />
  );
}

function Lock({ onUnlock }: { onUnlock: (token: string, username: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="grid min-h-svh place-items-center bg-bg px-4 py-10 text-fg">
      <form
        className="w-full max-w-sm rounded-3xl border border-line bg-surface p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          void unlockDesk({ data: { username: username.trim(), password } })
            .then((res) => {
              if (!res.ok) {
                setError("That username or password is wrong.");
                return;
              }
              rememberSession(res.token, res.username);
              onUnlock(res.token, res.username);
            })
            .catch(() => setError("The desk could not be reached."))
            .finally(() => setBusy(false));
        }}
      >
        <p className="font-display text-sm font-extrabold tracking-widest text-gold">VELA</p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-none">Sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">Private desk. Nothing on the public site links here. Only a signed-in admin can change the shelf.</p>
        <label className="mt-6 block text-micro font-semibold uppercase tracking-widest text-faint" htmlFor="desk-user">
          Username
        </label>
        <input
          id="desk-user"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          autoComplete="username"
          spellCheck={false}
          className="mt-2 h-12 w-full rounded-2xl border border-line bg-bg px-4 text-sm"
        />
        <label className="mt-4 block text-micro font-semibold uppercase tracking-widest text-faint" htmlFor="desk-pass">
          Password
        </label>
        <div className="relative mt-2">
          <input
            id="desk-pass"
            name="password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="h-12 w-full rounded-2xl border border-line bg-bg px-4 pr-12 text-sm"
          />
          <button
            type="button"
            className="absolute inset-y-0.5 right-0.5 grid size-11 place-items-center rounded-xl text-muted"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((open) => !open)}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !username.trim() || !password}
          className="mt-5 h-12 w-full rounded-full bg-accent text-sm font-semibold text-accent-ink disabled:opacity-50"
        >
          {busy ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function Panel({ user, onUser, onLock }: { user: string | null; onUser: (username: string) => void; onLock: () => void }) {
  const [tab, setTab] = useState<Tab>("Library");
  const [editId, setEditId] = useState<number | null>(null);
  const [note, setNote] = useState("");

  function fail(result: { ok: boolean; error?: string }) {
    if (!result.ok && result.error === "locked") {
      onLock();
      return;
    }
    setNote(result.ok ? "Saved to the shelf." : "Saved on this device. The shared shelf did not update.");
  }

  function run(mutator: (draft: ReturnType<typeof getDoc>) => void) {
    void publish(mutator).then(fail);
  }

  return (
    <div className="min-h-svh bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <div>
            <p className="font-display text-lg font-extrabold text-accent">Desk</p>
            <p className="text-micro text-faint">{user ? `Signed in as ${user}` : "Private"}</p>
          </div>
          <p className="ml-auto hidden text-sm text-muted sm:block">{note}</p>
          <Link to="/browse" className="inline-flex h-11 items-center rounded-full border border-line px-3 text-sm">
            Close
          </Link>
          <button type="button" className="inline-flex h-11 items-center rounded-full px-3 text-sm text-muted" onClick={onLock}>
            Lock
          </button>
        </div>
        <div className="scroller mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-3">
          {TABS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setTab(name)}
              className={cn("h-11 shrink-0 rounded-full px-4 text-sm", tab === name ? "bg-accent text-accent-ink" : "bg-surface text-muted")}
            >
              {name}
            </button>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 pb-24">
        {note && <p className="mb-4 text-sm text-muted sm:hidden">{note}</p>}
        {tab === "Library" && (
          <LibraryTab
            onEdit={(id) => {
              setEditId(id);
              setTab("Edit");
            }}
            onCreate={(kind) => {
              const media = blankMedia(kind);
              run((draft) => {
                draft.media.unshift(media);
              });
              setEditId(media.id);
              setTab("Edit");
            }}
            onToggleHidden={(id) =>
              run((draft) => {
                const item = draft.media.find((m) => m.id === id);
                if (item) item.hidden = !item.hidden;
              })
            }
            onDelete={(id) =>
              run((draft) => {
                draft.media = draft.media.filter((m) => m.id !== id);
                for (const rail of draft.rails) rail.ids = rail.ids.filter((n) => n !== id);
                draft.hero.animeIds = draft.hero.animeIds.filter((n) => n !== id);
                draft.hero.mangaIds = draft.hero.mangaIds.filter((n) => n !== id);
              })
            }
          />
        )}
        {tab === "Edit" && (
          <Editor
            editId={editId}
            onSaved={() => setNote("Saved to the shelf.")}
            onLocked={onLock}
          />
        )}
        {tab === "Rows" && <RowsTab run={run} />}
        {tab === "Home" && <HomeTab run={run} />}
        {tab === "Look" && <LookTab run={run} />}
        {tab === "Login" && <KeyTab user={user} onUser={onUser} onLock={onLock} onNote={setNote} />}
      </main>
    </div>
  );
}

function LibraryTab({
  onEdit,
  onCreate,
  onToggleHidden,
  onDelete,
}: {
  onEdit: (id: number) => void;
  onCreate: (kind: Kind) => void;
  onToggleHidden: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const doc = useDoc();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<Kind | "ALL">("ALL");
  const [armed, setArmed] = useState<number | null>(null);
  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return doc.media.filter((m) => {
      if (kind !== "ALL" && m.kind !== kind) return false;
      if (!query) return true;
      return m.title.toLowerCase().includes(query) || (m.studio ?? "").toLowerCase().includes(query) || m.genres.some((g) => g.toLowerCase().includes(query));
    });
  }, [doc.media, q, kind]);

  return (
    <section>
      <div className="flex flex-wrap items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the shelf" className={cn(inputCls, "max-w-md flex-1")} aria-label="Search shelf" />
        {(["ALL", "ANIME", "MANGA"] as const).map((name) => (
          <button key={name} type="button" onClick={() => setKind(name)} className={cn("h-11 rounded-full px-3 text-sm", kind === name ? "bg-accent text-accent-ink" : "border border-line")}>
            {name === "ALL" ? "All" : name === "ANIME" ? "Anime" : "Manga"}
          </button>
        ))}
        <button type="button" className="inline-flex h-11 items-center gap-1 rounded-full bg-accent px-3 text-sm font-semibold text-accent-ink" onClick={() => onCreate("ANIME")}>
          <Plus className="size-4" /> Anime
        </button>
        <button type="button" className="inline-flex h-11 items-center gap-1 rounded-full border border-line px-3 text-sm" onClick={() => onCreate("MANGA")}>
          <Plus className="size-4" /> Manga
        </button>
      </div>
      <p className="mt-3 text-micro text-faint">{rows.length} titles</p>
      <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line">
        {rows.slice(0, 80).map((item) => (
          <li key={item.id} className="flex items-center gap-3 bg-surface px-3 py-2">
            <img src={item.cover} alt="" className="h-14 w-10 rounded-md object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="text-micro text-muted">
                {item.kind === "ANIME" ? "Anime" : "Manga"} · {item.year ?? "—"} {item.hidden ? "· Hidden" : ""}
              </p>
            </div>
            <button type="button" className="grid size-11 place-items-center text-muted" aria-label={item.hidden ? "Show title" : "Hide title"} onClick={() => onToggleHidden(item.id)}>
              {item.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
            <button type="button" className="h-11 rounded-full bg-raised px-3 text-sm" onClick={() => onEdit(item.id)}>
              Edit
            </button>
            <button
              type="button"
              className="grid size-11 place-items-center text-danger"
              aria-label="Delete title"
              onClick={() => {
                if (armed === item.id) onDelete(item.id);
                else setArmed(item.id);
              }}
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      {rows.length > 80 && <p className="mt-2 text-sm text-muted">Showing 80. Narrow the search to see the rest.</p>}
    </section>
  );
}

function cloneMedia(id: number | null) {
  if (!id) return null;
  const found = getDoc().media.find((m) => m.id === id);
  return found ? structuredClone(found) : null;
}

function Editor({ editId, onSaved, onLocked }: { editId: number | null; onSaved: () => void; onLocked: () => void }) {
  const doc = useDoc();
  const [pick, setPick] = useState("");
  const [selected, setSelected] = useState<number | null>(editId);
  const [draft, setDraft] = useState<Media | null>(() => cloneMedia(editId));
  const [syncId, setSyncId] = useState<number | null>(editId);
  if (editId && editId !== selected) setSelected(editId);
  if (selected !== syncId) {
    setSyncId(selected);
    const found = selected ? doc.media.find((m) => m.id === selected) : undefined;
    setDraft(found ? structuredClone(found) : null);
  }

  if (!draft) {
    return (
      <section>
        <p className="text-sm text-muted">Choose a title from the library, or search here.</p>
        <input value={pick} onChange={(e) => setPick(e.target.value)} placeholder="Find a title" className={cn(inputCls, "mt-3 max-w-md")} />
        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line">
          {doc.media
            .filter((m) => m.title.toLowerCase().includes(pick.trim().toLowerCase()))
            .slice(0, 12)
            .map((item) => (
              <li key={item.id}>
                <button type="button" className="flex w-full items-center gap-3 bg-surface px-3 py-2 text-left" onClick={() => setSelected(item.id)}>
                  <img src={item.cover} alt="" className="h-12 w-8 rounded object-cover" />
                  <span className="text-sm">{item.title}</span>
                </button>
              </li>
            ))}
        </ul>
      </section>
    );
  }

  const set = (patch: Partial<Media>) => setDraft({ ...draft, ...patch });

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const media = { ...draft, genres: draft.genres.map((g) => g.trim()).filter(Boolean) };
        void publish((docDraft) => {
          const idx = docDraft.media.findIndex((m) => m.id === media.id);
          if (idx >= 0) docDraft.media[idx] = media;
          else docDraft.media.unshift(media);
        }).then((res) => {
          if (!res.ok && res.error === "locked") onLocked();
          else onSaved();
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
        <img src={draft.cover || "/art/swords.jpg"} alt="" className="h-44 w-32 rounded-2xl border border-line object-cover" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title">
            <input className={inputCls} value={draft.title} onChange={(e) => set({ title: e.target.value })} />
          </Field>
          <Field label="Kind">
            <select className={inputCls} value={draft.kind} onChange={(e) => set({ kind: e.target.value as Kind })}>
              <option value="ANIME">Anime</option>
              <option value="MANGA">Manga</option>
            </select>
          </Field>
          <Field label="Romaji">
            <input className={inputCls} value={draft.romaji} onChange={(e) => set({ romaji: e.target.value })} />
          </Field>
          <Field label="Native title">
            <input className={inputCls} value={draft.native} onChange={(e) => set({ native: e.target.value })} />
          </Field>
        </div>
      </div>
      <Field label="Synopsis">
        <textarea className={areaCls} rows={5} value={draft.synopsis} onChange={(e) => set({ synopsis: e.target.value })} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <UrlField label="Cover / poster" value={draft.cover} onChange={(cover) => set({ cover })} />
        <UrlField label="Banner" value={draft.banner ?? ""} onChange={(banner) => set({ banner: banner || null })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Genres">
          <input className={inputCls} value={draft.genres.join(", ")} onChange={(e) => set({ genres: e.target.value.split(",").map((g) => g.trim()) })} placeholder="Action, Fantasy" />
        </Field>
        <Field label="Score (0–100)">
          <input className={inputCls} type="number" min={0} max={100} value={draft.score} onChange={(e) => set({ score: Number(e.target.value) })} />
        </Field>
        <Field label="Year">
          <input className={inputCls} type="number" value={draft.year ?? ""} onChange={(e) => set({ year: e.target.value ? Number(e.target.value) : null })} />
        </Field>
        <Field label="Studio">
          <input className={inputCls} value={draft.studio ?? ""} onChange={(e) => set({ studio: e.target.value || null })} />
        </Field>
        <Field label="Status">
          <select className={inputCls} value={draft.status} onChange={(e) => set({ status: e.target.value })}>
            {["FINISHED", "RELEASING", "NOT_YET_RELEASED", "CANCELLED", "HIATUS"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Format">
          <select className={inputCls} value={draft.format} onChange={(e) => set({ format: e.target.value })}>
            {["TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC", "MANGA", "NOVEL", "ONE_SHOT"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label={draft.kind === "MANGA" ? "Chapters" : "Episodes"}>
          <input
            className={inputCls}
            type="number"
            value={draft.kind === "MANGA" ? draft.chapters ?? "" : draft.episodes ?? ""}
            onChange={(e) => {
              const n = e.target.value ? Number(e.target.value) : null;
              if (draft.kind === "MANGA") set({ chapters: n });
              else set({ episodes: n });
            }}
          />
        </Field>
        <Field label="Season">
          <input className={inputCls} value={draft.season ?? ""} onChange={(e) => set({ season: e.target.value || null })} placeholder="WINTER" />
        </Field>
        <Field label="YouTube trailer id or URL">
          <input className={inputCls} value={draft.trailer ?? ""} onChange={(e) => set({ trailer: e.target.value.trim() || null })} />
        </Field>
        <Field label="Next episode number">
          <input
            className={inputCls}
            type="number"
            min={1}
            value={draft.nextAiring?.episode ?? ""}
            onChange={(e) => {
              const episode = e.target.value ? Number(e.target.value) : 0;
              if (!episode) {
                set({ nextAiring: draft.nextAiring?.at ? { at: draft.nextAiring.at, episode: 1 } : null });
                return;
              }
              set({ nextAiring: { at: draft.nextAiring?.at ?? Math.floor(Date.now() / 1000) + 86400, episode } });
            }}
          />
        </Field>
        <Field label="Next air time">
          <input
            className={inputCls}
            type="datetime-local"
            value={toLocalInput(draft.nextAiring?.at)}
            onChange={(e) => {
              const at = fromLocalInput(e.target.value);
              if (!at) {
                set({ nextAiring: null });
                return;
              }
              set({ nextAiring: { at, episode: draft.nextAiring?.episode || 1 } });
            }}
          />
        </Field>
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" checked={!!draft.hidden} onChange={(e) => set({ hidden: e.target.checked })} className="size-4 accent-gold" />
        Hidden from public rows and search
      </label>

      <SourceEditor sources={draft.sources ?? []} onChange={(sources) => set({ sources })} />

      <Field label="Custom embed code (iframe only)">
        <textarea className={areaCls} rows={3} value={draft.embedHtml ?? ""} onChange={(e) => set({ embedHtml: e.target.value || null })} placeholder={'<iframe src="https://..."></iframe>'} />
      </Field>

      <EpisodeEditor
        kind={draft.kind}
        episodes={draft.episodeList}
        onChange={(episodeList) => set({ episodeList })}
      />

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="h-11 rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink">
          Save title
        </button>
        <Link to="/title/$id" params={{ id: String(draft.id) }} className="inline-flex h-11 items-center rounded-full border border-line px-4 text-sm">
          Preview
        </Link>
      </div>
    </form>
  );
}

function SourceEditor({ sources, onChange }: { sources: PlaySource[]; onChange: (next: PlaySource[]) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">Playback links</legend>
      <p className="mt-1 text-sm text-muted">Direct video or image, YouTube, Vimeo, Google Drive, Dropbox, or any embeddable https URL. Leave episode blank to use it for the whole series.</p>
      <div className="mt-3 space-y-2">
        {sources.map((source, index) => (
          <div key={`${source.url}-${index}`} className="grid gap-2 rounded-2xl border border-line bg-surface p-3 sm:grid-cols-[8rem_1fr_6rem_auto]">
            <select
              className={inputCls}
              value={source.kind}
              onChange={(e) => {
                const next = [...sources];
                next[index] = { ...source, kind: e.target.value as PlaySource["kind"] };
                onChange(next);
              }}
            >
              {["youtube", "vimeo", "file", "drive", "dropbox", "embed", "link"].map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <input
              className={inputCls}
              value={source.url}
              placeholder="https://"
              onChange={(e) => {
                const next = [...sources];
                const classified = classifyUrl(e.target.value, source.kind);
                next[index] = { ...source, url: e.target.value, kind: e.target.value.trim() ? classified.kind : source.kind };
                onChange(next);
              }}
            />
            <input
              className={inputCls}
              type="number"
              placeholder="Ep"
              value={source.episode ?? ""}
              onChange={(e) => {
                const next = [...sources];
                next[index] = { ...source, episode: e.target.value ? Number(e.target.value) : null };
                onChange(next);
              }}
            />
            <button type="button" className="grid size-11 place-items-center text-danger" aria-label="Remove link" onClick={() => onChange(sources.filter((_, i) => i !== index))}>
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="mt-2 inline-flex h-11 items-center gap-1 text-sm text-accent" onClick={() => onChange([...sources, { kind: "link", url: "", label: "" }])}>
        <Plus className="size-4" /> Add link
      </button>
    </fieldset>
  );
}

function EpisodeEditor({ kind, episodes, onChange }: { kind: Kind; episodes: Episode[]; onChange: (next: Episode[]) => void }) {
  const [count, setCount] = useState(episodes.length || 12);
  return (
    <fieldset>
      <legend className="text-sm font-semibold">{kind === "MANGA" ? "Chapters" : "Episodes"}</legend>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input className={cn(inputCls, "w-28")} type="number" min={0} max={500} value={count} onChange={(e) => setCount(Number(e.target.value))} aria-label="Episode count" />
        <button
          type="button"
          className="h-11 rounded-full border border-line px-3 text-sm"
          onClick={() => {
            const n = Math.max(0, Math.min(500, count));
            const next: Episode[] = Array.from({ length: n }, (_, i) => episodes[i] ?? { n: i + 1, title: `${kind === "MANGA" ? "Chapter" : "Episode"} ${i + 1}`, thumb: null, source: null });
            onChange(next.map((ep, i) => ({ ...ep, n: i + 1 })));
          }}
        >
          Build list
        </button>
      </div>
      <div className="mt-3 max-h-96 space-y-2 overflow-y-auto">
        {episodes.slice(0, 60).map((ep, index) => (
          <div key={ep.n} className="grid gap-2 rounded-xl border border-line bg-surface p-2 sm:grid-cols-[3rem_1fr_1fr]">
            <span className="grid h-11 place-items-center text-micro text-faint tabular-nums">{ep.n}</span>
            <input className={inputCls} value={ep.title} aria-label={`Title ${ep.n}`} onChange={(e) => {
              const next = [...episodes];
              next[index] = { ...ep, title: e.target.value };
              onChange(next);
            }} />
            <input
              className={inputCls}
              value={ep.source?.url ?? ""}
              placeholder="Link for this one"
              aria-label={`Link ${ep.n}`}
              onChange={(e) => {
                const next = [...episodes];
                const url = e.target.value;
                next[index] = { ...ep, source: url ? { ...classifyUrl(url), url, episode: ep.n } : null };
                onChange(next);
              }}
            />
          </div>
        ))}
      </div>
      {episodes.length > 60 && <p className="mt-2 text-sm text-muted">First 60 are editable here. The rest stay saved.</p>}
    </fieldset>
  );
}

function RowsTab({ run }: { run: (m: (d: ReturnType<typeof getDoc>) => void) => void }) {
  const doc = useDoc();
  const [addTo, setAddTo] = useState<string | null>(null);
  const [q, setQ] = useState("");
  return (
    <section className="space-y-3">
      <p className="text-sm text-muted">Reorder homepage rows, hide one, or move titles inside a row.</p>
      {doc.rails.map((rail, index) => (
        <article key={rail.id} className="rounded-2xl border border-line bg-surface p-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              className={cn(inputCls, "max-w-xs")}
              defaultValue={rail.title}
              key={`${rail.id}-${rail.title}`}
              aria-label="Row title"
              onBlur={(e) => {
                const title = e.target.value.trim() || rail.title;
                if (title !== rail.title) run((draft) => { const hit = draft.rails[index]; if (hit) hit.title = title; });
              }}
            />
            <span className="text-micro text-faint">{rail.kind}</span>
            <button type="button" className="ml-auto grid size-11 place-items-center" aria-label="Move row up" disabled={index === 0} onClick={() => run((draft) => swap(draft.rails, index, index - 1))}>
              <ArrowUp className="size-4" />
            </button>
            <button type="button" className="grid size-11 place-items-center" aria-label="Move row down" disabled={index === doc.rails.length - 1} onClick={() => run((draft) => swap(draft.rails, index, index + 1))}>
              <ArrowDown className="size-4" />
            </button>
            <button type="button" className="h-11 rounded-full border border-line px-3 text-sm" onClick={() => run((draft) => { const hit = draft.rails[index]; if (hit) hit.hidden = !hit.hidden; })}>
              {rail.hidden ? "Show" : "Hide"}
            </button>
          </div>
          {rail.mode === "ids" && (
            <div className="mt-3">
              <ul className="space-y-1">
                {rail.ids.slice(0, 24).map((id, idIndex) => {
                  const media = doc.media.find((m) => m.id === id);
                  return (
                    <li key={`${rail.id}-${id}-${idIndex}`} className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm">{media?.title ?? `#${id}`}</span>
                      <button type="button" className="grid size-11 place-items-center" aria-label="Move title up" onClick={() => run((draft) => swap(draft.rails[index]?.ids ?? [], idIndex, idIndex - 1))}>
                        <ArrowUp className="size-4" />
                      </button>
                      <button type="button" className="grid size-11 place-items-center" aria-label="Move title down" onClick={() => run((draft) => swap(draft.rails[index]?.ids ?? [], idIndex, idIndex + 1))}>
                        <ArrowDown className="size-4" />
                      </button>
                      <button type="button" className="grid size-11 place-items-center text-danger" aria-label="Remove from row" onClick={() => run((draft) => { draft.rails[index]?.ids.splice(idIndex, 1); })}>
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              {rail.ids.length > 24 && <p className="mt-1 text-micro text-faint">{rail.ids.length - 24} more in this row.</p>}
              <button type="button" className="mt-2 text-sm text-accent" onClick={() => { setAddTo(rail.id); setQ(""); }}>
                Add a title
              </button>
              {addTo === rail.id && (
                <div className="mt-2">
                  <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search to add" />
                  <ul className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-line">
                    {doc.media
                      .filter((m) => (rail.kind === "ANY" || m.kind === rail.kind) && m.title.toLowerCase().includes(q.trim().toLowerCase()) && !rail.ids.includes(m.id))
                      .slice(0, 8)
                      .map((item) => (
                        <li key={item.id}>
                          <button type="button" className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-raised" onClick={() => run((draft) => { draft.rails[index]?.ids.unshift(item.id); })}>
                            {item.title}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {rail.mode !== "ids" && <p className="mt-2 text-sm text-muted">This row fills itself from scores or year. Hide it, or rename it.</p>}
        </article>
      ))}
      <button
        type="button"
        className="inline-flex h-11 items-center gap-1 rounded-full border border-line px-4 text-sm"
        onClick={() =>
          run((draft) => {
            draft.rails.push({ id: `row-${Date.now()}`, title: "New row", kind: "ANIME", hidden: false, mode: "ids", ids: [] });
          })
        }
      >
        <Plus className="size-4" /> New row
      </button>
    </section>
  );
}

const SECTION_LABELS: Record<SectionId, string> = {
  hero: "Featured banner",
  continue: "Continue watching",
  list: "Your list",
  notes: "Recent notes",
  airing: "Airing next",
  rails: "Poster rows",
  genres: "Genre tiles",
};

function HomeTab({ run }: { run: (m: (d: ReturnType<typeof getDoc>) => void) => void }) {
  const doc = useDoc();
  const [q, setQ] = useState("");
  const [which, setWhich] = useState<Kind>("ANIME");
  const ids = which === "ANIME" ? doc.hero.animeIds : doc.hero.mangaIds;
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Homepage sections</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {doc.sections.map((section) => (
            <label key={section.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-3 py-3 text-sm">
              <span>{SECTION_LABELS[section.id]}</span>
              <input
                type="checkbox"
                className="size-4 accent-gold"
                checked={section.enabled}
                onChange={(e) =>
                  run((draft) => {
                    const hit = draft.sections.find((s) => s.id === section.id);
                    if (hit) hit.enabled = e.target.checked;
                  })
                }
              />
            </label>
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold">Featured banners</h2>
        <p className="mt-1 text-sm text-muted">These hold the home hero. Empty means the shelf rotates the usual row.</p>
        <label className="mt-3 flex items-center gap-3 text-sm">
          <input type="checkbox" className="size-4 accent-gold" checked={doc.hero.rotate} onChange={(e) => run((draft) => { draft.hero.rotate = e.target.checked; })} />
          Rotate when more than one banner is pinned
        </label>
        <div className="mt-3 flex gap-2">
          {(["ANIME", "MANGA"] as const).map((kind) => (
            <button key={kind} type="button" className={cn("h-11 rounded-full px-3 text-sm", which === kind ? "bg-accent text-accent-ink" : "border border-line")} onClick={() => setWhich(kind)}>
              {kind === "ANIME" ? "Anime" : "Manga"}
            </button>
          ))}
        </div>
        <ul className="mt-3 space-y-1">
          {ids.map((id, index) => {
            const media = doc.media.find((m) => m.id === id);
            return (
              <li key={`${id}-${index}`} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-sm">{media?.title ?? id}</span>
                <button type="button" className="h-11 text-sm text-danger" onClick={() => run((draft) => {
                  const list = which === "ANIME" ? draft.hero.animeIds : draft.hero.mangaIds;
                  list.splice(index, 1);
                })}>
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
        <input className={cn(inputCls, "mt-3 max-w-md")} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pin a title to the hero" />
        <ul className="mt-2 overflow-hidden rounded-2xl border border-line">
          {doc.media
            .filter((m) => m.kind === which && m.title.toLowerCase().includes(q.trim().toLowerCase()) && !ids.includes(m.id))
            .slice(0, 6)
            .map((item) => (
              <li key={item.id}>
                <button type="button" className="flex w-full items-center gap-2 bg-surface px-3 py-2 text-left text-sm" onClick={() => run((draft) => {
                  const list = which === "ANIME" ? draft.hero.animeIds : draft.hero.mangaIds;
                  list.push(item.id);
                })}>
                  <img src={item.cover} alt="" className="h-10 w-7 rounded object-cover" />
                  {item.title}
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div className="grid gap-3">
        <h2 className="font-display text-2xl font-bold">Landing page</h2>
        <Field label="Headline">
          <BlurText value={doc.appearance.landing.headline} onCommit={(headline) => run((draft) => { draft.appearance.landing.headline = headline; })} />
        </Field>
        <Field label="Subline">
          <BlurText value={doc.appearance.landing.sub} onCommit={(sub) => run((draft) => { draft.appearance.landing.sub = sub; })} />
        </Field>
        <UrlField label="Landing image" value={doc.appearance.landing.image} onChange={(image) => run((draft) => { draft.appearance.landing.image = image; })} />
      </div>
    </section>
  );
}

const PRESETS: { id: ThemeName; name: string }[] = [
  { id: "night", name: "Night" },
  { id: "ember", name: "Ember" },
  { id: "dawn", name: "Dawn" },
  { id: "custom", name: "Custom" },
];

const COLOR_KEYS: { key: keyof Palette; label: string }[] = [
  { key: "bg", label: "Background" },
  { key: "surface", label: "Surface" },
  { key: "raised", label: "Raised" },
  { key: "fg", label: "Text" },
  { key: "muted", label: "Muted" },
  { key: "accent", label: "Accent" },
  { key: "accentInk", label: "Accent ink" },
  { key: "gold", label: "Gold" },
  { key: "line", label: "Line" },
];

function LookTab({ run }: { run: (m: (d: ReturnType<typeof getDoc>) => void) => void }) {
  const doc = useDoc();
  const setTheme = useLibrary((s) => s.setTheme);
  const look = doc.appearance;
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Theme</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={cn("h-16 rounded-2xl border text-sm font-semibold", look.preset === preset.id ? "border-accent bg-surface" : "border-line")}
              onClick={() => {
                setTheme(preset.id);
                run((draft) => { draft.appearance.preset = preset.id; });
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted">Custom colors apply when the mode icon is on Custom. Night, Ember, and Dawn keep their own palettes.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {COLOR_KEYS.map((item) => (
          <label key={item.key} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-3 py-2 text-sm">
            <span>{item.label}</span>
            <input
              type="color"
              value={toHex(look.colors[item.key])}
              aria-label={item.label}
              onChange={(e) => {
                setTheme("custom");
                run((draft) => {
                  draft.appearance.colors[item.key] = e.target.value;
                  draft.appearance.preset = "custom";
                });
              }}
            />
          </label>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Body font">
          <select className={inputCls} value={look.fontSans} onChange={(e) => run((draft) => { draft.appearance.fontSans = e.target.value; })}>
            {["Outfit", "Sora", "Newsreader"].map((f) => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Display font">
          <select className={inputCls} value={look.fontDisplay} onChange={(e) => run((draft) => { draft.appearance.fontDisplay = e.target.value; })}>
            {["Syne", "Outfit", "Sora", "Newsreader"].map((f) => <option key={f}>{f}</option>)}
          </select>
        </Field>
      </div>
      <p className="text-sm text-muted" style={{ fontFamily: fontStack(look.fontSans) }}>The quick brown fox watches the shelf.</p>
      <div>
        <h2 className="font-display text-2xl font-bold">Motion</h2>
        <div className="mt-3 grid gap-2">
          {(
            [
              ["marquee", "Title marquee"],
              ["posterLift", "Poster hover lift"],
              ["heroFade", "Banner crossfade"],
              ["pageFade", "Page fade"],
              ["press", "Button press"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-2xl border border-line bg-surface px-3 py-3 text-sm">
              <span>{label}</span>
              <input
                type="checkbox"
                className="size-4 accent-gold"
                checked={look.effects[key]}
                onChange={(e) => run((draft) => { draft.appearance.effects[key] = e.target.checked; })}
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

function KeyTab({
  user,
  onUser,
  onLock,
  onNote,
}: {
  user: string | null;
  onUser: (username: string) => void;
  onLock: () => void;
  onNote: (s: string) => void;
}) {
  const [username, setUsername] = useState(user ?? "");
  const [next, setNext] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const doc = useDoc();
  useEffect(() => {
    const token = currentToken();
    if (!token) return;
    let live = true;
    void deskIdentity({ data: { token } }).then((res) => {
      if (!live) return;
      if (!res.ok) {
        onLock();
        return;
      }
      setUsername(res.username);
      onUser(res.username);
    });
    return () => {
      live = false;
    };
  }, [onLock, onUser]);
  return (
    <section className="max-w-md space-y-4">
      <h2 className="font-display text-2xl font-bold">Sign-in</h2>
      <p className="text-sm text-muted">One desk account. Leave the password blank to keep the current one. A new password needs at least 8 characters.</p>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const token = currentToken();
          if (!token) return onLock();
          setBusy(true);
          void setDeskPassword({ data: { token, username: username.trim(), next } })
            .then((res) => {
              if (!res.ok) {
                if (res.error === "bad-name") {
                  onNote("Username needs 2–32 letters, numbers, dots, or dashes.");
                  return;
                }
                if (res.error === "short") {
                  onNote("Password needs at least 8 characters.");
                  return;
                }
                onLock();
                return;
              }
              rememberSession(res.token, res.username);
              setUsername(res.username);
              onUser(res.username);
              setNext("");
              onNote("Sign-in updated.");
            })
            .finally(() => setBusy(false));
        }}
      >
        <label className="block text-micro font-semibold uppercase tracking-widest text-faint" htmlFor="desk-next-user">
          Username
        </label>
        <input
          id="desk-next-user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          spellCheck={false}
          className={inputCls}
        />
        <label className="block text-micro font-semibold uppercase tracking-widest text-faint" htmlFor="desk-next-pass">
          New password
        </label>
        <div className="relative">
          <input
            id="desk-next-pass"
            type={show ? "text" : "password"}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="Leave blank to keep"
            className={`${inputCls} pr-12`}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-1 grid size-11 place-items-center text-muted"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((open) => !open)}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <button type="submit" disabled={busy || username.trim().length < 2} className="h-11 rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink disabled:opacity-50">
          {busy ? "Saving…" : "Save sign-in"}
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="h-11 rounded-full border border-line px-4 text-sm"
          onClick={() => {
            const blob = new Blob([JSON.stringify(doc)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "vela-shelf.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download shelf
        </button>
        <label className="inline-flex h-11 cursor-pointer items-center rounded-full border border-line px-4 text-sm">
          Import shelf
          <input
            type="file"
            accept="application/json"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              void file.text().then((text) => {
                const parsed = JSON.parse(text) as ReturnType<typeof getDoc>;
                if (!Array.isArray(parsed.media)) return;
                void publish((draft) => {
                  Object.assign(draft, parsed);
                  draft.revision = Math.max(draft.revision, getDoc().revision) + 1;
                }).then(() => onNote("Shelf imported."));
              });
            }}
          />
        </label>
      </div>
    </section>
  );
}

function toLocalInput(at: number | undefined) {
  if (!at) return "";
  const date = new Date(at * 1000);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromLocalInput(value: string) {
  if (!value) return null;
  const ms = new Date(value).getTime();
  if (!Number.isFinite(ms)) return null;
  return Math.floor(ms / 1000);
}

function BlurText({ value, onCommit }: { value: string; onCommit: (next: string) => void }) {
  const [text, setText] = useState(value);
  return (
    <input
      className={inputCls}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        if (text !== value) onCommit(text);
      }}
    />
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function UrlField({ label, value, onChange }: { label: string; value: string; onChange: (next: string) => void }) {
  return (
    <Field label={label}>
      <input className={inputCls} value={value} placeholder="https:// or upload" onChange={(e) => onChange(e.target.value)} />
      <input
        type="file"
        accept="image/*"
        className="mt-2 block w-full text-sm text-muted file:mr-3 file:h-11 file:rounded-full file:border-0 file:bg-raised file:px-3 file:text-sm file:text-fg"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          void shrinkImage(file).then((url) => {
            if (url) onChange(url);
          });
        }}
      />
    </Field>
  );
}

function swap<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return;
  const [item] = list.splice(from, 1);
  if (item !== undefined) list.splice(to, 0, item);
}

function toHex(color: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  return "#000000";
}

async function shrinkImage(file: File) {
  const bmp = await createImageBitmap(file);
  const max = 960;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bmp.width * scale));
  canvas.height = Math.max(1, Math.round(bmp.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}
