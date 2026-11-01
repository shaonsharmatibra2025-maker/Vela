import { useEffect, useRef, useState } from "react";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import type { Media } from "@/data/catalog";
import { resolvePlayback } from "@/lib/playback";
import { clock, episodeThumb } from "@/lib/format";
import { cn } from "@/lib/cn";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (s: number, allow: boolean) => void;
  setVolume: (n: number) => void;
  mute: () => void;
  unMute: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function Theater({
  media,
  episode,
  onPlay,
}: {
  media: Media;
  episode: number;
  onPlay: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [ytError, setYtError] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(80);
  const [muted, setMuted] = useState(false);
  const volRef = useRef(vol);
  volRef.current = vol;
  const thumb = episodeThumb(media, episode);
  const play = resolvePlayback(media, episode);
  const trailerId = play.type === "youtube" ? play.id : null;

  useEffect(() => {
    setStarted(false);
    setPaused(false);
    setReady(false);
    setYtError(false);
    setTime(0);
    setDur(0);
  }, [media.id, episode]);

  useEffect(() => {
    if (!started || !trailerId) return;
    const host = hostRef.current;
    if (!host) return;
    let dead = false;
    let timer = 0;
    let player: YTPlayer | null = null;
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
          origin: window.location.origin,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            if (dead) return;
            playerRef.current = e.target;
            e.target.setVolume(volRef.current);
            e.target.playVideo();
            setReady(true);
            setDur(e.target.getDuration() || 0);
          },
          onError: () => setYtError(true),
        },
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
    }, 7000);

    return () => {
      dead = true;
      window.clearInterval(timer);
      window.clearTimeout(fail);
      try {
        player?.destroy();
      } catch {
        /* player may already be gone */
      }
      playerRef.current = null;
      host.replaceChildren();
    };
  }, [started, media.id, trailerId]);

  if (play.type === "file" || play.type === "image" || play.type === "iframe") {
    return (
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="relative aspect-video bg-bg">
          {play.type === "image" && <img src={play.url} alt="" className="h-full w-full object-contain" />}
          {play.type === "file" && (
            <video key={play.url} src={play.url} controls playsInline poster={thumb} className="h-full w-full bg-bg" onPlay={onPlay} />
          )}
          {play.type === "iframe" && (
            <iframe
              key={play.src}
              title={media.title}
              src={play.src}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}
        </div>
      </div>
    );
  }

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

  return (
    <div ref={frameRef} className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="relative aspect-video bg-bg">
        <div ref={hostRef} className={cn("absolute inset-0", (!started || ytError || !trailerId) && "hidden")} />
        {started && ytError && trailerId && (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&rel=0`}
            title={`${media.title} official trailer`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
        {(!started || (!trailerId && started)) && (
          <button type="button" className="absolute inset-0" onClick={toggle}>
            <img src={thumb} alt="" className="h-full w-full object-cover" />
            <span className="absolute inset-0 bg-bg/30" />
            {trailerId ? (
              <span className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-accent-ink">
                <Play className="size-7" fill="currentColor" />
              </span>
            ) : (
              <span className="absolute inset-x-6 bottom-6 rounded-xl bg-bg/80 px-4 py-3 text-sm text-fg">
                No official trailer is on file. You can still log this {media.kind === "MANGA" ? "chapter" : "episode"}.
              </span>
            )}
          </button>
        )}
        {showCustom && (
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bg via-bg/80 to-transparent px-3 pt-10 pb-3">
            <input
              aria-label="Trailer position"
              type="range"
              min={0}
              max={dur || 0}
              step={0.1}
              value={Math.min(time, dur || 0)}
              onChange={(e) => {
                const next = Number(e.target.value);
                playerRef.current?.seekTo(next, true);
                setTime(next);
              }}
              className="mb-2 w-full"
            />
            <div className="flex items-center gap-2">
              <button type="button" className="grid size-11 place-items-center text-fg" onClick={toggle} aria-label={paused ? "Play" : "Pause"}>
                {paused || !ready ? <Play className="size-5" fill="currentColor" /> : <Pause className="size-5" fill="currentColor" />}
              </button>
              <span className="text-micro text-muted tabular-nums">
                {clock(time)} / {clock(dur)}
              </span>
              <button
                type="button"
                className="grid size-11 place-items-center text-fg"
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={() => {
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
                }}
              >
                {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              </button>
              <input
                aria-label="Volume"
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : vol}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setVol(next);
                  setMuted(next === 0);
                  playerRef.current?.setVolume(next);
                  if (next > 0) playerRef.current?.unMute();
                }}
                className="w-20"
              />
              <button
                type="button"
                className="ml-auto grid size-11 place-items-center text-fg"
                aria-label="Full screen"
                onClick={() => {
                  const el = frameRef.current;
                  if (!el) return;
                  if (document.fullscreenElement) void document.exitFullscreen();
                  else void el.requestFullscreen();
                }}
              >
                <Maximize className="size-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
