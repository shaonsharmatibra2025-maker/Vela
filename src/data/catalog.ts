import raw from "./catalog.json";
import {
  defaultAppearance,
  defaultHero,
  defaultSections,
  normalizeDoc,
  railsFromLegacy,
  type Appearance,
  type HeroConfig,
  type PlaySource,
  type RailDef,
  type SectionId,
  type SiteDoc,
} from "@/data/site";

export type { Appearance, HeroConfig, PlaySource, RailDef, SectionId, SiteDoc };
export type { SourceKind, ThemeName, Palette } from "@/data/site";

export type Kind = "ANIME" | "MANGA";

export type Episode = {
  n: number;
  title: string;
  thumb: string | null;
  source?: PlaySource | null;
};

export type Relation = {
  id: number;
  relation: string;
  title: string;
  kind: string;
};

export type Media = {
  id: number;
  kind: Kind;
  title: string;
  romaji: string;
  native: string;
  synopsis: string;
  cover: string;
  banner: string | null;
  color: string | null;
  score: number;
  year: number | null;
  season: string | null;
  format: string;
  episodes: number | null;
  chapters: number | null;
  duration: number | null;
  status: string;
  genres: string[];
  studio: string | null;
  trailer: string | null;
  popularity: number;
  nextAiring: { at: number; episode: number } | null;
  relations: Relation[];
  recs: number[];
  episodeList: Episode[];
  sources?: PlaySource[];
  embedHtml?: string | null;
  hidden?: boolean;
};

type CatalogFile = { media: Media[]; rails: Record<string, number[]> };

const seedFile = raw as CatalogFile;

function seedDoc(): SiteDoc {
  const legacyRails: Record<string, number[]> = {};
  for (const [key, ids] of Object.entries(seedFile.rails)) legacyRails[key] = [...ids];
  return {
    media: seedFile.media.filter((m) => m.kind === "ANIME" || m.kind === "MANGA"),
    rails: railsFromLegacy(legacyRails),
    legacyRails,
    sections: defaultSections(),
    appearance: defaultAppearance(),
    hero: defaultHero(),
    revision: 0,
    updatedAt: 0,
  };
}

let doc: SiteDoc = seedDoc();
let version = 0;
const listeners = new Set<() => void>();

export function getDoc() {
  return doc;
}

export function catalogVersion() {
  return version;
}

export function subscribeCatalog(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function replaceDoc(next: SiteDoc) {
  doc = next;
  version += 1;
  listeners.forEach((listener) => listener());
}

export function commitDoc(next: SiteDoc) {
  const stamped: SiteDoc = { ...next, updatedAt: Date.now() };
  replaceDoc(stamped);
  try {
    localStorage.setItem(SITE_KEY, JSON.stringify(stamped));
  } catch {
    /* private mode or quota */
  }
  return stamped;
}

export const SITE_KEY = "vela-site-v1";

export function readLocalDoc() {
  if (typeof localStorage === "undefined") return null;
  try {
    const rawText = localStorage.getItem(SITE_KEY);
    if (!rawText) return null;
    return normalizeDoc(JSON.parse(rawText) as SiteDoc, doc);
  } catch {
    return null;
  }
}

function listed() {
  return doc.media.filter((m) => !m.hidden);
}

function byIdAll() {
  return new Map(doc.media.map((m) => [m.id, m]));
}

export function allMedia() {
  return listed();
}

export function getMedia(id: number) {
  return byIdAll().get(id);
}

export function sectionOn(id: SectionId) {
  const hit = doc.sections.find((s) => s.id === id);
  return hit ? hit.enabled : true;
}

function resolveRail(railDef: RailDef) {
  if (railDef.mode === "gems") return hiddenGems(railDef.kind === "MANGA" ? "MANGA" : "ANIME");
  if (railDef.mode === "newest") return newest(railDef.kind === "MANGA" ? "MANGA" : "ANIME");
  if (railDef.mode === "top") return topRated(railDef.kind === "MANGA" ? "MANGA" : "ANIME", 16);
  const map = byIdAll();
  const out: Media[] = [];
  for (const id of railDef.ids) {
    const item = map.get(id);
    if (item && !item.hidden) out.push(item);
  }
  return out;
}

export function rail(name: string) {
  const railDef = doc.rails.find((r) => r.id === name);
  if (railDef) return resolveRail(railDef);
  const ids = doc.legacyRails[name] ?? [];
  const map = byIdAll();
  const out: Media[] = [];
  for (const id of ids) {
    const item = map.get(id);
    if (item && !item.hidden) out.push(item);
  }
  return out;
}

export function homeRows(kind: Kind) {
  return doc.rails
    .filter((railDef) => !railDef.hidden && (railDef.kind === kind || railDef.kind === "ANY"))
    .map((railDef) => ({ id: railDef.id, title: railDef.title, items: resolveRail(railDef) }))
    .filter((row) => row.items.length > 0);
}

export function heroSlides(kind: Kind) {
  const ids = kind === "MANGA" ? doc.hero.mangaIds : doc.hero.animeIds;
  const map = byIdAll();
  const picked: Media[] = [];
  for (const id of ids) {
    const item = map.get(id);
    if (item && !item.hidden && item.kind === kind) picked.push(item);
  }
  if (picked.length) return picked.slice(0, 8);
  const fallback = (kind === "ANIME" ? rail("trending") : rail("manga")).filter((m) => m.banner || m.cover);
  return fallback.slice(0, 5);
}

export function counts() {
  let anime = 0;
  let manga = 0;
  let trailers = 0;
  for (const item of listed()) {
    if (item.kind === "ANIME") anime += 1;
    else manga += 1;
    if (item.trailer || item.sources?.length || item.embedHtml) trailers += 1;
  }
  return { anime, manga, trailers, all: listed().length };
}

export type FilterOpts = {
  kind: Kind;
  q?: string;
  genre?: string;
  format?: string;
  status?: string;
  sort?: string;
};

export function filterMedia(opts: FilterOpts) {
  const q = (opts.q ?? "").trim().toLowerCase();
  let items = listed().filter((m) => m.kind === opts.kind);
  if (q) {
    items = items.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.romaji.toLowerCase().includes(q) ||
        m.native.toLowerCase().includes(q) ||
        m.genres.some((g) => g.toLowerCase().includes(q)) ||
        (m.studio ?? "").toLowerCase().includes(q),
    );
  }
  if (opts.genre) items = items.filter((m) => m.genres.includes(opts.genre as string));
  if (opts.format) items = items.filter((m) => m.format === opts.format);
  if (opts.status) items = items.filter((m) => m.status === opts.status);
  const copy = [...items];
  const sort = opts.sort ?? "popular";
  if (sort === "score") copy.sort((a, b) => b.score - a.score || b.popularity - a.popularity);
  else if (sort === "year") copy.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || b.popularity - a.popularity);
  else if (sort === "title") copy.sort((a, b) => a.title.localeCompare(b.title));
  else copy.sort((a, b) => b.popularity - a.popularity);
  return copy;
}

