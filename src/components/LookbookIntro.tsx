import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import lookbook from "@/assets/lookbook.jpg";
import collection1 from "@/assets/collection-1.jpg";
import collection2 from "@/assets/collection-2.jpg";
import collection3 from "@/assets/collection-3.jpg";

const SLIDES = [
  { image: hero, caption: "Rose linen, studio light" },
  { image: collection2, caption: "Blue hour, tan layering" },
  { image: collection3, caption: "Dusty rose knit" },
  { image: lookbook, caption: "Sage and sand" },
  { image: collection1, caption: "The linen edit" },
];

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const SPEED = 42; // px per second

export function LookbookIntro() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(false);

  const paused = useRef(false);
  const offset = useRef(0);
  const velocity = useRef(0);
  const target = useRef<number | null>(null);
  const drag = useRef({ active: false, lastX: 0, lastT: 0, id: -1 });
  const progress = useRef(0);
  const shown = useRef(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const el = trackRef.current;
      if (el) {
        const half = el.scrollWidth / 2 || 1;

        if (drag.current.active) {
          // offset already updated by pointer move
        } else if (target.current !== null) {
          const diff = target.current - offset.current;
          offset.current += diff * Math.min(1, dt * 8);
          if (Math.abs(diff) < 0.6) {
            offset.current = target.current;
            target.current = null;
          }
        } else if (Math.abs(velocity.current) > 8) {
          offset.current += velocity.current * dt;
          velocity.current *= Math.exp(-3 * dt);
        } else {
          velocity.current = 0;
          if (!paused.current) offset.current += SPEED * dt;
        }

        offset.current = ((offset.current % half) + half) % half;
        el.style.transform = `translate3d(${-offset.current}px,0,0)`;
      }

      // eased scroll progress for the name
      const wrap = wrapRef.current;
      if (wrap) {
        const total = wrap.offsetHeight - window.innerHeight;
        progress.current = clamp((window.scrollY - wrap.offsetTop) / (total || 1));
      }
      shown.current += (progress.current - shown.current) * Math.min(1, dt * 9);
      const p = shown.current;
      const name = nameRef.current;
      if (name) {
        name.style.transform = `translate3d(${-p * 38}vw, ${-p * 38}vh, 0) scale(${1 - 0.72 * p})`;
        name.style.opacity = String(1 - p * 0.45);
      }
      const parent = trackRef.current?.parentElement;
      if (parent) parent.style.opacity = String(clamp(p * 2.2));
      setRevealed(p > 0.35);
      setStarted(p > 0.05);

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("figure");
    const width = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    velocity.current = 0;
    target.current = offset.current + dir * width;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, lastX: e.clientX, lastT: performance.now(), id: e.pointerId };
    velocity.current = 0;
    target.current = null;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    const now = performance.now();
    const dx = e.clientX - d.lastX;
    const dt = Math.max(8, now - d.lastT) / 1000;
    offset.current -= dx;
    velocity.current = -dx / dt;
    d.lastX = e.clientX;
    d.lastT = now;
  };

  const endDrag = (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    if (performance.now() - drag.current.lastT > 120) velocity.current = 0;
    drag.current.active = false;
  };

  return (
    <div ref={wrapRef} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden bg-background">
        {/* Endless, swipeable square-photo carousel */}
        <div
          className="relative"
          style={{ opacity: 0 }}
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onTouchStart={() => (paused.current = true)}
              onTouchEnd={() => (paused.current = false)}
              className="flex w-max cursor-grab gap-6 px-3 active:cursor-grabbing"
              style={{ touchAction: "pan-y", willChange: "transform" }}
            >
              {[...SLIDES, ...SLIDES].map((s, i) => (
                <figure
                  key={`${s.caption}-${i}`}
                  className="relative aspect-square h-[58vh] shrink-0 overflow-hidden sm:h-[64vh]"
                >
                  <img
                    src={s.image}
                    alt={s.caption}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/70 to-transparent p-5 pt-12 text-xs uppercase tracking-[0.25em] text-foreground/80">
                    {s.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => step(-1)}
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 border border-foreground/30 bg-background/70 px-3 py-2 text-xs uppercase tracking-[0.2em] text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary sm:block"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => step(1)}
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 border border-foreground/30 bg-background/70 px-3 py-2 text-xs uppercase tracking-[0.2em] text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary sm:block"
          >
            →
          </button>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-10 mx-auto flex max-w-7xl items-end justify-between px-6 transition-opacity duration-500"
          style={{ opacity: revealed ? 1 : 0 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/70">
            Autumn / Winter 2026
          </p>
          <Link
            to="/lookbook"
            className="pointer-events-auto border-b border-foreground pb-1 text-xs uppercase tracking-[0.2em] text-foreground hover:border-primary hover:text-primary"
          >
            See the lookbook
          </Link>
        </div>

        {/* Big name that shrinks into the top-left corner */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <h1
            ref={nameRef}
            className="font-serif text-[16vw] leading-none text-foreground sm:text-[13vw]"
            style={{ transformOrigin: "center", willChange: "transform" }}
          >
            Rosewood
          </h1>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center text-xs uppercase tracking-[0.25em] text-foreground/60 transition-opacity duration-300"
          style={{ opacity: started ? 0 : 1 }}
        >
          Scroll
        </div>
      </div>
    </div>
  );
}
