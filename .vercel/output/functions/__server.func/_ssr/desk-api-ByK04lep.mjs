import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
// node_modules/.nitro/vite/services/ssr/assets/desk-api-ByK04lep.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function gate() {
	const [{ getSql }, secret] = await Promise.all([import("./db-CGR6cAQr.mjs"), import("./desk.server-B-suL-p0.mjs")]);
	const sql = await getSql();
	return {
		sql,
		admin: await secret.readAdmin((text, params) => sql.query(text, params)),
		secret
	};
}
var loadSite_createServerFn_handler = createServerRpc({
	id: "10aeccfc354d0c2183093a16ce5792dfa924d3d6f2de3eeedaa536f250b4c108",
	name: "loadSite",
	filename: "src/lib/desk-api.ts"
}, (opts) => loadSite.__executeServer(opts));
var loadSite = createServerFn({ method: "GET" }).handler(loadSite_createServerFn_handler, async () => {
	try {
		const { getSql } = await import("./db-CGR6cAQr.mjs");
		const row = (await (await getSql()).query("select doc, revision from vela_site where id = $1", ["main"]))[0];
		if (!row) return {
			doc: null,
			revision: 0
		};
		return {
			doc: row.doc,
			revision: Number(row.revision) || 0
		};
	} catch {
		return {
			doc: null,
			revision: 0
		};
	}
});
var unlockDesk_createServerFn_handler = createServerRpc({
	id: "3ae162796fb8cda5f97fe423f77492c4c50a26d4cd0b0ee97760ba5ee4d0171d",
	name: "unlockDesk",
	filename: "src/lib/desk-api.ts"
}, (opts) => unlockDesk.__executeServer(opts));
var unlockDesk = createServerFn({ method: "POST" }).validator(object({
	username: string().min(1).max(32),
	password: string().min(1).max(200)
})).handler(unlockDesk_createServerFn_handler, async ({ data }) => {
	const { admin, secret } = await gate();
	const userOk = secret.usernameMatches(data.username, admin.username);
	const passOk = secret.passwordMatches(data.password, admin.passHash);
	if (!userOk || !passOk) return { ok: false };
	const exp = Date.now() + 432e5;
	return {
		ok: true,
		token: secret.signToken(admin.passHash, exp),
		exp,
		username: admin.username
	};
});
var deskIdentity_createServerFn_handler = createServerRpc({
	id: "ce22fc9012d1535059f9f7ab951cc6263d9b851e9c6cc64b766db30e49d2b97d",
	name: "deskIdentity",
	filename: "src/lib/desk-api.ts"
}, (opts) => deskIdentity.__executeServer(opts));
var deskIdentity = createServerFn({ method: "POST" }).validator(object({ token: string().min(20).max(400) })).handler(deskIdentity_createServerFn_handler, async ({ data }) => {
	const { admin, secret } = await gate();
	if (!secret.tokenValid(data.token, admin.passHash)) return { ok: false };
	return {
		ok: true,
		username: admin.username
	};
});
var saveSite_createServerFn_handler = createServerRpc({
	id: "6dedc3c38fa4be2153bd17e9c985fd20c4542502df2729175b1c4a7324e6a921",
	name: "saveSite",
	filename: "src/lib/desk-api.ts"
}, (opts) => saveSite.__executeServer(opts));
var saveSite = createServerFn({ method: "POST" }).validator(object({
	token: string().min(20).max(400),
	doc: string().min(2).max(45e5)
})).handler(saveSite_createServerFn_handler, async ({ data }) => {
	const { sql, admin, secret } = await gate();
	if (!secret.tokenValid(data.token, admin.passHash)) return {
		ok: false,
		error: "locked"
	};
	let parsed;
	try {
		parsed = JSON.parse(data.doc);
	} catch {
		return {
			ok: false,
			error: "bad-doc"
		};
	}
	const revision = typeof parsed.revision === "number" ? parsed.revision : 1;
	await sql.query(`insert into vela_site (id, doc, revision, updated_at)
       values ('main', $1, $2, now())
       on conflict (id) do update set doc = excluded.doc, revision = excluded.revision, updated_at = now()`, [data.doc, revision]);
	return {
		ok: true,
		revision
	};
});
var setDeskPassword_createServerFn_handler = createServerRpc({
	id: "03bf45304d7313d35c4bc0385dfa388e2d1239efb4836048630f33886a684ab9",
	name: "setDeskPassword",
	filename: "src/lib/desk-api.ts"
}, (opts) => setDeskPassword.__executeServer(opts));
var setDeskPassword = createServerFn({ method: "POST" }).validator(object({
	token: string().min(20).max(400),
	username: string().min(2).max(32),
	next: string().max(200).optional()
})).handler(setDeskPassword_createServerFn_handler, async ({ data }) => {
	const { sql, admin, secret } = await gate();
	if (!secret.tokenValid(data.token, admin.passHash)) return {
		ok: false,
		error: "locked"
	};
	const username = secret.normalizeUsername(data.username);
	if (!secret.usernameOk(username)) return {
		ok: false,
		error: "bad-name"
	};
	const next = data.next?.trim() ?? "";
	if (next && next.length < 8) return {
		ok: false,
		error: "short"
	};
	const nextHash = next ? secret.hashPassword(next) : admin.passHash;
	await sql.query(`insert into vela_admin (id, username, pass_hash, updated_at)
       values ('primary', $1, $2, now())
       on conflict (id) do update set username = excluded.username, pass_hash = excluded.pass_hash, updated_at = now()`, [username, nextHash]);
	const exp = Date.now() + 432e5;
	return {
		ok: true,
		token: secret.signToken(nextHash, exp),
		exp,
		username
	};
});
export { deskIdentity_createServerFn_handler, loadSite_createServerFn_handler, saveSite_createServerFn_handler, setDeskPassword_createServerFn_handler, unlockDesk_createServerFn_handler };
