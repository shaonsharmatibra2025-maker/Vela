import { o as __toESM } from "../_runtime.mjs";
import { c as getDoc, g as readLocalDoc, l as getMedia, o as fontStack, p as normalizeDoc, v as replaceDoc, x as subscribeCatalog } from "./catalog-CLOn5NSj.mjs";
import { t as useLibrary } from "./library-l4LIWX3u.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as readDiscoverSearch, r as readWatchSearch } from "./search-DxquROhY.mjs";
import { J as require_react, S as require_jsx_runtime, _ as createFileRoute, d as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
// node_modules/.nitro/vite/services/ssr/assets/format-C3xacWNU.js
var FORMATS = {
	TV: "TV",
	TV_SHORT: "TV",
	MOVIE: "Movie",
	SPECIAL: "Special",
	OVA: "OVA",
	ONA: "ONA",
	MUSIC: "Music",
	MANGA: "Manga",
	NOVEL: "Novel",
	ONE_SHOT: "One-shot"
};
var STATUSES = {
	FINISHED: "Finished",
	RELEASING: "Airing",
	NOT_YET_RELEASED: "Upcoming",
	CANCELLED: "Cancelled",
	HIATUS: "Hiatus"
};
function formatLabel(format) {
	return FORMATS[format] ?? format;
}
function statusLabel(status) {
	return STATUSES[status] ?? status;
}
function seasonText(media) {
	if (media.season && media.year) return `${media.season.charAt(0) + media.season.slice(1).toLowerCase()} ${media.year}`;
	return media.year ? String(media.year) : "—";
}
function runLabel(media) {
	if (media.kind === "MANGA") return media.chapters ? `${media.chapters} ch` : "Manga";
	if (media.format === "MOVIE") return media.duration ? `${media.duration} min` : "Movie";
	return media.episodes ? `${media.episodes} eps` : formatLabel(media.format);
}
function episodeTotal(media) {
	if (media.kind === "MANGA") return media.chapters || media.episodeList.length || 12;
	return media.episodes || media.episodeList.length || 12;
}
function episodeTitle(media, n) {
	const hit = media.episodeList.find((e) => e.n === n);
	if (!hit) return media.kind === "MANGA" ? `Chapter ${n}` : `Episode ${n}`;
	return hit.title.replace(/^(?:episode|chapter|ep|ch)\s*\d+\s*[-:–—.]\s*/i, "").trim() || hit.title;
}
function episodeThumb(media, n) {
	return media.episodeList.find((e) => e.n === n)?.thumb || media.banner || media.cover;
}
function ago(ts) {
	const s = Math.max(1, (Date.now() - ts) / 1e3);
	if (s < 60) return "just now";
	if (s < 3600) return `${Math.floor(s / 60)}m ago`;
	if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
	const d = Math.floor(s / 86400);
	if (d < 30) return `${d}d ago`;
	const mo = Math.floor(d / 30);
	if (mo < 18) return `${mo}mo ago`;
	return `${Math.floor(d / 365)}y ago`;
}
function clock(seconds) {
	const s = Math.max(0, Math.floor(seconds));
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
var solidBtn = "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink transition-opacity duration-200 hover:opacity-90";
var ghostBtn = "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-fg transition-colors duration-200 hover:bg-raised";
// node_modules/.nitro/vite/services/ssr/assets/site-sync-D1fHJryG.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var loadSite = createServerFn({ method: "GET" }).handler(createSsrRpc("10aeccfc354d0c2183093a16ce5792dfa924d3d6f2de3eeedaa536f250b4c108"));
var unlockDesk = createServerFn({ method: "POST" }).validator(object({
	username: string().min(1).max(32),
	password: string().min(1).max(200)
})).handler(createSsrRpc("3ae162796fb8cda5f97fe423f77492c4c50a26d4cd0b0ee97760ba5ee4d0171d"));
var deskIdentity = createServerFn({ method: "POST" }).validator(object({ token: string().min(20).max(400) })).handler(createSsrRpc("ce22fc9012d1535059f9f7ab951cc6263d9b851e9c6cc64b766db30e49d2b97d"));
var saveSite = createServerFn({ method: "POST" }).validator(object({
	token: string().min(20).max(400),
	doc: string().min(2).max(45e5)
})).handler(createSsrRpc("6dedc3c38fa4be2153bd17e9c985fd20c4542502df2729175b1c4a7324e6a921"));
var setDeskPassword = createServerFn({ method: "POST" }).validator(object({
	token: string().min(20).max(400),
	username: string().min(2).max(32),
	next: string().max(200).optional()
})).handler(createSsrRpc("03bf45304d7313d35c4bc0385dfa388e2d1239efb4836048630f33886a684ab9"));
var DESK_TOKEN = "vela-desk-token";
var DESK_USER = "vela-desk-user";
async function bootstrapShelf() {
	const local = readLocalDoc();
	if (local && local.revision > 0) replaceDoc(local);
	let remote = null;
	try {
		const res = await loadSite();
		if (res.doc) remote = normalizeDoc(JSON.parse(res.doc), getDoc());
	} catch {
		remote = null;
	}
	if (remote && (!local || remote.revision > local.revision)) replaceDoc(remote);
	const token = typeof sessionStorage !== "undefined" ? sessionStorage.getItem(DESK_TOKEN) : null;
	if (token && local && (!remote || local.revision > remote.revision)) {
		const saved = await saveSite({ data: {
			token,
			doc: JSON.stringify(local)
		} });
		if (!saved.ok && saved.error === "locked") clearToken();
	}
}
function rememberSession(token, username) {
	sessionStorage.setItem(DESK_TOKEN, token);
	sessionStorage.setItem(DESK_USER, username);
}
function clearToken() {
	sessionStorage.removeItem(DESK_TOKEN);
	sessionStorage.removeItem(DESK_USER);
}
function currentToken() {
	return sessionStorage.getItem(DESK_TOKEN);
}
function currentUser() {
	return sessionStorage.getItem(DESK_USER);
}
// node_modules/.nitro/vite/services/ssr/assets/router-Dy9R8Kiq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var FONT_QUERY = {
	Outfit: "Outfit:wght@300;400;500;600;700",
	Syne: "Syne:wght@700;800",
	Newsreader: "Newsreader:opsz,wght@6..72,500;6..72,700",
	Sora: "Sora:wght@400;500;600;700"
};
function ensureFonts(appearance) {
	const href = `https://fonts.googleapis.com/css2?family=${[.../* @__PURE__ */ new Set([
		appearance.fontSans,
		appearance.fontDisplay,
		"Outfit",
		"Syne"
	])].map((name) => FONT_QUERY[name] ?? `${name}:wght@400;700`).join("&family=")}&display=swap`;
	let link = document.querySelector("link[data-vela-fonts]");
	if (!link) {
		link = document.createElement("link");
		link.rel = "stylesheet";
		link.setAttribute("data-vela-fonts", "1");
		document.head.appendChild(link);
	}
	if (link.href !== href) link.href = href;
}
function LibraryBoot() {
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			await useLibrary.persist.rehydrate();
			if (!alive) return;
			await bootstrapShelf();
			if (!alive) return;
			if (!localStorage.getItem("lunar-library")) useLibrary.getState().setTheme(getDoc().appearance.preset);
			ensureFonts(getDoc().appearance);
		})();
		return () => {
			alive = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		ensureFonts(getDoc().appearance);
		return subscribeCatalog(() => ensureFonts(getDoc().appearance));
	}, []);
	return null;
}
function Ago({ at }) {
	const [label, setLabel] = (0, import_react.useState)("earlier");
	(0, import_react.useEffect)(() => setLabel(ago(at)), [at]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label });
}
function When({ at }) {
	const [label, setLabel] = (0, import_react.useState)("Scheduled");
	(0, import_react.useEffect)(() => {
		setLabel(new Intl.DateTimeFormat(void 0, {
			weekday: "short",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit"
		}).format(at * 1e3));
	}, [at]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "tabular-nums",
		children: label
	});
}
var styles_default = "/assets/styles-CK103qrW.css";
function useSiteDoc() {
	return (0, import_react.useSyncExternalStore)(subscribeCatalog, getDoc, getDoc);
}
function colorStyle(colors) {
	return {
		"--color-bg": colors.bg,
		"--color-surface": colors.surface,
		"--color-raised": colors.raised,
		"--color-fg": colors.fg,
		"--color-muted": colors.muted,
		"--color-faint": colors.faint,
		"--color-line": colors.line,
		"--color-accent": colors.accent,
		"--color-accent-ink": colors.accentInk,
		"--color-gold": colors.gold
	};
}
var Route$8 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Vela" },
			{
				name: "description",
				content: "Vela is a cinematic anime and manga shelf with official trailers and a watch log that stays on this device."
			},
			{
				name: "theme-color",
				content: "#070708"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,700&family=Outfit:wght@300;400;500;600;700&family=Sora:wght@400;500;600;700&family=Syne:wght@700;800&display=swap"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	const doc = useSiteDoc();
	const reduceMotion = useLibrary((s) => s.reduceMotion);
	const theme = doc.appearance.preset;
	const effects = doc.appearance.effects;
	const style = {
		...theme === "custom" ? colorStyle(doc.appearance.colors) : {},
		"--font-sans": fontStack(doc.appearance.fontSans),
		"--font-display": fontStack(doc.appearance.fontDisplay, true)
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		"data-theme": theme,
		"data-motion": reduceMotion ? "reduce" : "full",
		"data-marquee": effects.marquee ? "on" : "off",
		"data-lift": effects.posterLift ? "on" : "off",
		"data-hero": effects.heroFade ? "on" : "off",
		"data-page": effects.pageFade ? "on" : "off",
		"data-press": effects.press ? "on" : "off",
		style,
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			suppressHydrationWarning: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryBoot, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$7 = () => import("./routes-DQ5FKNhS.mjs");
var Route$7 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Vela — anime and manga, free and beautiful" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./browse-FNvoVZOH.mjs");
var Route$6 = createFileRoute("/browse")({
	head: () => ({ meta: [{ title: "Home · Vela" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./desk-7f3c-Bg1ztpA2.mjs");
var Route$5 = createFileRoute("/desk-7f3c")({
	head: () => ({ meta: [{ title: "Vela" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./discover-Clg9ZgrV.mjs");
var Route$4 = createFileRoute("/discover")({
	validateSearch: (search) => readDiscoverSearch(search),
	head: () => ({ meta: [{ title: "Genres · Vela" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./guide-Cbmz-PVG.mjs");
var Route$3 = createFileRoute("/guide")({
	head: () => ({ meta: [{ title: "How to use · Vela" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./schedule-Bqyus1O8.mjs");
var Route$2 = createFileRoute("/schedule")({
	head: () => ({ meta: [{ title: "Schedule · Vela" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_id-DtjHV3iv.mjs");
var Route$1 = createFileRoute("/title/$id")({
	head: ({ params }) => {
		const media = getMedia(Number(params.id));
		return { meta: [{ title: media ? `${media.title} · Vela` : "Vela" }] };
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_id-BVWg7IEH.mjs");
var Route = createFileRoute("/watch/$id")({
	validateSearch: (search) => readWatchSearch(search),
	head: ({ params }) => {
		const media = getMedia(Number(params.id));
		return { meta: [{ title: media ? `${media.title} · Vela` : "Watch · Vela" }] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	BrowseRoute: Route$6.update({
		id: "/browse",
		path: "/browse",
		getParentRoute: () => Route$8
	}),
	Desk7f3cRoute: Route$5.update({
		id: "/desk-7f3c",
		path: "/desk-7f3c",
		getParentRoute: () => Route$8
	}),
	DiscoverRoute: Route$4.update({
		id: "/discover",
		path: "/discover",
		getParentRoute: () => Route$8
	}),
	GuideRoute: Route$3.update({
		id: "/guide",
		path: "/guide",
		getParentRoute: () => Route$8
	}),
	ScheduleRoute: Route$2.update({
		id: "/schedule",
		path: "/schedule",
		getParentRoute: () => Route$8
	}),
	TitleIdRoute: Route$1.update({
		id: "/title/$id",
		path: "/title/$id",
		getParentRoute: () => Route$8
	}),
	WatchIdRoute: Route.update({
		id: "/watch/$id",
		path: "/watch/$id",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
export { solidBtn as C, seasonText as S, episodeTitle as _, Ago as a, ghostBtn as b, currentToken as c, rememberSession as d, saveSite as f, episodeThumb as g, clock as h, Route$4 as i, currentUser as l, unlockDesk as m, Route as n, When as o, setDeskPassword as p, Route$1 as r, clearToken as s, router_exports as t, deskIdentity as u, episodeTotal as v, statusLabel as w, runLabel as x, formatLabel as y };
