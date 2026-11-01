export type DiscoverSearch = {
  page: number;
  genre: string;
  format: string;
  status: string;
  sort: string;
  q: string;
  view: "grid" | "list";
};

export function discoverSearch(partial: Partial<DiscoverSearch> = {}): DiscoverSearch {
  return {
    page: 1,
    genre: "",
    format: "",
    status: "",
    sort: "popular",
    q: "",
    view: "grid",
    ...partial,
  };
}

export function readDiscoverSearch(search: Record<string, unknown>): DiscoverSearch {
  const page = Number(search.page);
  const view = search.view === "list" ? "list" : "grid";
  const sort = typeof search.sort === "string" ? search.sort : "popular";
  return discoverSearch({
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
    genre: typeof search.genre === "string" ? search.genre : "",
    format: typeof search.format === "string" ? search.format : "",
    status: typeof search.status === "string" ? search.status : "",
    sort: ["popular", "score", "year", "title"].includes(sort) ? sort : "popular",
    q: typeof search.q === "string" ? search.q : "",
    view,
  });
}

export type WatchSearch = { ep: number };

export function readWatchSearch(search: Record<string, unknown>): WatchSearch {
  const ep = Number(search.ep);
  return { ep: Number.isFinite(ep) && ep > 0 ? Math.floor(ep) : 1 };
}
