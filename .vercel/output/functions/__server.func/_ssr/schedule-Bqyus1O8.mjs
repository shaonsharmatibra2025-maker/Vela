import { n as Shell, r as useKind } from "./chrome-C7ZFGRgf.mjs";
import { o as When, y as formatLabel } from "./router-Dy9R8Kiq.mjs";
import { y as schedule } from "./catalog-CLOn5NSj.mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/schedule-Bqyus1O8.js
var import_jsx_runtime = require_jsx_runtime();
function SchedulePage() {
	const kind = useKind();
	const rows = schedule(kind);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-micro tracking-widest text-faint uppercase",
				children: kind === "MANGA" ? "Manga" : "Anime"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl font-bold",
				children: "Airing next"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Times follow this device. Only titles with a dated next episode are listed."
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm text-muted",
				children: "Nothing is scheduled on this shelf. Switch to anime if you are on manga."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 divide-y divide-line rounded-2xl border border-line bg-surface",
				children: rows.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/title/$id",
					params: { id: String(item.id) },
					className: "flex items-center gap-3 px-3 py-3 hover:bg-raised",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.cover,
							alt: "",
							className: "h-16 w-11 rounded-lg object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate font-medium",
								children: item.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-micro text-muted",
								children: [
									"Episode ",
									item.nextAiring?.episode,
									" · ",
									formatLabel(item.format)
								]
							})]
						}),
						item.nextAiring && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(When, { at: item.nextAiring.at })
						})
					]
				}) }, item.id))
			})
		]
	}) });
}
export { SchedulePage as component };
