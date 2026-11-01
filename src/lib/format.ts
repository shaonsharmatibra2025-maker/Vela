import type { Media } from "@/data/catalog";

const FORMATS: Record<string, string> = {
  TV: "TV",
  TV_SHORT: "TV",
  MOVIE: "Movie",
  SPECIAL: "Special",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Music",
  MANGA: "Manga",
  NOVEL: "Novel",
  ONE_SHOT: "One-shot",
};

const STATUSES: Record<string, string> = {
  FINISHED: "Finished",
  RELEASING: "Airing",
  NOT_YET_RELEASED: "Upcoming",
  CANCELLED: "Cancelled",
  HIATUS: "Hiatus",
};

export function formatLabel(format: string) {
  return FORMATS[format] ?? format;
}

export function statusLabel(status: string) {
  return STATUSES[status] ?? status;
}

export function seasonText(media: Media) {
  if (media.season && media.year) {
    const name = media.season.charAt(0) + media.season.slice(1).toLowerCase();
    return `${name} ${media.year}`;
  }
  return media.year ? String(media.year) : "—";
}

export function runLabel(media: Media) {
  if (media.kind === "MANGA") {
    return media.chapters ? `${media.chapters} ch` : "Manga";
  }
  if (media.format === "MOVIE") return media.duration ? `${media.duration} min` : "Movie";
  return media.episodes ? `${media.episodes} eps` : formatLabel(media.format);
}

export function episodeTotal(media: Media) {
  if (media.kind === "MANGA") return media.chapters || media.episodeList.length || 12;
  return media.episodes || media.episodeList.length || 12;
}

export function episodeTitle(media: Media, n: number) {
  const hit = media.episodeList.find((e) => e.n === n);
  if (!hit) return media.kind === "MANGA" ? `Chapter ${n}` : `Episode ${n}`;
  const stripped = hit.title.replace(/^(?:episode|chapter|ep|ch)\s*\d+\s*[-:–—.]\s*/i, "").trim();
  return stripped || hit.title;
}

export function episodeThumb(media: Media, n: number) {
  return media.episodeList.find((e) => e.n === n)?.thumb || media.banner || media.cover;
}

export function ago(ts: number) {
  const s = Math.max(1, (Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const d = Math.floor(s / 86400);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 18) return `${mo}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

export function clock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export const solidBtn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink transition-opacity duration-200 hover:opacity-90";
export const ghostBtn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-fg transition-colors duration-200 hover:bg-raised";
