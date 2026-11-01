import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function gate() {
  const [{ getSql }, secret] = await Promise.all([import("@/lib/db"), import("@/lib/desk.server")]);
  const sql = await getSql();
  const admin = await secret.readAdmin((text, params) => sql.query(text, params));
  return { sql, admin, secret };
}

export const loadSite = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<{ doc: string; revision: number }>(
      "select doc, revision from vela_site where id = $1",
      ["main"],
    );
    const row = rows[0];
    if (!row) return { doc: null as string | null, revision: 0 };
    return { doc: row.doc, revision: Number(row.revision) || 0 };
  } catch {
    return { doc: null as string | null, revision: 0 };
  }
});

export const unlockDesk = createServerFn({ method: "POST" })
  .validator(
    z.object({
      username: z.string().min(1).max(32),
      password: z.string().min(1).max(200),
    }),
  )
  .handler(async ({ data }) => {
    const { admin, secret } = await gate();
    const userOk = secret.usernameMatches(data.username, admin.username);
    const passOk = secret.passwordMatches(data.password, admin.passHash);
    if (!userOk || !passOk) return { ok: false as const };
    const exp = Date.now() + 1000 * 60 * 60 * 12;
    return { ok: true as const, token: secret.signToken(admin.passHash, exp), exp, username: admin.username };
  });

export const deskIdentity = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string().min(20).max(400) }))
  .handler(async ({ data }) => {
    const { admin, secret } = await gate();
    if (!secret.tokenValid(data.token, admin.passHash)) return { ok: false as const };
    return { ok: true as const, username: admin.username };
  });

export const saveSite = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string().min(20).max(400),
      doc: z.string().min(2).max(4_500_000),
    }),
  )
  .handler(async ({ data }) => {
    const { sql, admin, secret } = await gate();
    if (!secret.tokenValid(data.token, admin.passHash)) return { ok: false as const, error: "locked" as const };
    let parsed: { revision?: number };
    try {
      parsed = JSON.parse(data.doc) as { revision?: number };
    } catch {
      return { ok: false as const, error: "bad-doc" as const };
    }
    const revision = typeof parsed.revision === "number" ? parsed.revision : 1;
    await sql.query(
      `insert into vela_site (id, doc, revision, updated_at)
       values ('main', $1, $2, now())
       on conflict (id) do update set doc = excluded.doc, revision = excluded.revision, updated_at = now()`,
      [data.doc, revision],
    );
    return { ok: true as const, revision };
  });

export const setDeskPassword = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string().min(20).max(400),
      username: z.string().min(2).max(32),
      next: z.string().max(200).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { sql, admin, secret } = await gate();
    if (!secret.tokenValid(data.token, admin.passHash)) return { ok: false as const, error: "locked" as const };
    const username = secret.normalizeUsername(data.username);
    if (!secret.usernameOk(username)) return { ok: false as const, error: "bad-name" as const };
    const next = data.next?.trim() ?? "";
    if (next && next.length < 8) return { ok: false as const, error: "short" as const };
    const nextHash = next ? secret.hashPassword(next) : admin.passHash;
    await sql.query(
      `insert into vela_admin (id, username, pass_hash, updated_at)
       values ('primary', $1, $2, now())
       on conflict (id) do update set username = excluded.username, pass_hash = excluded.pass_hash, updated_at = now()`,
      [username, nextHash],
    );
    const exp = Date.now() + 1000 * 60 * 60 * 12;
    return { ok: true as const, token: secret.signToken(nextHash, exp), exp, username };
  });
