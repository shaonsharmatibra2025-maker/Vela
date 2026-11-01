import { o as __toESM } from "../_runtime.mjs";
import { t as useLibrary } from "./library-l4LIWX3u.mjs";
import { t as discoverSearch } from "./search-DxquROhY.mjs";
import { t as cn } from "./cn-2gCmG5_y.mjs";
import { J as require_react, S as require_jsx_runtime, b as useNavigate, f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as CircleHelp, F as ArrowLeft, M as BookOpen, P as ArrowRight, b as LayoutGrid, i as Tv, j as Bookmark, u as Search, x as House } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/chrome-C7ZFGRgf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var links = [
	{
		to: "/browse",
		label: "Home"
	},
	{
		to: "/discover",
		label: "Genres"
	},
	{
		to: "/schedule",
		label: "Schedule"
	},
	{
		to: "/guide",
		label: "How to use"
	}
];
function AppHeader({ showSearch = true }) {
	const kind = useLibrary((s) => s.kind);
	const setKind = useLibrary((s) => s.setKind);
	const path = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	function goSearch(query) {
		navigate({
			to: "/discover",
			search: discoverSearch({ q: query.trim() })
		});
		setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-screen-2xl flex-wrap items-center gap-3 px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/browse",
					className: "font-display text-xl font-extrabold tracking-tight text-accent",
					children: "Vela"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-1 md:flex",
					children: links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: link.to,
						className: cn("rounded-full px-3 py-2 text-sm text-muted transition-colors duration-200 hover:bg-surface hover:text-fg", path === link.to && "bg-surface text-fg"),
						children: link.label
					}, link.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [
						showSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "relative hidden md:block",
							onSubmit: (e) => {
								e.preventDefault();
								goSearch(q);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search titles",
								className: "h-11 w-52 rounded-full border border-line bg-surface pr-3 pl-9 text-sm text-fg placeholder:text-faint",
								"aria-label": "Search titles"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex rounded-full border border-line bg-surface p-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindButton, {
								active: kind === "ANIME",
								onClick: () => setKind("ANIME"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tv, { className: "size-4" }),
								children: "Anime"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindButton, {
								active: kind === "MANGA",
								onClick: () => setKind("MANGA"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }),
								children: "Manga"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex h-11 items-center rounded-full border border-line px-3 text-sm text-fg md:hidden",
							onClick: () => setOpen((v) => !v),
							"aria-expanded": open,
							children: "Menu"
						})
					]
				}),
				open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full flex-col gap-2 md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							goSearch(q);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search titles",
							className: "h-11 w-full rounded-full border border-line bg-surface px-4 text-sm",
							"aria-label": "Search titles"
						})
					}), links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: link.to,
						className: "rounded-xl px-3 py-3 text-sm text-fg hover:bg-surface",
						onClick: () => setOpen(false),
						children: link.label
					}, link.to))]
				})
			]
		})
	});
}
function KindButton({ active, onClick, children, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm", active ? "bg-accent text-accent-ink" : "text-muted"),
		children: [icon, children]
	});
}
function Footer() {
	const reduceMotion = useLibrary((s) => s.reduceMotion);
	const setReduceMotion = useLibrary((s) => s.setReduceMotion);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-16 border-t border-line pb-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-screen-2xl gap-8 px-4 py-10 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-bold text-accent",
					children: "Vela"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xs text-sm text-muted",
					children: "A night-cinema shelf for anime and manga. Trailers are official. Your queue stays in this browser."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-micro tracking-wide text-faint uppercase",
						children: "Browse"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/discover",
								search: discoverSearch(),
								className: "text-muted hover:text-fg",
								children: "All genres"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/schedule",
								className: "text-muted hover:text-fg",
								children: "Schedule"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/browse",
								className: "text-muted hover:text-fg",
								children: "Home rows"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/guide",
								className: "text-muted hover:text-fg",
								children: "How to use"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-micro tracking-wide text-faint uppercase",
							children: "This device"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 flex items-center gap-3 text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: reduceMotion,
								onChange: (e) => setReduceMotion(e.target.checked),
								className: "size-4 accent-gold"
							}), "Quieter motion"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-muted",
							children: "Your list, notes, and motion stay in this browser. They do not change the shelf for anyone else."
						})
					]
				})
			]
		})
	});
}
function Dock() {
	const path = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		"aria-label": "Quick",
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 px-2 pt-1 pb-2 backdrop-blur-md md:bottom-4 md:mx-auto md:w-fit md:rounded-full md:border md:px-1.5 md:py-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto hidden max-w-md items-center justify-center gap-1 md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockButton, {
					label: "Back",
					onClick: () => window.history.back(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockButton, {
					label: "Forward",
					onClick: () => window.history.forward(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockLink, {
					to: "/browse",
					label: "Home",
					on: path === "/browse",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockLink, {
					to: "/browse",
					hash: "list",
					label: "Watchlist",
					on: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockLink, {
					to: "/guide",
					label: "How to use",
					on: path === "/guide",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "size-4" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-md items-center justify-between md:hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockLink, {
					to: "/browse",
					label: "Home",
					on: path === "/browse",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockLink, {
					to: "/discover",
					label: "Browse",
					on: path === "/discover",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockLink, {
					to: "/discover",
					label: "Search",
					on: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockLink, {
					to: "/browse",
					hash: "list",
					label: "List",
					on: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockLink, {
					to: "/guide",
					label: "Guide",
					on: path === "/guide",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "size-4" })
				})
			]
		})]
	});
}
function DockButton({ label, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		title: label,
		onClick,
		className: "grid size-11 place-items-center rounded-full text-muted hover:bg-surface hover:text-fg",
		children
	});
}
function DockLink({ to, hash, label, on, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		hash,
		search: to === "/discover" ? discoverSearch() : void 0,
		"aria-label": label,
		title: label,
		className: cn("grid size-11 place-items-center rounded-full", on ? "bg-accent text-accent-ink" : "text-muted hover:bg-surface hover:text-fg"),
		children
	});
}
function Shell({ children, showSearch = true }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		window.scrollTo(0, 0);
	}, [path]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, { showSearch }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "page-rise",
				children
			}, path),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dock, {})
		]
	});
}
function Score({ value, className }) {
	if (!value) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-md bg-bg/80 px-1.5 py-0.5 text-micro font-semibold text-gold tabular-nums", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarIcon, {}),
			value,
			"%"
		]
	});
}
function StarIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 20 20",
		className: "size-3 fill-gold",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 1.8 12.4 7l5.6.5-4.2 3.7 1.3 5.5L10 14.2 4.9 16.7 6.2 11.2 2 7.5 7.6 7 10 1.8Z" })
	});
}
function useKind() {
	return useLibrary((s) => s.kind);
}
export { Shell as n, useKind as r, Score as t };
