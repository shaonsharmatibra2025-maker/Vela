import type { Kind, Media } from "@/data/catalog";

export type ThemeName = "night" | "ember" | "dawn" | "custom";

export type SourceKind = "youtube" | "vimeo" | "file" | "drive" | "dropbox" | "embed" | "link";

export type PlaySource = {
  kind: SourceKind;
  url: string;
  label?: string;
  episode?: number | null;
};

export type RailMode = "ids" | "gems" | "newest" | "top";

export type RailDef = {
  id: string;
  title: string;
  kind: Kind | "ANY";
  hidden: boolean;
  mode: RailMode;
  ids: number[];
};

export type SectionId = "hero" | "continue" | "list" | "notes" | "airing" | "rails" | "genres";

export type SectionDef = { id: SectionId; enabled: boolean };

export type Palette = {
  bg: string;
  surface: string;
  raised: string;
  fg: string;
  muted: string;
  faint: string;
  line: string;
  accent: string;
  accentInk: string;
  gold: string;
};

export type Appearance = {
  preset: ThemeName;
  colors: Palette;
  fontSans: string;
  fontDisplay: string;
  effects: {
    marquee: boolean;
    posterLift: boolean;
    heroFade: boolean;
    pageFade: boolean;
    press: boolean;
  };
  landing: {
    kicker: string;
    headline: string;
    sub: string;
    image: string;
  };
};

export type HeroConfig = {
  animeIds: number[];
  mangaIds: number[];
  rotate: boolean;
  intervalMs: number;
};

export type SiteDoc = {
  media: Media[];
  rails: RailDef[];
  legacyRails: Record<string, number[]>;
  sections: SectionDef[];
  appearance: Appearance;
  hero: HeroConfig;
  revision: number;
  updatedAt: number;
};

export const SECTION_IDS: SectionId[] = ["hero", "continue", "list", "notes", "airing", "rails", "genres"];

export const CUSTOM_PALETTE: Palette = {
  bg: "#0c1218",
  surface: "#141c26",
  raised: "#1c2733",
  fg: "#e7eef6",
  muted: "#93a4b8",
  faint: "#6d7f93",
  line: "#2a3a4c",
  accent: "#d5e6f5",
  accentInk: "#101820",
  gold: "#e4c15a",
};

export function defaultAppearance(): Appearance {
  return {
    preset: "night",
    colors: { ...CUSTOM_PALETTE },
    fontSans: "Outfit",
    fontDisplay: "Syne",
    effects: { marquee: true, posterLift: true, heroFade: true, pageFade: true, press: true },
    landing: {
      kicker: "",
      headline: "Vela",
      sub: "The anime and manga catalog that stays free and beautiful.",
      image: "/art/swords.jpg",
    },
  };
}

export function defaultSections(): SectionDef[] {
  return SECTION_IDS.map((id) => ({ id, enabled: true }));
}

export function defaultHero(): HeroConfig {
  return { animeIds: [], mangaIds: [], rotate: true, intervalMs: 7000 };
}

const RAIL_TITLES: Record<string, { title: string; kind: Kind | "ANY" }> = {
  popular: { title: "Popular", kind: "ANIME" },
  trending: { title: "Trending", kind: "ANIME" },
  score: { title: "Top rated", kind: "ANIME" },
  season: { title: "This season", kind: "ANIME" },
  next: { title: "Next season", kind: "ANIME" },
  year: { title: "Top this year", kind: "ANIME" },
  airing: { title: "Airing now", kind: "ANIME" },
  manga: { title: "Popular manga", kind: "MANGA" },
  mangaScore: { title: "Top rated", kind: "MANGA" },
};

const SHOWN = new Set(["trending", "season", "next", "year", "airing", "manga", "mangaScore"]);

export function railsFromLegacy(legacy: Record<string, number[]>): RailDef[] {
  const order = ["trending", "season", "next", "year", "airing", "popular", "score", "manga", "mangaScore"];
  const rails: RailDef[] = [];
  for (const id of order) {
    if (!legacy[id]) continue;
    const meta = RAIL_TITLES[id] ?? { title: id, kind: "ANY" as const };
    rails.push({
      id,
      title: meta.title,
      kind: meta.kind,
      hidden: !SHOWN.has(id),
      mode: "ids",
      ids: [...legacy[id]],
    });
  }
  rails.push(
    { id: "gems-anime", title: "Quieter scores", kind: "ANIME", hidden: false, mode: "gems", ids: [] },
    { id: "new-anime", title: "Newer on the shelf", kind: "ANIME", hidden: false, mode: "newest", ids: [] },
    { id: "gems-manga", title: "Quieter scores", kind: "MANGA", hidden: false, mode: "gems", ids: [] },
    { id: "new-manga", title: "Newer on the shelf", kind: "MANGA", hidden: false, mode: "newest", ids: [] },
  );
  return rails;
}

export function fontStack(name: string, display = false) {
  if (display) return `"${name}", "Outfit", ui-sans-serif, system-ui, sans-serif`;
  return `"${name}", ui-sans-serif, system-ui, sans-serif`;
}

export function normalizeDoc(input: Partial<SiteDoc> | null | undefined, fallback: SiteDoc): SiteDoc {
  if (!input || !Array.isArray(input.media)) return fallback;
  const appearance = {
    ...defaultAppearance(),
    ...(input.appearance ?? {}),
    colors: { ...CUSTOM_PALETTE, ...(input.appearance?.colors ?? {}) },
    effects: { ...defaultAppearance().effects, ...(input.appearance?.effects ?? {}) },
    landing: { ...defaultAppearance().landing, ...(input.appearance?.landing ?? {}) },
  };
  const sections = defaultSections().map((section) => {
    const hit = input.sections?.find((s) => s.id === section.id);
    return hit ? { id: section.id, enabled: hit.enabled !== false } : section;
  });
  const rails = Array.isArray(input.rails) && input.rails.length ? input.rails.map(cleanRail) : fallback.rails;
  return {
    media: input.media.filter((m) => m && (m.kind === "ANIME" || m.kind === "MANGA") && typeof m.id === "number" && typeof m.title === "string"),
    rails,
    legacyRails: input.legacyRails ?? fallback.legacyRails,
    sections,
    appearance,
    hero: {
      ...defaultHero(),
      ...(input.hero ?? {}),
      animeIds: Array.isArray(input.hero?.animeIds) ? input.hero.animeIds.filter((n) => typeof n === "number") : [],
      mangaIds: Array.isArray(input.hero?.mangaIds) ? input.hero.mangaIds.filter((n) => typeof n === "number") : [],
    },
    revision: typeof input.revision === "number" ? input.revision : 0,
    updatedAt: typeof input.updatedAt === "number" ? input.updatedAt : 0,
  };
}

function cleanRail(rail: RailDef): RailDef {
  return {
    id: String(rail.id || "rail"),
    title: String(rail.title || "Row"),
    kind: rail.kind === "MANGA" || rail.kind === "ANY" ? rail.kind : "ANIME",
    hidden: !!rail.hidden,
    mode: rail.mode === "gems" || rail.mode === "newest" || rail.mode === "top" ? rail.mode : "ids",
    ids: Array.isArray(rail.ids) ? rail.ids.filter((n) => typeof n === "number") : [],
  };
}
