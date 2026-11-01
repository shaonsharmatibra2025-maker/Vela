import { getDoc, readLocalDoc, replaceDoc, type SiteDoc } from "@/data/catalog";
import { normalizeDoc } from "@/data/site";
import { loadSite, saveSite } from "@/lib/desk-api";

export const DESK_TOKEN = "vela-desk-token";
export const DESK_USER = "vela-desk-user";

export async function bootstrapShelf() {
  const local = readLocalDoc();
  if (local && local.revision > 0) replaceDoc(local);
  let remote: SiteDoc | null = null;
  try {
    const res = await loadSite();
    if (res.doc) remote = normalizeDoc(JSON.parse(res.doc) as SiteDoc, getDoc());
  } catch {
    remote = null;
  }
  if (remote && (!local || remote.revision > local.revision)) replaceDoc(remote);
  const token = typeof sessionStorage !== "undefined" ? sessionStorage.getItem(DESK_TOKEN) : null;
  if (token && local && (!remote || local.revision > remote.revision)) {
    const saved = await saveSite({ data: { token, doc: JSON.stringify(local) } });
    if (!saved.ok && saved.error === "locked") clearToken();
  }
}

export function rememberSession(token: string, username: string) {
  sessionStorage.setItem(DESK_TOKEN, token);
  sessionStorage.setItem(DESK_USER, username);
}

export function clearToken() {
  sessionStorage.removeItem(DESK_TOKEN);
  sessionStorage.removeItem(DESK_USER);
}

export function currentToken() {
  return sessionStorage.getItem(DESK_TOKEN);
}

export function currentUser() {
  return sessionStorage.getItem(DESK_USER);
}
