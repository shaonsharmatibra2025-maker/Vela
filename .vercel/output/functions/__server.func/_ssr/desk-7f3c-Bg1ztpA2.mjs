import { o as __toESM } from "../_runtime.mjs";
import { c as getDoc, n as commitDoc, o as fontStack, t as blankMedia, v as replaceDoc, x as subscribeCatalog } from "./catalog-CLOn5NSj.mjs";
import { t as classifyUrl } from "./playback-BYoMXVf0.mjs";
import { c as currentToken, d as rememberSession, f as saveSite, l as currentUser, m as unlockDesk, p as setDeskPassword, s as clearToken, u as deskIdentity } from "./router-Dy9R8Kiq.mjs";
import { t as useLibrary } from "./library-l4LIWX3u.mjs";
import { t as cn } from "./cn-2gCmG5_y.mjs";
import { J as require_react, S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Eye, I as ArrowDown, N as ArrowUp, d as Plus, o as Trash2, w as EyeOff } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/desk-7f3c-Bg1ztpA2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	"Library",
	"Edit",
	"Rows",
	"Home",
	"Look",
	"Login"
];
var inputCls = "h-11 w-full rounded-xl border border-line bg-bg px-3 text-sm text-fg placeholder:text-faint";
var areaCls = "w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-fg placeholder:text-faint";
function useDoc() {
	return (0, import_react.useSyncExternalStore)(subscribeCatalog, getDoc, getDoc);
}
async function pushDoc(docText) {
	const token = currentToken();
	if (!token) return {
		ok: false,
		error: "locked"
	};
	return saveSite({ data: {
		token,
		doc: docText
	} });
}
var pendingDoc = null;
var publishTimer = 0;
function publish(mutator) {
	const next = structuredClone(pendingDoc ?? getDoc());
	mutator(next);
	if (!pendingDoc) next.revision = getDoc().revision + 1;
	pendingDoc = next;
	replaceDoc(next);
	window.clearTimeout(publishTimer);
	publishTimer = window.setTimeout(() => {
		if (!pendingDoc) return;
		const stamped = commitDoc(pendingDoc);
		pendingDoc = null;
		pushDoc(JSON.stringify(stamped)).then((res) => {
			if (!res.ok && res.error === "locked") clearToken();
		});
	}, 400);
	return Promise.resolve({
		ok: true,
		error: void 0
	});
}
function DeskApp() {
	const [token, setToken] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setToken(currentToken());
		setUser(currentUser());
		setReady(true);
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-svh place-items-center bg-bg text-muted",
		children: "Opening the desk…"
	});
	if (!token) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { onUnlock: (next, username) => {
		setToken(next);
		setUser(username);
	} });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		user,
		onUser: setUser,
		onLock: () => {
			clearToken();
			setToken(null);
			setUser(null);
		}
	});
}
function Lock({ onUnlock }) {
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [show, setShow] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-svh place-items-center bg-bg px-4 py-10 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "w-full max-w-sm rounded-3xl border border-line bg-surface p-6 sm:p-8",
			onSubmit: (e) => {
				e.preventDefault();
				setBusy(true);
				setError("");
				unlockDesk({ data: {
					username: username.trim(),
					password
				} }).then((res) => {
					if (!res.ok) {
						setError("That username or password is wrong.");
						return;
					}
					rememberSession(res.token, res.username);
					onUnlock(res.token, res.username);
				}).catch(() => setError("The desk could not be reached.")).finally(() => setBusy(false));
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-sm font-extrabold tracking-widest text-gold",
					children: "VELA"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl font-bold leading-none",
					children: "Sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: "Private desk. Nothing on the public site links here. Only a signed-in admin can change the shelf."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-6 block text-micro font-semibold uppercase tracking-widest text-faint",
					htmlFor: "desk-user",
					children: "Username"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "desk-user",
					name: "username",
					value: username,
					onChange: (e) => setUsername(e.target.value),
					autoFocus: true,
					autoComplete: "username",
					spellCheck: false,
					className: "mt-2 h-12 w-full rounded-2xl border border-line bg-bg px-4 text-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-4 block text-micro font-semibold uppercase tracking-widest text-faint",
					htmlFor: "desk-pass",
					children: "Password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "desk-pass",
						name: "password",
						type: show ? "text" : "password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						autoComplete: "current-password",
						className: "h-12 w-full rounded-2xl border border-line bg-bg px-4 pr-12 text-sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute inset-y-0.5 right-0.5 grid size-11 place-items-center rounded-xl text-muted",
						"aria-label": show ? "Hide password" : "Show password",
						onClick: () => setShow((open) => !open),
						children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "mt-3 text-sm text-danger",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: busy || !username.trim() || !password,
					className: "mt-5 h-12 w-full rounded-full bg-accent text-sm font-semibold text-accent-ink disabled:opacity-50",
					children: busy ? "Checking…" : "Sign in"
				})
			]
		})
	});
}
function Panel({ user, onUser, onLock }) {
	const [tab, setTab] = (0, import_react.useState)("Library");
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	function fail(result) {
		if (!result.ok && result.error === "locked") {
			onLock();
			return;
		}
		setNote(result.ok ? "Saved to the shelf." : "Saved on this device. The shared shelf did not update.");
	}
	function run(mutator) {
		publish(mutator).then(fail);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-svh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-5xl items-center gap-3 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-extrabold text-accent",
						children: "Desk"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-micro text-faint",
						children: user ? `Signed in as ${user}` : "Private"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "ml-auto hidden text-sm text-muted sm:block",
						children: note
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/browse",
						className: "inline-flex h-11 items-center rounded-full border border-line px-3 text-sm",
						children: "Close"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex h-11 items-center rounded-full px-3 text-sm text-muted",
						onClick: onLock,
						children: "Lock"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "scroller mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-3",
				children: TABS.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(name),
					className: cn("h-11 shrink-0 rounded-full px-4 text-sm", tab === name ? "bg-accent text-accent-ink" : "bg-surface text-muted"),
					children: name
				}, name))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-5xl px-4 py-6 pb-24",
			children: [
				note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-sm text-muted sm:hidden",
					children: note
				}),
				tab === "Library" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryTab, {
					onEdit: (id) => {
						setEditId(id);
						setTab("Edit");
					},
					onCreate: (kind) => {
						const media = blankMedia(kind);
						run((draft) => {
							draft.media.unshift(media);
						});
						setEditId(media.id);
						setTab("Edit");
					},
					onToggleHidden: (id) => run((draft) => {
						const item = draft.media.find((m) => m.id === id);
						if (item) item.hidden = !item.hidden;
					}),
					onDelete: (id) => run((draft) => {
						draft.media = draft.media.filter((m) => m.id !== id);
						for (const rail of draft.rails) rail.ids = rail.ids.filter((n) => n !== id);
						draft.hero.animeIds = draft.hero.animeIds.filter((n) => n !== id);
						draft.hero.mangaIds = draft.hero.mangaIds.filter((n) => n !== id);
					})
				}),
				tab === "Edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
					editId,
					onSaved: () => setNote("Saved to the shelf."),
					onLocked: onLock
				}),
				tab === "Rows" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowsTab, { run }),
				tab === "Home" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeTab, { run }),
				tab === "Look" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookTab, { run }),
				tab === "Login" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyTab, {
					user,
					onUser,
					onLock,
					onNote: setNote
				})
			]
		})]
	});
}
function LibraryTab({ onEdit, onCreate, onToggleHidden, onDelete }) {
	const doc = useDoc();
	const [q, setQ] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("ALL");
	const [armed, setArmed] = (0, import_react.useState)(null);
	const rows = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return doc.media.filter((m) => {
			if (kind !== "ALL" && m.kind !== kind) return false;
			if (!query) return true;
			return m.title.toLowerCase().includes(query) || (m.studio ?? "").toLowerCase().includes(query) || m.genres.some((g) => g.toLowerCase().includes(query));
		});
	}, [
		doc.media,
		q,
		kind
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search the shelf",
					className: cn(inputCls, "max-w-md flex-1"),
					"aria-label": "Search shelf"
				}),
				[
					"ALL",
					"ANIME",
					"MANGA"
				].map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setKind(name),
					className: cn("h-11 rounded-full px-3 text-sm", kind === name ? "bg-accent text-accent-ink" : "border border-line"),
					children: name === "ALL" ? "All" : name === "ANIME" ? "Anime" : "Manga"
				}, name)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex h-11 items-center gap-1 rounded-full bg-accent px-3 text-sm font-semibold text-accent-ink",
					onClick: () => onCreate("ANIME"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Anime"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex h-11 items-center gap-1 rounded-full border border-line px-3 text-sm",
					onClick: () => onCreate("MANGA"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Manga"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-micro text-faint",
			children: [rows.length, " titles"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line",
			children: rows.slice(0, 80).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-3 bg-surface px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.cover,
						alt: "",
						className: "h-14 w-10 rounded-md object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-micro text-muted",
							children: [
								item.kind === "ANIME" ? "Anime" : "Manga",
								" · ",
								item.year ?? "—",
								" ",
								item.hidden ? "· Hidden" : ""
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center text-muted",
						"aria-label": item.hidden ? "Show title" : "Hide title",
						onClick: () => onToggleHidden(item.id),
						children: item.hidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 rounded-full bg-raised px-3 text-sm",
						onClick: () => onEdit(item.id),
						children: "Edit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center text-danger",
						"aria-label": "Delete title",
						onClick: () => {
							if (armed === item.id) onDelete(item.id);
							else setArmed(item.id);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})
				]
			}, item.id))
		}),
		rows.length > 80 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Showing 80. Narrow the search to see the rest."
		})
	] });
}
function cloneMedia(id) {
	if (!id) return null;
	const found = getDoc().media.find((m) => m.id === id);
	return found ? structuredClone(found) : null;
}
function Editor({ editId, onSaved, onLocked }) {
	const doc = useDoc();
	const [pick, setPick] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(editId);
	const [draft, setDraft] = (0, import_react.useState)(() => cloneMedia(editId));
	const [syncId, setSyncId] = (0, import_react.useState)(editId);
	if (editId && editId !== selected) setSelected(editId);
	if (selected !== syncId) {
		setSyncId(selected);
		const found = selected ? doc.media.find((m) => m.id === selected) : void 0;
		setDraft(found ? structuredClone(found) : null);
	}
	if (!draft) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Choose a title from the library, or search here."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: pick,
			onChange: (e) => setPick(e.target.value),
			placeholder: "Find a title",
			className: cn(inputCls, "mt-3 max-w-md")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line",
			children: doc.media.filter((m) => m.title.toLowerCase().includes(pick.trim().toLowerCase())).slice(0, 12).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex w-full items-center gap-3 bg-surface px-3 py-2 text-left",
				onClick: () => setSelected(item.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: item.cover,
					alt: "",
					className: "h-12 w-8 rounded object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm",
					children: item.title
				})]
			}) }, item.id))
		})
	] });
	const set = (patch) => setDraft({
		...draft,
		...patch
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-4",
		onSubmit: (e) => {
			e.preventDefault();
			const media = {
				...draft,
				genres: draft.genres.map((g) => g.trim()).filter(Boolean)
			};
			publish((docDraft) => {
				const idx = docDraft.media.findIndex((m) => m.id === media.id);
				if (idx >= 0) docDraft.media[idx] = media;
				else docDraft.media.unshift(media);
			}).then((res) => {
				if (!res.ok && res.error === "locked") onLocked();
				else onSaved();
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-[8rem_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: draft.cover || "/art/swords.jpg",
					alt: "",
					className: "h-44 w-32 rounded-2xl border border-line object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputCls,
								value: draft.title,
								onChange: (e) => set({ title: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Kind",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: inputCls,
								value: draft.kind,
								onChange: (e) => set({ kind: e.target.value }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "ANIME",
									children: "Anime"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "MANGA",
									children: "Manga"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Romaji",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputCls,
								value: draft.romaji,
								onChange: (e) => set({ romaji: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Native title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputCls,
								value: draft.native,
								onChange: (e) => set({ native: e.target.value })
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Synopsis",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: areaCls,
					rows: 5,
					value: draft.synopsis,
					onChange: (e) => set({ synopsis: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrlField, {
					label: "Cover / poster",
					value: draft.cover,
					onChange: (cover) => set({ cover })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrlField, {
					label: "Banner",
					value: draft.banner ?? "",
					onChange: (banner) => set({ banner: banner || null })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Genres",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputCls,
							value: draft.genres.join(", "),
							onChange: (e) => set({ genres: e.target.value.split(",").map((g) => g.trim()) }),
							placeholder: "Action, Fantasy"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Score (0–100)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputCls,
							type: "number",
							min: 0,
							max: 100,
							value: draft.score,
							onChange: (e) => set({ score: Number(e.target.value) })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Year",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputCls,
							type: "number",
							value: draft.year ?? "",
							onChange: (e) => set({ year: e.target.value ? Number(e.target.value) : null })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Studio",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputCls,
							value: draft.studio ?? "",
							onChange: (e) => set({ studio: e.target.value || null })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: inputCls,
							value: draft.status,
							onChange: (e) => set({ status: e.target.value }),
							children: [
								"FINISHED",
								"RELEASING",
								"NOT_YET_RELEASED",
								"CANCELLED",
								"HIATUS"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Format",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: inputCls,
							value: draft.format,
							onChange: (e) => set({ format: e.target.value }),
							children: [
								"TV",
								"TV_SHORT",
								"MOVIE",
								"SPECIAL",
								"OVA",
								"ONA",
								"MUSIC",
								"MANGA",
								"NOVEL",
								"ONE_SHOT"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: draft.kind === "MANGA" ? "Chapters" : "Episodes",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputCls,
							type: "number",
							value: draft.kind === "MANGA" ? draft.chapters ?? "" : draft.episodes ?? "",
							onChange: (e) => {
								const n = e.target.value ? Number(e.target.value) : null;
								if (draft.kind === "MANGA") set({ chapters: n });
								else set({ episodes: n });
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Season",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputCls,
							value: draft.season ?? "",
							onChange: (e) => set({ season: e.target.value || null }),
							placeholder: "WINTER"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "YouTube trailer id or URL",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputCls,
							value: draft.trailer ?? "",
							onChange: (e) => set({ trailer: e.target.value.trim() || null })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Next episode number",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputCls,
							type: "number",
							min: 1,
							value: draft.nextAiring?.episode ?? "",
							onChange: (e) => {
								const episode = e.target.value ? Number(e.target.value) : 0;
								if (!episode) {
									set({ nextAiring: draft.nextAiring?.at ? {
										at: draft.nextAiring.at,
										episode: 1
									} : null });
									return;
								}
								set({ nextAiring: {
									at: draft.nextAiring?.at ?? Math.floor(Date.now() / 1e3) + 86400,
									episode
								} });
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Next air time",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputCls,
							type: "datetime-local",
							value: toLocalInput(draft.nextAiring?.at),
							onChange: (e) => {
								const at = fromLocalInput(e.target.value);
								if (!at) {
									set({ nextAiring: null });
									return;
								}
								set({ nextAiring: {
									at,
									episode: draft.nextAiring?.episode || 1
								} });
							}
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: !!draft.hidden,
					onChange: (e) => set({ hidden: e.target.checked }),
					className: "size-4 accent-gold"
				}), "Hidden from public rows and search"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceEditor, {
				sources: draft.sources ?? [],
				onChange: (sources) => set({ sources })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Custom embed code (iframe only)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: areaCls,
					rows: 3,
					value: draft.embedHtml ?? "",
					onChange: (e) => set({ embedHtml: e.target.value || null }),
					placeholder: "<iframe src=\"https://...\"></iframe>"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EpisodeEditor, {
				kind: draft.kind,
				episodes: draft.episodeList,
				onChange: (episodeList) => set({ episodeList })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "h-11 rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink",
					children: "Save title"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/title/$id",
					params: { id: String(draft.id) },
					className: "inline-flex h-11 items-center rounded-full border border-line px-4 text-sm",
					children: "Preview"
				})]
			})
		]
	});
}
function SourceEditor({ sources, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
			className: "text-sm font-semibold",
			children: "Playback links"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Direct video or image, YouTube, Vimeo, Google Drive, Dropbox, or any embeddable https URL. Leave episode blank to use it for the whole series."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 space-y-2",
			children: sources.map((source, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 rounded-2xl border border-line bg-surface p-3 sm:grid-cols-[8rem_1fr_6rem_auto]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: inputCls,
						value: source.kind,
						onChange: (e) => {
							const next = [...sources];
							next[index] = {
								...source,
								kind: e.target.value
							};
							onChange(next);
						},
						children: [
							"youtube",
							"vimeo",
							"file",
							"drive",
							"dropbox",
							"embed",
							"link"
						].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: k,
							children: k
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: source.url,
						placeholder: "https://",
						onChange: (e) => {
							const next = [...sources];
							const classified = classifyUrl(e.target.value, source.kind);
							next[index] = {
								...source,
								url: e.target.value,
								kind: e.target.value.trim() ? classified.kind : source.kind
							};
							onChange(next);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						type: "number",
						placeholder: "Ep",
						value: source.episode ?? "",
						onChange: (e) => {
							const next = [...sources];
							next[index] = {
								...source,
								episode: e.target.value ? Number(e.target.value) : null
							};
							onChange(next);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center text-danger",
						"aria-label": "Remove link",
						onClick: () => onChange(sources.filter((_, i) => i !== index)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})
				]
			}, `${source.url}-${index}`))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "mt-2 inline-flex h-11 items-center gap-1 text-sm text-accent",
			onClick: () => onChange([...sources, {
				kind: "link",
				url: "",
				label: ""
			}]),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add link"]
		})
	] });
}
function EpisodeEditor({ kind, episodes, onChange }) {
	const [count, setCount] = (0, import_react.useState)(episodes.length || 12);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
			className: "text-sm font-semibold",
			children: kind === "MANGA" ? "Chapters" : "Episodes"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: cn(inputCls, "w-28"),
				type: "number",
				min: 0,
				max: 500,
				value: count,
				onChange: (e) => setCount(Number(e.target.value)),
				"aria-label": "Episode count"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-11 rounded-full border border-line px-3 text-sm",
				onClick: () => {
					const n = Math.max(0, Math.min(500, count));
					onChange(Array.from({ length: n }, (_, i) => episodes[i] ?? {
						n: i + 1,
						title: `${kind === "MANGA" ? "Chapter" : "Episode"} ${i + 1}`,
						thumb: null,
						source: null
					}).map((ep, i) => ({
						...ep,
						n: i + 1
					})));
				},
				children: "Build list"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 max-h-96 space-y-2 overflow-y-auto",
			children: episodes.slice(0, 60).map((ep, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 rounded-xl border border-line bg-surface p-2 sm:grid-cols-[3rem_1fr_1fr]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-11 place-items-center text-micro text-faint tabular-nums",
						children: ep.n
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: ep.title,
						"aria-label": `Title ${ep.n}`,
						onChange: (e) => {
							const next = [...episodes];
							next[index] = {
								...ep,
								title: e.target.value
							};
							onChange(next);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: ep.source?.url ?? "",
						placeholder: "Link for this one",
						"aria-label": `Link ${ep.n}`,
						onChange: (e) => {
							const next = [...episodes];
							const url = e.target.value;
							next[index] = {
								...ep,
								source: url ? {
									...classifyUrl(url),
									url,
									episode: ep.n
								} : null
							};
							onChange(next);
						}
					})
				]
			}, ep.n))
		}),
		episodes.length > 60 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "First 60 are editable here. The rest stay saved."
		})
	] });
}
function RowsTab({ run }) {
	const doc = useDoc();
	const [addTo, setAddTo] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Reorder homepage rows, hide one, or move titles inside a row."
			}),
			doc.rails.map((rail, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl border border-line bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: cn(inputCls, "max-w-xs"),
								defaultValue: rail.title,
								"aria-label": "Row title",
								onBlur: (e) => {
									const title = e.target.value.trim() || rail.title;
									if (title !== rail.title) run((draft) => {
										const hit = draft.rails[index];
										if (hit) hit.title = title;
									});
								}
							}, `${rail.id}-${rail.title}`),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-micro text-faint",
								children: rail.kind
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "ml-auto grid size-11 place-items-center",
								"aria-label": "Move row up",
								disabled: index === 0,
								onClick: () => run((draft) => swap(draft.rails, index, index - 1)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 place-items-center",
								"aria-label": "Move row down",
								disabled: index === doc.rails.length - 1,
								onClick: () => run((draft) => swap(draft.rails, index, index + 1)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 rounded-full border border-line px-3 text-sm",
								onClick: () => run((draft) => {
									const hit = draft.rails[index];
									if (hit) hit.hidden = !hit.hidden;
								}),
								children: rail.hidden ? "Show" : "Hide"
							})
						]
					}),
					rail.mode === "ids" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1",
								children: rail.ids.slice(0, 24).map((id, idIndex) => {
									const media = doc.media.find((m) => m.id === id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "min-w-0 flex-1 truncate text-sm",
												children: media?.title ?? `#${id}`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "grid size-11 place-items-center",
												"aria-label": "Move title up",
												onClick: () => run((draft) => swap(draft.rails[index]?.ids ?? [], idIndex, idIndex - 1)),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "grid size-11 place-items-center",
												"aria-label": "Move title down",
												onClick: () => run((draft) => swap(draft.rails[index]?.ids ?? [], idIndex, idIndex + 1)),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "grid size-11 place-items-center text-danger",
												"aria-label": "Remove from row",
												onClick: () => run((draft) => {
													draft.rails[index]?.ids.splice(idIndex, 1);
												}),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
											})
										]
									}, `${rail.id}-${id}-${idIndex}`);
								})
							}),
							rail.ids.length > 24 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-micro text-faint",
								children: [rail.ids.length - 24, " more in this row."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-2 text-sm text-accent",
								onClick: () => {
									setAddTo(rail.id);
									setQ("");
								},
								children: "Add a title"
							}),
							addTo === rail.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputCls,
									value: q,
									onChange: (e) => setQ(e.target.value),
									placeholder: "Search to add"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 max-h-48 overflow-y-auto rounded-xl border border-line",
									children: doc.media.filter((m) => (rail.kind === "ANY" || m.kind === rail.kind) && m.title.toLowerCase().includes(q.trim().toLowerCase()) && !rail.ids.includes(m.id)).slice(0, 8).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-raised",
										onClick: () => run((draft) => {
											draft.rails[index]?.ids.unshift(item.id);
										}),
										children: item.title
									}) }, item.id))
								})]
							})
						]
					}),
					rail.mode !== "ids" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "This row fills itself from scores or year. Hide it, or rename it."
					})
				]
			}, rail.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "inline-flex h-11 items-center gap-1 rounded-full border border-line px-4 text-sm",
				onClick: () => run((draft) => {
					draft.rails.push({
						id: `row-${Date.now()}`,
						title: "New row",
						kind: "ANIME",
						hidden: false,
						mode: "ids",
						ids: []
					});
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " New row"]
			})
		]
	});
}
var SECTION_LABELS = {
	hero: "Featured banner",
	continue: "Continue watching",
	list: "Your list",
	notes: "Recent notes",
	airing: "Airing next",
	rails: "Poster rows",
	genres: "Genre tiles"
};
function HomeTab({ run }) {
	const doc = useDoc();
	const [q, setQ] = (0, import_react.useState)("");
	const [which, setWhich] = (0, import_react.useState)("ANIME");
	const ids = which === "ANIME" ? doc.hero.animeIds : doc.hero.mangaIds;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-bold",
				children: "Homepage sections"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-2 sm:grid-cols-2",
				children: doc.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-3 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: SECTION_LABELS[section.id] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "size-4 accent-gold",
						checked: section.enabled,
						onChange: (e) => run((draft) => {
							const hit = draft.sections.find((s) => s.id === section.id);
							if (hit) hit.enabled = e.target.checked;
						})
					})]
				}, section.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-bold",
					children: "Featured banners"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "These hold the home hero. Empty means the shelf rotates the usual row."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex items-center gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "size-4 accent-gold",
						checked: doc.hero.rotate,
						onChange: (e) => run((draft) => {
							draft.hero.rotate = e.target.checked;
						})
					}), "Rotate when more than one banner is pinned"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex gap-2",
					children: ["ANIME", "MANGA"].map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cn("h-11 rounded-full px-3 text-sm", which === kind ? "bg-accent text-accent-ink" : "border border-line"),
						onClick: () => setWhich(kind),
						children: kind === "ANIME" ? "Anime" : "Manga"
					}, kind))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-1",
					children: ids.map((id, index) => {
						const media = doc.media.find((m) => m.id === id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1 truncate text-sm",
								children: media?.title ?? id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 text-sm text-danger",
								onClick: () => run((draft) => {
									(which === "ANIME" ? draft.hero.animeIds : draft.hero.mangaIds).splice(index, 1);
								}),
								children: "Remove"
							})]
						}, `${id}-${index}`);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: cn(inputCls, "mt-3 max-w-md"),
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Pin a title to the hero"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 overflow-hidden rounded-2xl border border-line",
					children: doc.media.filter((m) => m.kind === which && m.title.toLowerCase().includes(q.trim().toLowerCase()) && !ids.includes(m.id)).slice(0, 6).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-center gap-2 bg-surface px-3 py-2 text-left text-sm",
						onClick: () => run((draft) => {
							(which === "ANIME" ? draft.hero.animeIds : draft.hero.mangaIds).push(item.id);
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.cover,
							alt: "",
							className: "h-10 w-7 rounded object-cover"
						}), item.title]
					}) }, item.id))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-bold",
						children: "Landing page"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Headline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlurText, {
							value: doc.appearance.landing.headline,
							onCommit: (headline) => run((draft) => {
								draft.appearance.landing.headline = headline;
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Subline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlurText, {
							value: doc.appearance.landing.sub,
							onCommit: (sub) => run((draft) => {
								draft.appearance.landing.sub = sub;
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrlField, {
						label: "Landing image",
						value: doc.appearance.landing.image,
						onChange: (image) => run((draft) => {
							draft.appearance.landing.image = image;
						})
					})
				]
			})
		]
	});
}
var PRESETS = [
	{
		id: "night",
		name: "Night"
	},
	{
		id: "ember",
		name: "Ember"
	},
	{
		id: "dawn",
		name: "Dawn"
	},
	{
		id: "custom",
		name: "Custom"
	}
];
var COLOR_KEYS = [
	{
		key: "bg",
		label: "Background"
	},
	{
		key: "surface",
		label: "Surface"
	},
	{
		key: "raised",
		label: "Raised"
	},
	{
		key: "fg",
		label: "Text"
	},
	{
		key: "muted",
		label: "Muted"
	},
	{
		key: "accent",
		label: "Accent"
	},
	{
		key: "accentInk",
		label: "Accent ink"
	},
	{
		key: "gold",
		label: "Gold"
	},
	{
		key: "line",
		label: "Line"
	}
];
function LookTab({ run }) {
	const doc = useDoc();
	const setTheme = useLibrary((s) => s.setTheme);
	const look = doc.appearance;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-bold",
					children: "Theme"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
					children: PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cn("h-16 rounded-2xl border text-sm font-semibold", look.preset === preset.id ? "border-accent bg-surface" : "border-line"),
						onClick: () => {
							setTheme(preset.id);
							run((draft) => {
								draft.appearance.preset = preset.id;
							});
						},
						children: preset.name
					}, preset.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Custom colors apply when the mode icon is on Custom. Night, Ember, and Dawn keep their own palettes."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: COLOR_KEYS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "color",
						value: toHex(look.colors[item.key]),
						"aria-label": item.label,
						onChange: (e) => {
							setTheme("custom");
							run((draft) => {
								draft.appearance.colors[item.key] = e.target.value;
								draft.appearance.preset = "custom";
							});
						}
					})]
				}, item.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Body font",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: inputCls,
						value: look.fontSans,
						onChange: (e) => run((draft) => {
							draft.appearance.fontSans = e.target.value;
						}),
						children: [
							"Outfit",
							"Sora",
							"Newsreader"
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: f }, f))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Display font",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: inputCls,
						value: look.fontDisplay,
						onChange: (e) => run((draft) => {
							draft.appearance.fontDisplay = e.target.value;
						}),
						children: [
							"Syne",
							"Outfit",
							"Sora",
							"Newsreader"
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: f }, f))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				style: { fontFamily: fontStack(look.fontSans) },
				children: "The quick brown fox watches the shelf."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-bold",
				children: "Motion"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-2",
				children: [
					["marquee", "Title marquee"],
					["posterLift", "Poster hover lift"],
					["heroFade", "Banner crossfade"],
					["pageFade", "Page fade"],
					["press", "Button press"]
				].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between rounded-2xl border border-line bg-surface px-3 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "size-4 accent-gold",
						checked: look.effects[key],
						onChange: (e) => run((draft) => {
							draft.appearance.effects[key] = e.target.checked;
						})
					})]
				}, key))
			})] })
		]
	});
}
function KeyTab({ user, onUser, onLock, onNote }) {
	const [username, setUsername] = (0, import_react.useState)(user ?? "");
	const [next, setNext] = (0, import_react.useState)("");
	const [show, setShow] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const doc = useDoc();
	(0, import_react.useEffect)(() => {
		const token = currentToken();
		if (!token) return;
		let live = true;
		deskIdentity({ data: { token } }).then((res) => {
			if (!live) return;
			if (!res.ok) {
				onLock();
				return;
			}
			setUsername(res.username);
			onUser(res.username);
		});
		return () => {
			live = false;
		};
	}, [onLock, onUser]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "max-w-md space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-bold",
				children: "Sign-in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "One desk account. Leave the password blank to keep the current one. A new password needs at least 8 characters."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					const token = currentToken();
					if (!token) return onLock();
					setBusy(true);
					setDeskPassword({ data: {
						token,
						username: username.trim(),
						next
					} }).then((res) => {
						if (!res.ok) {
							if (res.error === "bad-name") {
								onNote("Username needs 2–32 letters, numbers, dots, or dashes.");
								return;
							}
							if (res.error === "short") {
								onNote("Password needs at least 8 characters.");
								return;
							}
							onLock();
							return;
						}
						rememberSession(res.token, res.username);
						setUsername(res.username);
						onUser(res.username);
						setNext("");
						onNote("Sign-in updated.");
					}).finally(() => setBusy(false));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-micro font-semibold uppercase tracking-widest text-faint",
						htmlFor: "desk-next-user",
						children: "Username"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "desk-next-user",
						value: username,
						onChange: (e) => setUsername(e.target.value),
						autoComplete: "username",
						spellCheck: false,
						className: inputCls
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-micro font-semibold uppercase tracking-widest text-faint",
						htmlFor: "desk-next-pass",
						children: "New password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "desk-next-pass",
							type: show ? "text" : "password",
							value: next,
							onChange: (e) => setNext(e.target.value),
							placeholder: "Leave blank to keep",
							className: `${inputCls} pr-12`,
							autoComplete: "new-password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "absolute inset-y-0 right-1 grid size-11 place-items-center text-muted",
							"aria-label": show ? "Hide password" : "Show password",
							onClick: () => setShow((open) => !open),
							children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy || username.trim().length < 2,
						className: "h-11 rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink disabled:opacity-50",
						children: busy ? "Saving…" : "Save sign-in"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 rounded-full border border-line px-4 text-sm",
					onClick: () => {
						const blob = new Blob([JSON.stringify(doc)], { type: "application/json" });
						const url = URL.createObjectURL(blob);
						const a = document.createElement("a");
						a.href = url;
						a.download = "vela-shelf.json";
						a.click();
						URL.revokeObjectURL(url);
					},
					children: "Download shelf"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "inline-flex h-11 cursor-pointer items-center rounded-full border border-line px-4 text-sm",
					children: ["Import shelf", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "application/json",
						className: "sr-only",
						onChange: (e) => {
							const file = e.target.files?.[0];
							if (!file) return;
							file.text().then((text) => {
								const parsed = JSON.parse(text);
								if (!Array.isArray(parsed.media)) return;
								publish((draft) => {
									Object.assign(draft, parsed);
									draft.revision = Math.max(draft.revision, getDoc().revision) + 1;
								}).then(() => onNote("Shelf imported."));
							});
						}
					})]
				})]
			})
		]
	});
}
function toLocalInput(at) {
	if (!at) return "";
	const date = /* @__PURE__ */ new Date(at * 1e3);
	if (Number.isNaN(date.getTime())) return "";
	const pad = (n) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function fromLocalInput(value) {
	if (!value) return null;
	const ms = new Date(value).getTime();
	if (!Number.isFinite(ms)) return null;
	return Math.floor(ms / 1e3);
}
function BlurText({ value, onCommit }) {
	const [text, setText] = (0, import_react.useState)(value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: inputCls,
		value: text,
		onChange: (e) => setText(e.target.value),
		onBlur: () => {
			if (text !== value) onCommit(text);
		}
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1",
			children
		})]
	});
}
function UrlField({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
		label,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: inputCls,
			value,
			placeholder: "https:// or upload",
			onChange: (e) => onChange(e.target.value)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			accept: "image/*",
			className: "mt-2 block w-full text-sm text-muted file:mr-3 file:h-11 file:rounded-full file:border-0 file:bg-raised file:px-3 file:text-sm file:text-fg",
			onChange: (e) => {
				const file = e.target.files?.[0];
				if (!file) return;
				shrinkImage(file).then((url) => {
					if (url) onChange(url);
				});
			}
		})]
	});
}
function swap(list, from, to) {
	if (to < 0 || to >= list.length) return;
	const [item] = list.splice(from, 1);
	if (item !== void 0) list.splice(to, 0, item);
}
function toHex(color) {
	if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
	return "#000000";
}
async function shrinkImage(file) {
	const bmp = await createImageBitmap(file);
	const scale = Math.min(1, 960 / Math.max(bmp.width, bmp.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(bmp.width * scale));
	canvas.height = Math.max(1, Math.round(bmp.height * scale));
	const ctx = canvas.getContext("2d");
	if (!ctx) return "";
	ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
	bmp.close();
	return canvas.toDataURL("image/jpeg", .82);
}
var SplitComponent = DeskApp;
export { SplitComponent as component };
