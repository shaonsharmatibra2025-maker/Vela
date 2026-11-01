import { o as __toESM } from "../_runtime.mjs";
import { n as Shell, r as useKind, t as Score } from "./chrome-C7ZFGRgf.mjs";
import { t as Poster } from "./poster-CgqRlPBh.mjs";
import { a as filterMedia, i as facetValues, s as genreCounts } from "./catalog-CLOn5NSj.mjs";
import { i as Route$4, w as statusLabel, x as runLabel, y as formatLabel } from "./router-Dy9R8Kiq.mjs";
import { t as discoverSearch } from "./search-DxquROhY.mjs";
import { t as cn } from "./cn-2gCmG5_y.mjs";
import { J as require_react, S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as ChevronRight, O as ChevronLeft, _ as List, b as LayoutGrid, s as SlidersHorizontal } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/discover-Clg9ZgrV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE = 20;
function Discover() {
	const search = Route$4.useSearch();
	const kind = useKind();
	const items = filterMedia({
		kind,
		q: search.q,
		genre: search.genre,
		format: search.format,
		status: search.status,
		sort: search.sort
	});
	const pages = Math.max(1, Math.ceil(items.length / PAGE));
	const page = Math.min(search.page, pages);
	const slice = items.slice((page - 1) * PAGE, page * PAGE);
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	const noun = kind === "MANGA" ? "Manga" : "Anime";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-screen-2xl px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-micro tracking-widest text-faint uppercase",
				children: [noun, " genres"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold",
					children: search.genre || `All ${noun}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						"Showing ",
						slice.length,
						" of ",
						items.length,
						search.q ? ` for “${search.q}”` : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex rounded-full border border-line bg-surface p-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewLink, {
								search,
								view: "grid",
								label: "Grid",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewLink, {
								search,
								view: "list",
								label: "List",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/discover",
							search: discoverSearch({
								...search,
								sort: search.sort === "score" ? "popular" : "score",
								page: 1
							}),
							className: cn("inline-flex h-11 items-center rounded-full border px-4 text-sm", search.sort === "score" ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface text-fg"),
							children: search.sort === "score" ? "Top rated" : "Popular"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setFiltersOpen((v) => !v),
							className: "inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4" }), "Filters"]
						})
					]
				})]
			}),
			filtersOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filters, {
				search,
				kind,
				onClose: () => setFiltersOpen(false)
			}),
			slice.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-semibold",
						children: "Nothing on this shelf"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Clear a filter or try another word."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/discover",
						search: discoverSearch({ view: search.view }),
						className: "mt-4 inline-flex h-11 items-center text-sm text-accent",
						children: "Reset filters"
					})
				]
			}) : search.view === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-3",
				children: slice.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/title/$id",
					params: { id: String(item.id) },
					className: "flex gap-3 rounded-2xl border border-line bg-surface p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.cover,
						alt: "",
						className: "h-28 w-20 rounded-xl object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 py-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-semibold",
									children: item.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, { value: item.score })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-micro text-muted",
								children: [
									formatLabel(item.format),
									" · ",
									item.year ?? "—",
									" · ",
									runLabel(item),
									" · ",
									statusLabel(item.status)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 line-clamp-2 text-sm text-muted",
								children: item.synopsis
							})
						]
					})]
				}) }, item.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8",
				children: slice.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Poster, { media: item }, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
				page,
				pages,
				search
			})
		]
	}) });
}
function ViewLink({ search, view, label, icon }) {
	const on = search.view === view;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/discover",
		search: discoverSearch({
			...search,
			view,
			page: 1
		}),
		className: cn("inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm", on ? "bg-accent text-accent-ink" : "text-muted"),
		children: [icon, label]
	});
}
function Filters({ search, kind, onClose }) {
	const [genre, setGenre] = (0, import_react.useState)(search.genre);
	const [format, setFormat] = (0, import_react.useState)(search.format);
	const [status, setStatus] = (0, import_react.useState)(search.status);
	const [sort, setSort] = (0, import_react.useState)(search.sort);
	const genres = genreCounts(kind);
	const formats = facetValues(kind, "format");
	const statuses = facetValues(kind, "status");
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-4 rounded-2xl border border-line bg-surface p-4",
		onSubmit: (e) => {
			e.preventDefault();
			navigate({
				to: "/discover",
				search: discoverSearch({
					...search,
					genre,
					format,
					status,
					sort,
					page: 1
				})
			});
			onClose();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSet, {
				label: "Genre",
				value: genre,
				onChange: setGenre,
				options: genres.map(([name]) => ({
					id: name,
					label: name
				}))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSet, {
						label: "Format",
						value: format,
						onChange: setFormat,
						options: formats.map((id) => ({
							id,
							label: formatLabel(id)
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSet, {
						label: "Status",
						value: status,
						onChange: setStatus,
						options: statuses.map((id) => ({
							id,
							label: statusLabel(id)
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSet, {
						label: "Sort",
						value: sort,
						onChange: setSort,
						allowEmpty: false,
						options: [
							{
								id: "popular",
								label: "Popular"
							},
							{
								id: "score",
								label: "Score"
							},
							{
								id: "year",
								label: "Year"
							},
							{
								id: "title",
								label: "Title"
							}
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				className: "h-11 rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink",
				children: "Apply"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/discover",
				search: discoverSearch({ view: search.view }),
				className: "inline-flex h-11 items-center px-3 text-sm text-muted",
				onClick: onClose,
				children: "Clear"
			})]
		})]
	});
}
function ChipSet({ label, value, onChange, options, allowEmpty = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
		className: "text-micro tracking-widest text-faint uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex flex-wrap gap-2",
		children: [allowEmpty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			on: value === "",
			onClick: () => onChange(""),
			children: "Any"
		}), options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			on: value === opt.id,
			onClick: () => onChange(opt.id),
			children: opt.label
		}, opt.id))]
	})] });
}
function Chip({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-11 rounded-full border px-3 text-sm", on ? "border-accent bg-accent text-accent-ink" : "border-line text-muted"),
		children
	});
}
function Pager({ page, pages, search }) {
	if (pages <= 1) return null;
	const list = [.../* @__PURE__ */ new Set([
		1,
		pages,
		page - 1,
		page,
		page + 1
	])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "mt-8 flex flex-wrap items-center justify-center gap-2",
		"aria-label": "Pages",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageLink, {
				search,
				page: Math.max(1, page - 1),
				disabled: page === 1,
				label: "Previous",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
			}),
			list.map((n, i) => {
				const prev = list[i - 1];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [prev && n - prev > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-faint",
						children: "…"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/discover",
						search: discoverSearch({
							...search,
							page: n
						}),
						className: cn("grid size-11 place-items-center rounded-xl border text-sm tabular-nums", n === page ? "border-accent bg-accent text-accent-ink" : "border-line text-muted"),
						children: n
					})]
				}, n);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageLink, {
				search,
				page: Math.min(pages, page + 1),
				disabled: page === pages,
				label: "Next",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
			})
		]
	});
}
function PageLink({ search, page, disabled, label, children }) {
	if (disabled) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex h-11 items-center gap-1 px-2 text-sm text-faint",
		children: [children, label]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/discover",
		search: discoverSearch({
			...search,
			page
		}),
		className: "inline-flex h-11 items-center gap-1 px-2 text-sm text-fg",
		children: [children, label]
	});
}
export { Discover as component };
