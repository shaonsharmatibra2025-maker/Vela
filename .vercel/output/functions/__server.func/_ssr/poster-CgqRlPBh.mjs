import { o as __toESM } from "../_runtime.mjs";
import { w as statusLabel, x as runLabel, y as formatLabel } from "./router-Dy9R8Kiq.mjs";
import { t as cn } from "./cn-2gCmG5_y.mjs";
import { t as Score } from "./chrome-C7ZFGRgf.mjs";
import { J as require_react, S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/poster-CgqRlPBh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Poster({ media, className }) {
	const cardRef = (0, import_react.useRef)(null);
	const [box, setBox] = (0, import_react.useState)(null);
	const [deep, setDeep] = (0, import_react.useState)(false);
	const fine = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		fine.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
	}, []);
	(0, import_react.useEffect)(() => {
		if (!box) return;
		const t = window.setTimeout(() => setDeep(true), 650);
		return () => window.clearTimeout(t);
	}, [box]);
	const still = deep && media.trailer ? `https://i.ytimg.com/vi/${media.trailer}/hqdefault.jpg` : media.banner || media.cover;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		ref: cardRef,
		to: "/title/$id",
		params: { id: String(media.id) },
		className: cn("group relative block overflow-hidden rounded-xl bg-surface", className),
		onMouseEnter: () => {
			if (!fine.current || !cardRef.current) return;
			const rect = cardRef.current.getBoundingClientRect();
			const width = 288;
			let left = rect.right + 10;
			if (left + width > window.innerWidth - 8) left = rect.left - width - 10;
			left = Math.max(8, left);
			const top = Math.min(Math.max(8, rect.top), window.innerHeight - 300);
			setDeep(false);
			setBox({
				top,
				left
			});
		},
		onMouseLeave: () => setBox(null),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-poster overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: media.cover,
					alt: "",
					loading: "lazy",
					className: "poster-still h-full w-full object-cover transition duration-300 motion-safe:group-hover:scale-105"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/75 to-transparent px-2 pt-12 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-semibold text-fg",
					children: media.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-micro text-muted",
					children: [
						formatLabel(media.format),
						" · ",
						media.year ?? "—"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-2 left-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, { value: media.score })
			}),
			media.status === "RELEASING" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-2 right-2 rounded-md bg-accent px-1.5 py-0.5 text-micro font-semibold text-accent-ink",
				children: "Airing"
			})
		]
	}), box && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none fixed z-50 hidden w-72 overflow-hidden rounded-xl border border-line bg-raised shadow-2xl md:block",
		style: {
			top: box.top,
			left: box.left
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-36",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: still,
				alt: "",
				className: "h-full w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-raised to-transparent" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-fg",
					children: media.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-micro text-muted",
					children: [
						media.year ?? "—",
						" · ",
						formatLabel(media.format),
						" · ",
						runLabel(media)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, { value: media.score }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-micro tracking-wide text-muted uppercase",
						children: statusLabel(media.status)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1",
					children: media.genres.slice(0, 4).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-surface px-2 py-0.5 text-micro text-muted",
						children: g
					}, g))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-micro text-faint",
					children: deep ? "Trailer still" : "Hold for a trailer still"
				})
			]
		})]
	})] });
}
function Rail({ title, items, action }) {
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: title
			}), action]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "scroller flex w-full min-w-0 gap-3 overflow-x-auto pb-2",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-36 shrink-0 sm:w-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Poster, { media: item })
			}, item.id))
		})]
	});
}
export { Rail as n, Poster as t };
