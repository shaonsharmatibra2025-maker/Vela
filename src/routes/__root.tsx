import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { useSyncExternalStore, type CSSProperties } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { LibraryBoot } from "@/components/boot";
import { getDoc, subscribeCatalog } from "@/data/catalog";
import { fontStack, type Palette } from "@/data/site";
import { useLibrary } from "@/lib/library";
import appCss from "../styles.css?url";

function useSiteDoc() {
  return useSyncExternalStore(subscribeCatalog, getDoc, getDoc);
}

function colorStyle(colors: Palette): CSSProperties {
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
    "--color-gold": colors.gold,
  } as CSSProperties;
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vela" },
      { name: "description", content: "Vela is a cinematic anime and manga shelf with official trailers and a watch log that stays on this device." },
      { name: "theme-color", content: "#070708" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,700&family=Outfit:wght@300;400;500;600;700&family=Sora:wght@400;500;600;700&family=Syne:wght@700;800&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  const doc = useSiteDoc();
  const reduceMotion = useLibrary((s) => s.reduceMotion);
  const theme = doc.appearance.preset;
  const effects = doc.appearance.effects;
  const style = {
    ...(theme === "custom" ? colorStyle(doc.appearance.colors) : {}),
    "--font-sans": fontStack(doc.appearance.fontSans),
    "--font-display": fontStack(doc.appearance.fontDisplay, true),
  } as CSSProperties;

  return (
    <html
      lang="en"
      className="antialiased"
      data-theme={theme}
      data-motion={reduceMotion ? "reduce" : "full"}
      data-marquee={effects.marquee ? "on" : "off"}
      data-lift={effects.posterLift ? "on" : "off"}
      data-hero={effects.heroFade ? "on" : "off"}
      data-page={effects.pageFade ? "on" : "off"}
      data-press={effects.press ? "on" : "off"}
      style={style}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg" suppressHydrationWarning>
        <PreviewHostBridge />
        <LibraryBoot />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}