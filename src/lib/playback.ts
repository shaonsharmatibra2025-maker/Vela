import type { Media, PlaySource, SourceKind } from "@/data/catalog";

export type ResolvedPlay =
  | { type: "youtube"; id: string }
  | { type: "file"; url: string }
  | { type: "image"; url: string }
  | { type: "iframe"; src: string }
  | { type: "none" };

const IMAGE = /\.(png|jpe?g|webp|gif|avif)(\?|#|$)/i;
const FILE = /\.(mp4|webm|ogg|m4v|mov|m3u8)(\?|#|$)/i;

export function youtubeId(input: string) {
  const value = input.trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return url.pathname.slice(1, 12) || null;
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      const parts = url.pathname.split("/");
      const idx = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "live");
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {
    return null;
  }
  return null;
}

function vimeoId(input: string) {
  const match = input.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] ?? null;
}

function drivePreview(input: string) {
  const match = input.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  const open = input.match(/[?&]id=([^&]+)/);
  if (input.includes("drive.google.com") && open) return `https://drive.google.com/file/d/${open[1]}/preview`;
  return null;
}

function dropboxRaw(input: string) {
  if (!input.includes("dropbox.com")) return null;
  try {
    const url = new URL(input);
    url.hostname = "dl.dropboxusercontent.com";
    url.searchParams.delete("dl");
    return url.toString();
  } catch {
    return input.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
  }
}

export function iframeSrcFromEmbed(html: string) {
  const match = html.match(/<iframe\b[^>]*\ssrc=["'](https:\/\/[^"']+)["']/i);
  return match?.[1] ?? null;
}

export function classifyUrl(input: string, fallback: SourceKind = "link"): PlaySource {
  const url = input.trim();
  if (url.startsWith("<")) {
    const src = iframeSrcFromEmbed(url);
    return { kind: "embed", url: src ?? url };
  }
  if (youtubeId(url)) return { kind: "youtube", url };
  if (vimeoId(url)) return { kind: "vimeo", url };
  if (drivePreview(url)) return { kind: "drive", url };
  if (url.includes("dropbox.com")) return { kind: "dropbox", url };
  if (FILE.test(url) || IMAGE.test(url)) return { kind: "file", url };
  return { kind: fallback, url };
}

export function resolveSource(source: PlaySource | null | undefined): ResolvedPlay {
  if (!source?.url?.trim()) return { type: "none" };
  const url = source.url.trim();
  if (source.kind === "embed" || url.startsWith("<")) {
    const src = iframeSrcFromEmbed(url) ?? (url.startsWith("https://") ? url : null);
    return src ? { type: "iframe", src } : { type: "none" };
  }
  if (source.kind === "youtube" || youtubeId(url)) {
    const id = youtubeId(url);
    if (id) return { type: "youtube", id };
  }
  if (source.kind === "vimeo" || vimeoId(url)) {
    const id = vimeoId(url);
    if (id) return { type: "iframe", src: `https://player.vimeo.com/video/${id}` };
  }
  if (source.kind === "drive" || url.includes("drive.google.com")) {
    const src = drivePreview(url);
    if (src) return { type: "iframe", src };
  }
  if (source.kind === "dropbox" || url.includes("dropbox.com")) {
    const raw = dropboxRaw(url) ?? url;
    if (IMAGE.test(raw)) return { type: "image", url: raw };
    return { type: "file", url: raw };
  }
  if (IMAGE.test(url)) return { type: "image", url };
  if (source.kind === "file" || FILE.test(url)) return { type: "file", url };
  if (url.startsWith("https://") || url.startsWith("http://")) return { type: "iframe", src: url };
  return { type: "none" };
}

export function resolvePlayback(media: Media, episode: number): ResolvedPlay {
  const fromEpisode = media.episodeList.find((ep) => ep.n === episode)?.source;
  if (fromEpisode?.url) return resolveSource(fromEpisode);
  const scoped = media.sources?.find((s) => s.episode === episode && s.url);
  if (scoped) return resolveSource(scoped);
  const series = media.sources?.find((s) => !s.episode && s.url);
  if (series) return resolveSource(series);
  if (media.embedHtml) return resolveSource({ kind: "embed", url: media.embedHtml });
  if (media.trailer) return { type: "youtube", id: media.trailer };
  return { type: "none" };
}
