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
  const stageRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(false);

  const paused = useRef(false);
  const offset = useRef(0);
  const velocity = useRef(0);
  const target = useRef<number | null>(null);
  const drag = useRef({ active: false, lastX: 0, lastT: 0, id: -1, pendingDx: 0 });
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
          // apply pointer movement accumulated since the last frame
          const dx = drag.current.pendingDx;
          drag.current.pendingDx = 0;
          offset.current -= dx;
          // exponential moving average keeps the throw velocity stable
          const instant = -dx / dt;
          velocity.current += (instant - velocity.current) * Math.min(1, dt * 12);
        } else if (target.current !== null) {
          const diff = target.current - offset.current;
          offset.current += diff * (1 - Math.exp(-9 * dt));
          if (Math.abs(diff) < 0.4) {
            offset.current = target.current;
            target.current = null;
          }
        } else if (Math.abs(velocity.current) > SPEED) {
          offset.current += velocity.current * dt;
          // decay towards the idle drift speed instead of towards zero
          const dir = Math.sign(velocity.current);
          const rest = dir >= 0 ? SPEED : -SPEED;
          velocity.current = rest + (velocity.current - rest) * Math.exp(-2.6 * dt);
        } else {
          velocity.current = 0;
          if (!paused.current) offset.current += SPEED * dt;
        }

        offset.current = ((offset.current % half) + half) % half;
        el.style.transform = `translate3d(${-Math.round(offset.current * 100) / 100}px,0,0)`;
      }

      // The reference completes its logo hand-off within a short, deliberate scroll.
      const wrap = wrapRef.current;
      if (wrap) {
        const total = wrap.offsetHeight - window.innerHeight;
        progress.current = clamp((window.scrollY - wrap.offsetTop) / (total || 1));
      }
      shown.current += (progress.current - shown.current) * (1 - Math.exp(-9 * dt));
      const p = shown.current;
      // slow-in / slow-out curve, like the reference site's title hand-off
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      const name = nameRef.current;
      if (name) {
        const scale = 1 - 0.82 * e;
        const untransformedWidth = name.offsetWidth;
        const viewportGutter = window.innerWidth < 640 ? 24 : 32;
        const targetCenterX = viewportGutter + (untransformedWidth * 0.18) / 2;
        const translateX = targetCenterX - window.innerWidth / 2;
        const targetY = window.innerWidth < 640 ? -64 : -78;
        name.style.transform = `translate3d(${translateX * e}px, ${targetY * e}px, 0) scale(${scale})`;
        name.style.opacity = String(1 - clamp((p - 0.88) / 0.12));
      }

      // Keep the lookbook visible throughout, with the subtle settling motion
      // used by the reference rather than a delayed fade-in.
      const stage = stageRef.current;
      if (stage) {
        stage.style.transform = `translate3d(0, ${-e * 3}vh, 0) scale(${1.035 - 0.035 * e})`;
      }
      setRevealed(p > 0.22);
      setStarted(p > 0.025);


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
    const from = target.current ?? offset.current;
    target.current = from + dir * width;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = {
      active: true,
      lastX: e.clientX,
      lastT: performance.now(),
      id: e.pointerId,
      pendingDx: 0,
    };
    velocity.current = 0;
    target.current = null;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active || d.id !== e.pointerId) return;
    // coalesced events give sub-frame precision on high-rate touch screens
    const events =
      typeof e.nativeEvent.getCoalescedEvents === "function"
        ? e.nativeEvent.getCoalescedEvents()
        : [];
    const points = events.length ? events : [e.nativeEvent];
    for (const p of points) {
      d.pendingDx += p.clientX - d.lastX;
      d.lastX = p.clientX;
    }
    d.lastT = performance.now();
  };

  const endDrag = (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    if (!drag.current.active) return;
    // a long pause before release means the finger stopped: no fling
    if (performance.now() - drag.current.lastT > 90) velocity.current = 0;
    velocity.current = Math.max(-3200, Math.min(3200, velocity.current));
    drag.current.active = false;
    drag.current.pendingDx = 0;
  };


  return (
    <div ref={wrapRef} className="relative h-[165vh] sm:h-[145vh]">
      <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden bg-background">
        {/* Endless, swipeable square-photo carousel */}
        <div
          ref={stageRef}
          className="relative"
          style={{ willChange: "transform" }}
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
                  className="relative aspect-square h-[66vh] shrink-0 overflow-hidden sm:h-[72vh]"
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

        {/* Oversized masthead that resolves into the upper-left brand position */}
        <div className="pointer-events-none absolute inset-x-0 top-5 z-10 flex justify-center overflow-visible sm:top-7">
          <h1
            ref={nameRef}
            className="font-sans text-[15vw] font-semibold uppercase leading-none tracking-normal text-foreground sm:text-[13rem]"
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
