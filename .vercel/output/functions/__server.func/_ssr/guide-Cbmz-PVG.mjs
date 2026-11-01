import { n as Shell } from "./chrome-C7ZFGRgf.mjs";
import { t as discoverSearch } from "./search-DxquROhY.mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/guide-Cbmz-PVG.js
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	{
		id: "move",
		title: "Move around"
	},
	{
		id: "find",
		title: "Find a title"
	},
	{
		id: "open",
		title: "Open a title"
	},
	{
		id: "watch",
		title: "Watch"
	},
	{
		id: "yours",
		title: "Your list and notes"
	},
	{
		id: "look",
		title: "Look and schedule"
	},
	{
		id: "phone",
		title: "On a phone"
	},
	{
		id: "limits",
		title: "What it does not do"
	}
];
function Guide() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-micro tracking-widest text-faint uppercase",
				children: "Vela"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl font-bold",
				children: "How to use the site"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
				children: "The shelf, the player, and every control a visitor can reach. Follows, notes, and the look stay in this browser. They are not uploaded."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "On this page",
				className: "mt-6 flex flex-wrap gap-2",
				children: STEPS.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `#${step.id}`,
					className: "inline-flex h-11 items-center rounded-full border border-line px-3 text-sm text-muted hover:text-fg",
					children: step.title
				}, step.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "move",
						title: "Move around",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"The word ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "font-semibold text-fg",
									children: "Vela"
								}),
								" always returns to the home shelf. On a wide screen the header lists Home, Genres, Schedule, and How to use. On a phone those sit behind ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "font-semibold text-fg",
									children: "Menu"
								}),
								"."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The Anime / Manga switch in the header flips the whole shelf. Search, rows, and the schedule follow whichever side is on." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The search field in the header (or inside Menu) opens Genres with that word already filled in." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The bar along the bottom is the quick dock. On a wide screen it is Back, Forward, Home, your list, and this guide. On a phone it is Home, Browse, Search, List, and Guide." })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Links, { items: [{
								label: "Home",
								to: "/browse"
							}] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "find",
						title: "Find a title",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Home is the shelf. The banner can be searched, filtered, or skipped with Surprise, which opens a random title on the current side." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The dots under the banner step through the featured titles chosen for the shelf." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Continue shows the last episode you opened. Your list is everything you followed." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Airing next and Top of the shelf sit beside recent notes. Genre tiles and the rows underneath jump into Genres." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Genres filters by name, genre, format, status, and score. Switch Grid or List, and flip Popular or Top rated. Pages sit at the bottom." })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Links, { items: [{
								label: "Home",
								to: "/browse"
							}, {
								label: "Genres",
								to: "/discover"
							}] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "open",
						title: "Open a title",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A poster opens the title page. The chips under the name are year, format, length, and status. Genre names are links." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Watch, or Continue if you already opened an episode, starts playback. Manga uses Open instead of Watch." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Follow, or the heart on the cover, keeps the title on Home under Your list. Tap again to drop it." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Random jumps to another title on the same side. Share copies the page address." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The tabs are Overview, Episodes, Trailer, and More like this. An episode row opens that episode." })
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "watch",
						title: "Watch",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The player uses the source saved on that episode. The line under the picture says which one: YouTube, a video file, a still, or an embed. If nothing was saved, it says there is no playable source." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Next episode moves forward. Mark logged writes this episode into Continue." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Focus hides the episode list and the notes so the picture can take the page. Show shelf brings them back." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Left and right arrow keys change episode when you are not typing in a field." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A long series has a Jump menu, thirty episodes at a time." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Back to series returns to the title page. A sequel, when one is on the shelf, sits under the player." })
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "yours",
						title: "Your list and notes",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "These live only in this browser. Clearing site data for Vela removes them." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Follow puts a title on Home under Your list. The bookmark in the dock jumps there." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Continue remembers the last episode you opened or marked." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "On the watch page, ten stars rate that episode. A note sits under the same episode. Set a name if you want one; otherwise it is saved as Guest." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Some titles already show sample notes. Yours are the ones you typed. Hiding a note is not available on the public site." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The welcome page can keep a private note for this device. Nobody else can read it." })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Links, { items: [{
								label: "Your list",
								to: "/browse",
								hash: "list"
							}] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "look",
						title: "Look and schedule",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The look of the shelf is set for everyone. Visitors cannot restyle it, pin the banner, or edit titles." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Night, Ember, Dawn, and Custom are published looks. What you see is the one currently published." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Quieter motion, in the footer, only calms animation on this device." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Schedule lists only episodes that have not aired yet. Times follow this device. Manga often has nothing dated — switch to Anime if the list is empty." })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Links, { items: [{
								label: "Schedule",
								to: "/schedule"
							}] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "phone",
						title: "On a phone",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The header search hides. Open Menu for search and for Home, Genres, Schedule, and How to use." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The bottom dock becomes Home, Browse, Search, List, and Guide." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Rows scroll sideways. Filters on Genres open in a panel so the poster grid can stay narrow." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Focus on the watch page is the easiest way to give the picture the screen." })
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "limits",
						title: "What this site does not do",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "There is no watch-together room and no shared chat. Playback is one person, on this device." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Full episodes are not hosted here unless a source link was added for that title. Most previews are official trailers." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Covers and facts come from the catalog. A score of zero means none was recorded." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "There is no visitor account. A different browser, or a cleared one, starts with an empty list." })
						] })]
					})
				]
			})
		]
	}) });
}
function Section({ id, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id,
		className: "scroll-mt-24 rounded-2xl border border-line bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 space-y-2 text-sm leading-relaxed text-muted [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-4",
			children
		})]
	});
}
function Links({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 flex flex-wrap gap-2",
		children: items.map((link) => link.to === "/discover" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: link.to,
			search: discoverSearch(),
			className: "inline-flex h-11 items-center rounded-full border border-line px-3 text-sm text-fg",
			children: link.label
		}, link.label) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: link.to,
			hash: link.hash,
			className: "inline-flex h-11 items-center rounded-full border border-line px-3 text-sm text-fg",
			children: link.label
		}, link.label))
	});
}
export { Guide as component };
