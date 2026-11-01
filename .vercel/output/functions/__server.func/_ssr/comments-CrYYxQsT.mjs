import { o as __toESM } from "../_runtime.mjs";
import { l as getMedia } from "./catalog-CLOn5NSj.mjs";
import { a as Ago } from "./router-Dy9R8Kiq.mjs";
import { t as useLibrary } from "./library-l4LIWX3u.mjs";
import { t as cn } from "./cn-2gCmG5_y.mjs";
import { J as require_react, S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/comments-CrYYxQsT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAMES = [
	"Kite",
	"Marrow",
	"Sable",
	"Juniper",
	"North",
	"Hana",
	"Reed",
	"Ivy",
	"Soren",
	"Pavel",
	"Noa",
	"Quill"
];
var LINES = [
	"The first episode still has that quiet before everything tips.",
	"Queued the rest after the trailer. The color grade is unfair.",
	"Rewatching slowly this week. The pacing holds up.",
	"Came in for the fight scenes and stayed for the quiet ones.",
	"Soundtrack is doing more work than the dialogue, in a good way.",
	"Marked this one and left it. Dangerous habit.",
	"The city shots in the opening are the whole mood.",
	"Not what I expected from the poster, which is a compliment.",
	"Episode two is where it actually starts, for me.",
	"Taking notes in the margins like it's homework.",
	"The side characters are stealing this.",
	"Official trailer does not prepare you for the silence."
];
var BASE = 172e10;
function seededNotes(mediaId) {
	const count = 4 + mediaId % 4;
	const notes = [];
	for (let i = 0; i < count; i++) notes.push({
		id: `seed-${mediaId}-${i}`,
		mediaId,
		episode: (mediaId + i) % 6 + 1,
		name: NAMES[(mediaId + i * 3) % NAMES.length] ?? "Guest",
		text: LINES[(mediaId * 5 + i * 7) % LINES.length] ?? LINES[0],
		rating: 6 + (mediaId + i) % 5,
		at: BASE - (mediaId % 40 + i * 5) * 864e5
	});
	return notes;
}
function threadFor(mediaId, userNotes, episode) {
	const seeds = seededNotes(mediaId);
	return [...userNotes.filter((n) => n.mediaId === mediaId && (episode == null || n.episode === episode || n.episode === 0)), ...seeds].sort((a, b) => b.at - a.at);
}
function Stars({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex gap-0.5",
		role: onChange ? "radiogroup" : void 0,
		"aria-label": "Rating",
		children: Array.from({ length: 10 }, (_, i) => {
			const n = i + 1;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: !onChange,
				onClick: () => onChange?.(n),
				className: cn("text-sm leading-none", n <= value ? "text-gold" : "text-faint", !onChange && "cursor-default"),
				"aria-label": `${n} out of 10`,
				children: "★"
			}, n);
		})
	});
}
function Comments({ mediaId, episode }) {
	const notes = useLibrary((s) => s.notes);
	const hiddenNotes = useLibrary((s) => s.hiddenNotes);
	const addNote = useLibrary((s) => s.addNote);
	const nick = useLibrary((s) => s.nick);
	const setNick = useLibrary((s) => s.setNick);
	const ratingKey = `${mediaId}:${episode}`;
	const rating = useLibrary((s) => s.ratings[ratingKey] ?? 0);
	const setRating = useLibrary((s) => s.setRating);
	const [text, setText] = (0, import_react.useState)("");
	const [replyTo, setReplyTo] = (0, import_react.useState)(null);
	const rows = threadFor(mediaId, notes, episode).filter((row) => !hiddenNotes.includes(row.id));
	const replyName = rows.find((r) => r.id === replyTo)?.name;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-lg font-semibold",
				children: [
					"Notes (",
					rows.length,
					")"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Rate this episode"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
					value: rating,
					onChange: (n) => setRating(ratingKey, n)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 rounded-2xl border border-line bg-surface p-3",
				onSubmit: (e) => {
					e.preventDefault();
					const body = text.trim();
					if (!body) return;
					addNote({
						mediaId,
						episode,
						name: nick || "Guest",
						text: replyName ? `@${replyName} ${body}` : body,
						rating,
						parentId: replyTo ?? void 0
					});
					setText("");
					setReplyTo(null);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-micro text-faint",
						children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: nick,
							onChange: (e) => setNick(e.target.value),
							className: "mt-1 h-11 w-full rounded-xl border border-line bg-bg px-3 text-sm text-fg",
							maxLength: 24
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-micro text-faint",
						children: [replyTo ? `Reply to ${replyName}` : "Your note", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: text,
							onChange: (e) => setText(e.target.value),
							rows: 3,
							placeholder: "What stayed with you?",
							className: "mt-1 w-full resize-none rounded-xl border border-line bg-bg px-3 py-2 text-sm text-fg placeholder:text-faint"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-between gap-3",
						children: [replyTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-muted",
							onClick: () => setReplyTo(null),
							children: "Cancel reply"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "h-11 rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink",
							children: "Post note"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-4",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cn("flex gap-3", row.parentId && "ml-8"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-raised text-micro font-semibold text-accent",
						children: row.name.slice(0, 1)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: row.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-micro text-faint",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ago, { at: row.at })
								}),
								row.rating > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 text-micro text-accent tabular-nums",
									children: [row.rating, "/10"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: row.text
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-1 text-micro text-faint hover:text-fg",
							onClick: () => setReplyTo(row.id),
							children: "Reply"
						})
					] })]
				}, row.id))
			})
		]
	});
}
function RecentNotes({ ids }) {
	const rows = [...useLibrary((s) => s.notes), ...ids.flatMap((id) => seededNotes(id).slice(0, 1))].sort((a, b) => b.at - a.at).slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-line",
		children: rows.map((row) => {
			const media = getMedia(row.mediaId);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-3 py-3",
				children: [media && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/title/$id",
					params: { id: String(media.id) },
					className: "shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: media.cover,
						alt: "",
						className: "h-14 w-10 rounded-md object-cover"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: media?.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: row.name
								}),
								" · ",
								row.text
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-micro text-faint",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ago, { at: row.at })
						})
					]
				})]
			}, row.id);
		})
	});
}
export { RecentNotes as n, Comments as t };
