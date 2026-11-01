import { createHash, timingSafeEqual } from "node:crypto";

const PEPPER = "vela-desk-pepper-v1";
const DEFAULT_PASSWORD = "vela-ember-2049";
export const DEFAULT_USERNAME = "admin";

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function usernameOk(value: string) {
  return /^[a-z0-9][a-z0-9._-]{1,31}$/.test(normalizeUsername(value));
}

export function usernameMatches(input: string, stored: string) {
  return safeEqual(sha256(normalizeUsername(input)), sha256(normalizeUsername(stored)));
}

export function hashPassword(password: string) {
  return sha256(`${PEPPER}:${password}`);
}

export function passwordMatches(password: string, hash: string) {
  return safeEqual(hashPassword(password), hash);
}

export function defaultPasswordHash() {
  return hashPassword(DEFAULT_PASSWORD);
}

export function signToken(passHash: string, exp: number) {
  const sig = sha256(`${passHash}:${exp}:${PEPPER}`);
  return `${exp}.${sig}`;
}

export function tokenValid(token: string, passHash: string) {
  const [expRaw, sig] = token.split(".");
  const exp = Number(expRaw);
  if (!sig || !Number.isFinite(exp) || exp < Date.now()) return false;
  return safeEqual(sig, sha256(`${passHash}:${exp}:${PEPPER}`));
}

type AdminRow = { username: string | null; pass_hash: string };

export async function readAdmin(query: (sql: string, params?: unknown[]) => Promise<AdminRow[]>) {
  const rows = await query("select username, pass_hash from vela_admin where id = $1", ["primary"]);
  const row = rows[0];
  const username = row?.username ? normalizeUsername(row.username) : DEFAULT_USERNAME;
  return {
    username: usernameOk(username) ? username : DEFAULT_USERNAME,
    passHash: row?.pass_hash || defaultPasswordHash(),
  };
}
