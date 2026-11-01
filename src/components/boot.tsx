import { useEffect, useState } from "react";
import { subscribeCatalog, getDoc } from "@/data/catalog";
import { useLibrary } from "@/lib/library";
import { ago } from "@/lib/format";
import { bootstrapShelf } from "@/lib/site-sync";
import type { Appearance } from "@/data/site";

const FONT_QUERY: Record<string, string> = {
  Outfit: "Outfit:wght@300;400;500;600;700",
  Syne: "Syne:wght@700;800",
  Newsreader: "Newsreader:opsz,wght@6..72,500;6..72,700",
  Sora: "Sora:wght@400;500;600;700",
};

function ensureFonts(appearance: Appearance) {
  const names = [...new Set([appearance.fontSans, appearance.fontDisplay, "Outfit", "Syne"])];
  const href = `https://fonts.googleapis.com/css2?family=${names.map((name) => FONT_QUERY[name] ?? `${name}:wght@400;700`).join("&family=")}&display=swap`;
  let link = document.querySelector<HTMLLinkElement>("link[data-vela-fonts]");
  if (!link) {
    link = document.createElement("link");
    link.rel = "stylesheet";
    link.setAttribute("data-vela-fonts", "1");
    document.head.appendChild(link);
  }
  if (link.href !== href) link.href = href;
}

export function LibraryBoot() {
  useEffect(() => {
    let alive = true;
    void (async () => {
      await useLibrary.persist.rehydrate();
      if (!alive) return;
      await bootstrapShelf();
      if (!alive) return;
      const stored = localStorage.getItem("lunar-library");
      if (!stored) useLibrary.getState().setTheme(getDoc().appearance.preset);
      ensureFonts(getDoc().appearance);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    ensureFonts(getDoc().appearance);
    return subscribeCatalog(() => ensureFonts(getDoc().appearance));
  }, []);

  return null;
}

export function Ago({ at }: { at: number }) {
  const [label, setLabel] = useState("earlier");
  useEffect(() => setLabel(ago(at)), [at]);
  return <span>{label}</span>;
}

export function When({ at }: { at: number }) {
  const [label, setLabel] = useState("Scheduled");
  useEffect(() => {
    setLabel(
      new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(at * 1000),
    );
  }, [at]);
  return <span className="tabular-nums">{label}</span>;
}