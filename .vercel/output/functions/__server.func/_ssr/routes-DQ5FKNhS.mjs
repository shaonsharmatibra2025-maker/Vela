import { o as __toESM } from "../_runtime.mjs";
import { c as getDoc, m as rail, r as counts } from "./catalog-CLOn5NSj.mjs";
import { t as discoverSearch } from "./search-DxquROhY.mjs";
import { C as solidBtn, b as ghostBtn } from "./router-Dy9R8Kiq.mjs";
import { t as useLibrary } from "./library-l4LIWX3u.mjs";
import { J as require_react, S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Captions, T as Clapperboard, h as MessagesSquare, m as MonitorSmartphone, v as ListChecks, y as Library } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/routes-DQ5FKNhS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAFF = [
	{
		name: "Sable",
		role: "Curator",
		img: "/art/staff-1.jpg",
		on: true
	},
	{
		name: "Ren",
		role: "Scheduler",
		img: "/art/staff-2.jpg",
		on: true
	},
	{
		name: "Ivo",
		role: "Notes",
		img: "/art/staff-3.jpg",
		on: true
	},
	{
		name: "Hana",
		role: "Trailers",
		img: "/art/staff-4.jpg",
		on: true
	},
	{
		name: "Otto",
		role: "Genres",
		img: "/art/staff-5.jpg",
		on: true
	},
	{
		name: "Bea",
		role: "Manga",
		img: "/art/staff-6.jpg",
		on: false
	},
	{
		name: "Noa",
		role: "Shelf",
		img: "/art/staff-7.jpg",
		on: true
	},
	{
		name: "Quill",
		role: "Queue",
		img: "/art/staff-8.jpg",
		on: false
	}
];
function Landing() {
	const landing = getDoc().appearance.landing;
	const stats = counts();
	const titles = rail("popular").slice(0, 18).map((m) => m.title);
	const messages = useLibrary((s) => s.messages);
	const addMessage = useLibrary((s) => s.addMessage);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [sent, setSent] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative min-h-svh",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: landing.image || "/art/swords.jpg",
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-bg/75 via-bg/55 to-bg" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto flex min-h-svh max-w-5xl flex-col px-4 pt-6 pb-16",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "mx-auto flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full border border-line bg-bg/70 p-1 backdrop-blur-md",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-3 font-display text-sm font-extrabold tracking-tight text-accent",
									children: "Vela"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#features",
									className: "rounded-full px-3 py-2 text-sm text-fg",
									children: "Features"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#crew",
									className: "rounded-full px-3 py-2 text-sm text-muted",
									children: "Crew"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#notes",
									className: "rounded-full px-3 py-2 text-sm text-muted",
									children: "Notes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#contact",
									className: "rounded-full px-3 py-2 text-sm text-muted",
									children: "Contact"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/browse",
									className: "rounded-full bg-accent px-3 py-2 text-sm font-semibold text-accent-ink",
									children: "View titles"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 flex-col items-center justify-center text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-micro tracking-widest text-muted uppercase",
									children: [stats.all, " titles in the catalog"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-4 bg-gradient-to-b from-fg to-accent bg-clip-text font-display text-6xl font-extrabold tracking-tight text-transparent sm:text-8xl",
									children: landing.headline || "Vela"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 max-w-md text-lg text-fg",
									children: landing.sub
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-md text-sm text-muted",
									children: "Official trailers, a personal queue, and notes that never leave this browser."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-wrap items-center justify-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/browse",
										className: solidBtn,
										children: "Enter Vela"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/discover",
										search: discoverSearch(),
										className: ghostBtn,
										children: "Browse catalog"
									})]
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden border-y border-line bg-bg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "marquee-track gap-8 py-3 text-sm text-muted",
					children: [...titles, ...titles].map((title, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0",
						children: title
					}, `${title}-${i}`))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-5xl grid-cols-2 gap-3 px-4 py-12 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						n: `${stats.anime}`,
						label: "Anime series"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						n: `${stats.manga}`,
						label: "Manga"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						n: "Zero",
						label: "Paywalls"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						n: `${stats.trailers}`,
						label: "Official trailers"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "features",
				className: "mx-auto max-w-5xl px-4 py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-center font-display text-3xl font-bold",
						children: "Everything you need"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-lg text-center text-sm text-muted",
						children: "Built like a late-night catalog. Here is what is actually on the shelf."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-3 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, { className: "size-4" }),
								title: "Official trailers",
								body: "Press play and the studio trailer runs in the player. Episode picks are your log, not a bootleg."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "size-4" }),
								title: "Queue and continue",
								body: "Follow a title or hit play. The row on the home shelf remembers where you left off."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesSquare, { className: "size-4" }),
								title: "Notes",
								body: "Rate an episode and leave a note. Replies stay with the title, on this device."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "size-4" }),
								title: "Genres and filters",
								body: "Grid or list, score or year, one genre at a time. The shelf is the whole point."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Captions, { className: "size-4" }),
								title: "Anime and manga",
								body: "Switch the catalog from the header. Same posters, same queue."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorSmartphone, { className: "size-4" }),
								title: "This device",
								body: "No account. Your list, notes, and theme stay in this browser."
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "crew",
				className: "mx-auto max-w-5xl px-4 py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-center font-display text-3xl font-bold",
						children: "Who keeps the shelf"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-lg text-center text-sm text-muted",
						children: "The people behind the catalog. A warm dot means they are on tonight."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4",
						children: STAFF.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 rounded-2xl border border-line bg-surface p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: person.img,
								alt: "",
								className: "size-12 rounded-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: person.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1.5 text-micro text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: person.on ? "size-1.5 rounded-full bg-accent" : "size-1.5 rounded-full bg-faint" }), person.role]
								})]
							})]
						}, person.name))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "notes",
				className: "mx-auto max-w-5xl px-4 py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-center font-display text-3xl font-bold",
					children: "What shipped"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-3 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-2xl border border-line bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "Shelf"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-2 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Home rows for the season, the year, and quieter scores" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Hover a poster for the still" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Schedule of what is actually airing" })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-2xl border border-line bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "Personal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-2 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Follow, continue, and a 10-point rating" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Notes under each episode" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A short guide for every control" })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-2xl border border-line bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "Honest limits"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-2 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Trailers only — full episodes stay with the studios" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Covers and facts from AniList" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Your notes and queue stay on this device" })
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-3xl px-4 py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-bold",
						children: "Ready to dive in?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Free, on this device, and already full of titles."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap justify-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/browse",
								className: solidBtn,
								children: "Get started"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/discover",
								search: discoverSearch(),
								className: ghostBtn,
								children: "Browse catalog"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/guide",
								className: "inline-flex h-11 items-center text-sm text-muted hover:text-fg",
								children: "How to use"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "contact",
				className: "mx-auto max-w-xl px-4 pb-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-bold",
						children: "Leave a private note"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "It stays in this browser. Nobody else can read it."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 space-y-3",
						onSubmit: (e) => {
							e.preventDefault();
							const text = draft.trim();
							if (!text) return;
							addMessage(text);
							setDraft("");
							setSent(true);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: draft,
								onChange: (e) => setDraft(e.target.value),
								rows: 4,
								placeholder: "A title to add, a row that feels wrong...",
								className: "w-full resize-none rounded-2xl border border-line bg-surface px-3 py-3 text-sm placeholder:text-faint",
								suppressHydrationWarning: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: solidBtn,
								children: "Keep on this device"
							}),
							sent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									"Kept. ",
									messages.length,
									" note",
									messages.length === 1 ? "" : "s",
									" on this device."
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-line px-4 py-6 text-center text-micro text-faint",
				children: "Vela · trailers via YouTube · metadata via AniList"
			})
		]
	});
}
function Stat({ n, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-line bg-surface px-4 py-5 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl font-extrabold text-accent tabular-nums",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-micro tracking-widest text-faint uppercase",
			children: label
		})]
	});
}
function Feature({ icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-2xl border border-line bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-9 place-items-center rounded-full bg-raised text-accent",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: body
			})
		]
	});
}
export { Landing as component };