export function genreCounts(kind: Kind) {
  const map = new Map<string, number>();
  for (const item of listed()) {
    if (item.kind !== kind) continue;
    for (const genre of item.genres) map.set(genre, (map.get(genre) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export function facetValues(kind: Kind, key: "format" | "status") {
  return [...new Set(listed().filter((m) => m.kind === kind).map((m) => m[key]))].sort();
}

export function hiddenGems(kind: Kind) {
  return listed()
    .filter((m) => m.kind === kind && m.score >= 80)
    .sort((a, b) => a.popularity - b.popularity)
    .slice(0, 14);
}

export function newest(kind: Kind) {
  return listed()
    .filter((m) => m.kind === kind)
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || b.popularity - a.popularity)
    .slice(0, 16);
}

export function topRated(kind: Kind, n = 10) {
  return listed()
    .filter((m) => m.kind === kind && m.score > 0)
    .sort((a, b) => b.score - a.score || b.popularity - a.popularity)
    .slice(0, n);
}

export function schedule(kind: Kind) {
  const now = Date.now() / 1000;
  return listed()
    .filter((m) => m.kind === kind && m.nextAiring && m.nextAiring.at > now - 60 * 60)
    .sort((a, b) => (a.nextAiring?.at ?? 0) - (b.nextAiring?.at ?? 0));
}

export function recsFor(item: Media) {
  const map = byIdAll();
  const out: Media[] = [];
  for (const id of item.recs) {
    const hit = map.get(id);
    if (hit && !hit.hidden && hit.id !== item.id) out.push(hit);
  }
  if (out.length < 8) {
    for (const other of listed()) {
      if (out.length >= 12) break;
      if (other.id === item.id || other.kind !== item.kind) continue;
      if (out.some((o) => o.id === other.id)) continue;
      if (other.genres.some((g) => item.genres.includes(g))) out.push(other);
    }
  }
  return out.slice(0, 12);
}

export function randomMedia(kind: Kind) {
  const pool = listed().filter((m) => m.kind === kind);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function inCatalog(id: number) {
  const item = byIdAll().get(id);
  return !!item && !item.hidden;
}

export function blankMedia(kind: Kind): Media {
  const id = Date.now();
  return {
    id,
    kind,
    title: kind === "MANGA" ? "Untitled manga" : "Untitled anime",
    romaji: "",
    native: "",
    synopsis: "",
    cover: "/art/swords.jpg",
    banner: null,
    color: null,
    score: 0,
    year: new Date().getFullYear(),
    season: null,
    format: kind === "MANGA" ? "MANGA" : "TV",
    episodes: kind === "MANGA" ? null : 12,
    chapters: kind === "MANGA" ? 12 : null,
    duration: kind === "MANGA" ? null : 24,
    status: "RELEASING",
    genres: [],
    studio: null,
    trailer: null,
    popularity: 0,
    nextAiring: null,
    relations: [],
    recs: [],
    episodeList: [],
    sources: [],
    embedHtml: null,
    hidden: false,
  };
}
