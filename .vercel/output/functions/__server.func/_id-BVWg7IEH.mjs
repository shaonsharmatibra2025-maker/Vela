import { o as __toESM } from "./_runtime.mjs";
import { n as Shell, t as Score } from "./_ssr/chrome-C7ZFGRgf.mjs";
import { t as Comments } from "./_ssr/comments-CrYYxQsT.mjs";
import { n as resolvePlayback } from "./_ssr/playback-BYoMXVf0.mjs";
import { _ as episodeTitle, g as episodeThumb, h as clock, n as Route, v as episodeTotal, w as statusLabel, y as formatLabel } from "./_ssr/router-Dy9R8Kiq.mjs";
import { t as cn } from "./_ssr/cn-2gCmG5_y.mjs";
import { t as Poster } from "./_ssr/poster-CgqRlPBh.mjs";
import { _ as recsFor, f as inCatalog, l as getMedia } from "./_ssr/catalog-CLOn5NSj.mjs";
import { t as useLibrary } from "./_ssr/library-l4LIWX3u.mjs";
import { J as require_react, S as require_jsx_runtime, b as useNavigate, y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { F as ArrowLeft, f as Play, g as Maximize, k as Check, n as VolumeX, p as Pause, r as Volume2 } from "./_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/_id-BVWg7IEH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Theater({ media, episode, onPlay }) {
	const hostRef = (0, import_react.useRef)(null);
	const frameRef = (0, import_react.useRef)(null);
	const playerRef = (0, import_react.useRef)(null);
	const [started, setStarted] = (0, import_react.useState)(false);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [ytError, setYtError] = (0, import_react.useState)(false);
	const [time, setTime] = (0, import_react.useState)(0);
	const [dur, setDur] = (0, import_react.useState)(0);
	const [vol, setVol] = (0, import_react.useState)(80);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const volRef = (0, import_react.useRef)(vol);
	volRef.current = vol;
	const thumb = episodeThumb(media, episode);
	const play = resolvePlayback(media, episode);
	const trailerId = play.type === "youtube" ? play.id : null;
	(0, import_react.useEffect)(() => {
		setStarted(false);
		setPaused(false);
		setReady(false);
		setYtError(false);
		setTime(0);
		setDur(0);
	}, [media.id, episode]);
	(0, import_react.useEffect)(() => {
		if (!started || !trailerId) return;
		const host = hostRef.current;
		if (!host) return;
		let dead = false;
		let timer = 0;
		let player = null;
		const mount = document.createElement("div");
		mount.className = "h-full w-full";
		host.replaceChildren(mount);
		const boot = () => {
			if (dead || !window.YT?.Player) return;
			player = new window.YT.Player(mount, {
				videoId: trailerId,
				playerVars: {
					autoplay: 1,
					rel: 0,
					modestbranding: 1,
					controls: 0,
					playsinline: 1,
					origin: window.location.origin
				},
				events: {
					onReady: (e) => {
						if (dead) return;
						playerRef.current = e.target;
						e.target.setVolume(volRef.current);
						e.target.playVideo();
						setReady(true);
						setDur(e.target.getDuration() || 0);
					},
					onError: () => setYtError(true)
				}
			});
			timer = window.setInterval(() => {
				const p = playerRef.current;
				if (!p?.getCurrentTime) return;
				setTime(p.getCurrentTime() || 0);
				const d = p.getDuration() || 0;
				if (d) setDur(d);
			}, 400);
		};
		if (window.YT?.Player) boot();
		else {
			const prev = window.onYouTubeIframeAPIReady;
			window.onYouTubeIframeAPIReady = () => {
				prev?.();
				boot();
			};
			if (!document.querySelector("script[data-yt-api]")) {
				const script = document.createElement("script");
				script.src = "https://www.youtube.com/iframe_api";
				script.dataset.ytApi = "1";
				document.body.appendChild(script);
			}
		}
		const fail = window.setTimeout(() => {
			if (!dead && !playerRef.current) setYtError(true);
		}, 7e3);
		return () => {
			dead = true;
			window.clearInterval(timer);
			window.clearTimeout(fail);
			try {
				player?.destroy();
			} catch {}
			playerRef.current = null;
			host.replaceChildren();
		};
	}, [
		started,
		media.id,
		trailerId
	]);
	if (play.type === "file" || play.type === "image" || play.type === "iframe") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-2xl border border-line bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-video bg-bg",
			children: [
				play.type === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: play.url,
					alt: "",
					className: "h-full w-full object-contain"
				}),
				play.type === "file" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					src: play.url,
					controls: true,
					playsInline: true,
					poster: thumb,
					className: "h-full w-full bg-bg",
					onPlay
				}, play.url),
				play.type === "iframe" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: media.title,
					src: play.src,
					className: "absolute inset-0 h-full w-full",
					allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
					allowFullScreen: true
				}, play.src)
			]
		})
	});
	function toggle() {
		if (!trailerId) {
			setStarted(true);
			onPlay();
			return;
		}
		if (!started) {
			setStarted(true);
			setPaused(false);
			onPlay();
			return;
		}
		const p = playerRef.current;
		if (!p) return;
		if (paused) {
			p.playVideo();
			setPaused(false);
		} else {
			p.pauseVideo();
			setPaused(true);
		}
	}
	const showCustom = started && !!trailerId && !ytError;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: frameRef,
		className: "overflow-hidden rounded-2xl border border-line bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-video bg-bg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: hostRef,
					className: cn("absolute inset-0", (!started || ytError || !trailerId) && "hidden")
				}),
				started && ytError && trailerId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					className: "absolute inset-0 h-full w-full",
					src: `https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&rel=0`,
					title: `${media.title} official trailer`,
					allow: "autoplay; encrypted-media; picture-in-picture",
					allowFullScreen: true
				}),
				(!started || !trailerId && started) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "absolute inset-0",
					onClick: toggle,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: thumb,
							alt: "",
							className: "h-full w-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 bg-bg/30" }),
						trailerId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-accent-ink",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
								className: "size-7",
								fill: "currentColor"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "absolute inset-x-6 bottom-6 rounded-xl bg-bg/80 px-4 py-3 text-sm text-fg",
							children: [
								"No official trailer is on file. You can still log this ",
								media.kind === "MANGA" ? "chapter" : "episode",
								"."
							]
						})
					]
				}),
				showCustom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bg via-bg/80 to-transparent px-3 pt-10 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": "Trailer position",
						type: "range",
						min: 0,
						max: dur || 0,
						step: .1,
						value: Math.min(time, dur || 0),
						onChange: (e) => {
							const next = Number(e.target.value);
							playerRef.current?.seekTo(next, true);
							setTime(next);
						},
						className: "mb-2 w-full"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 place-items-center text-fg",
								onClick: toggle,
								"aria-label": paused ? "Play" : "Pause",
								children: paused || !ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
									className: "size-5",
									fill: "currentColor"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
									className: "size-5",
									fill: "currentColor"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-micro text-muted tabular-nums",
								children: [
									clock(time),
									" / ",
									clock(dur)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 place-items-center text-fg",
								"aria-label": muted ? "Unmute" : "Mute",
								onClick: () => {
									const p = playerRef.current;
									if (!p) return;
									if (muted) {
										p.unMute();
										p.setVolume(vol);
										setMuted(false);
									} else {
										p.mute();
										setMuted(true);
									}
								},
								children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Volume",
								type: "range",
								min: 0,
								max: 100,
								value: muted ? 0 : vol,
								onChange: (e) => {
									const next = Number(e.target.value);
									setVol(next);
									setMuted(next === 0);
									playerRef.current?.setVolume(next);
									if (next > 0) playerRef.current?.unMute();
								},
								className: "w-20"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "ml-auto grid size-11 place-items-center text-fg",
								"aria-label": "Full screen",
								onClick: () => {
									const el = frameRef.current;
									if (!el) return;
									if (document.fullscreenElement) document.exitFullscreen();
									else el.requestFullscreen();
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize, { className: "size-5" })
							})
						]
					})]
				})
			]
		})
	});
}
function sourceLine(media, episode) {
	const play = resolvePlayback(media, episode);
	if (play.type === "youtube") return "Source · YouTube";
	if (play.type === "file") return "Source · Video file";
	if (play.type === "image") return "Source · Still";
	if (play.type === "iframe") return "Source · Embed";
	return "No playable source on this episode";
}
function WatchPage() {
	const { id } = Route.useParams();
	const { ep } = Route.useSearch();
	const navigate = useNavigate();
	const media = getMedia(Number(id));
	const mark = useLibrary((s) => s.markProgress);
	const [focus, setFocus] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!media) return;
		const current = media;
		function onKey(e) {
			const target = e.target;
			if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) return;
			const total = episodeTotal(current);
			if (e.key === "ArrowRight" && ep < total) navigate({
				to: "/watch/$id",
				params: { id: String(current.id) },
				search: { ep: ep + 1 }
			});
			if (e.key === "ArrowLeft" && ep > 1) navigate({
				to: "/watch/$id",
				params: { id: String(current.id) },
				search: { ep: ep - 1 }
			});
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		media,
		ep,
		navigate
	]);
	if (!media) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold",
			children: "This title is not on the shelf"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/browse",
			className: "mt-3 inline-flex text-sm text-accent",
			children: "Back"
		})]
	}) });
	const total = episodeTotal(media);
	const safeEp = Math.min(Math.max(1, ep), total);
	const label = media.kind === "MANGA" ? "Chapter" : "Episode";
	const sequel = media.relations.find((r) => r.relation === "SEQUEL" || r.relation === "SIDE_STORY");
	const more = recsFor(media).slice(0, 10);
	const size = 30;
	const page = Math.floor((safeEp - 1) / size);
	const start = page * size;
	const count = Math.min(size, total - start);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-screen-2xl px-4 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/title/$id",
			params: { id: String(media.id) },
			className: "inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back to series"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("mt-2 grid grid-cols-1 items-start gap-4", !focus && "lg:grid-cols-[minmax(0,1fr)_22rem]"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold sm:text-3xl",
						children: media.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							label,
							" ",
							safeEp,
							" · ",
							episodeTitle(media, safeEp)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 flex flex-wrap items-center gap-2 text-micro text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatLabel(media.format) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: media.year ?? "—" }),
							media.score > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, { value: media.score }),
							media.genres.slice(0, 3).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: g }, g))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Theater, {
							media,
							episode: safeEp,
							onPlay: () => mark(media.id, safeEp)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: sourceLine(media, safeEp) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								safeEp < total && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/watch/$id",
									params: { id: String(media.id) },
									search: { ep: safeEp + 1 },
									className: "inline-flex h-11 items-center rounded-full border border-line px-3 text-fg",
									children: ["Next ", label.toLowerCase()]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "inline-flex h-11 items-center gap-2 rounded-full bg-accent px-3 font-semibold text-accent-ink",
									onClick: () => mark(media.id, safeEp),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Mark logged"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "inline-flex h-11 items-center rounded-full border border-line px-3 text-fg",
									onClick: () => setFocus((v) => !v),
									children: focus ? "Show shelf" : "Focus"
								})
							]
						})]
					}),
					sequel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: inCatalog(sequel.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/title/$id",
							params: { id: String(sequel.id) },
							className: "flex min-w-0 items-center gap-3 rounded-2xl border border-line bg-surface p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 text-micro tracking-widest text-faint uppercase",
								children: sequel.relation.replaceAll("_", " ")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 truncate font-medium",
								children: sequel.title
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "rounded-2xl border border-line bg-surface p-3 text-sm text-muted",
							children: [
								sequel.relation.replaceAll("_", " "),
								" · ",
								sequel.title
							]
						})
					}),
					!focus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold tracking-widest text-faint uppercase",
							children: "Recommended"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "scroller mt-3 flex w-full min-w-0 gap-3 overflow-x-auto",
							children: more.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-32 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Poster, { media: item })
							}, item.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comments, {
						mediaId: media.id,
						episode: safeEp
					})] })
				]
			}), !focus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "min-w-0 rounded-2xl border border-line bg-surface",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-line px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-semibold",
							children: [label, "s"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-micro text-muted",
							children: [
								statusLabel(media.status),
								" · ",
								total
							]
						})]
					}),
					total > size && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 px-3 pt-3 text-micro text-muted",
						children: ["Jump", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: page,
							onChange: (e) => {
								const next = Number(e.target.value) * size + 1;
								navigate({
									to: "/watch/$id",
									params: { id: String(media.id) },
									search: { ep: next }
								});
							},
							className: "h-11 flex-1 rounded-xl border border-line bg-bg px-2 text-sm text-fg",
							children: Array.from({ length: Math.ceil(total / size) }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: i,
								children: [
									i * size + 1,
									"–",
									Math.min(total, (i + 1) * size)
								]
							}, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "max-h-[70vh] overflow-y-auto p-2",
						children: Array.from({ length: count }, (_, i) => {
							const n = start + i + 1;
							const on = n === safeEp;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/watch/$id",
								params: { id: String(media.id) },
								search: { ep: n },
								className: cn("flex gap-3 rounded-xl p-2", on ? "bg-raised" : "hover:bg-bg"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: episodeThumb(media, n),
									alt: "",
									className: "h-14 w-24 rounded-lg object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("block text-sm font-medium", on && "text-accent"),
										children: [
											label,
											" ",
											n
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "line-clamp-2 text-micro text-muted",
										children: episodeTitle(media, n)
									})]
								})]
							}) }, n);
						})
					})
				]
			})]
		})]
	}) });
}
export { WatchPage as component };
