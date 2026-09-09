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

export function LookbookIntro() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  // Keep scroll position inside the first copy so the loop feels endless
  const normalize = () => {
    const el = trackRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    if (half <= 0) return;
    if (el.scrollLeft >= half) el.scrollLeft -= half;
    else if (el.scrollLeft < 0) el.scrollLeft += half;
  };

  // Auto-advance
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      const el = trackRef.current;
      if (el && !paused && !dragRef.current.active) {
        el.scrollLeft += (dt / 1000) * 60; // px per second
        normalize();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("figure");
    const width = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * width, behavior: "smooth" });
    window.setTimeout(normalize, 450);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    const d = dragRef.current;
    if (!el || !d.active) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    el.scrollLeft = d.startScroll - dx;
    normalize();
  };

  const endDrag = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    dragRef.current.active = false;
  };


  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const p = clamp((window.scrollY - el.offsetTop) / (total || 1));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Name: full-screen centred -> small, top-left
  const scale = 1 - 0.72 * progress;
  const x = -progress * 38;
  const y = -progress * 38;
  const revealed = progress > 0.35;

  return (
    <div ref={wrapRef} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden bg-background">
        {/* Endless, swipeable square-photo carousel */}
        <div
          className="group/car relative transition-opacity duration-700"
          style={{ opacity: clamp(progress * 2.2) }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
            className="flex cursor-grab gap-6 overflow-x-auto px-3 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
            style={{ touchAction: "pan-y", overscrollBehaviorX: "contain" }}
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
            className="font-serif text-[16vw] leading-none text-foreground sm:text-[13vw]"
            style={{
              transform: `translate(${x}vw, ${y}vh) scale(${scale})`,
              transformOrigin: "center",
              opacity: 1 - progress * 0.45,
              willChange: "transform",
            }}
          >
            Rosewood
          </h1>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center text-xs uppercase tracking-[0.25em] text-foreground/60 transition-opacity duration-300"
          style={{ opacity: progress > 0.05 ? 0 : 1 }}
        >
          Scroll
        </div>
      </div>
    </div>
  );
}
