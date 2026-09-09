import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import lookbook from "@/assets/lookbook.jpg";
import collection1 from "@/assets/collection-1.jpg";
import collection2 from "@/assets/collection-2.jpg";
import collection3 from "@/assets/collection-3.jpg";

const SLIDES = [
  { image: hero, caption: "Frame 01 — Rose linen, studio light" },
  { image: collection2, caption: "Frame 02 — Blue hour, tan layering" },
  { image: collection3, caption: "Frame 03 — Dusty rose knit" },
  { image: lookbook, caption: "Frame 04 — Sage and sand" },
  { image: collection1, caption: "Frame 05 — The linen edit" },
];

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

export function LookbookIntro() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

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

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      5000,
    );
    return () => window.clearInterval(id);
  }, []);

  const go = (dir: number) =>
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);

  // Name: full-screen centred -> small, top-left
  const scale = 1 - 0.72 * progress;
  const x = -progress * 38;
  const y = -progress * 38;
  const revealed = progress > 0.35;

  return (
    <div ref={wrapRef} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        {/* Carousel */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: clamp(progress * 2.2) }}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          {SLIDES.map((s, i) => (
            <img
              key={s.caption}
              src={s.image}
              alt={s.caption}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              style={{ opacity: i === index ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-background/30" />

          <div
            className="absolute inset-x-0 bottom-10 mx-auto flex max-w-7xl items-end justify-between px-6 transition-opacity duration-500"
            style={{ opacity: revealed ? 1 : 0 }}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/70">
                Autumn / Winter 2026
              </p>
              <p className="mt-3 font-serif text-3xl text-foreground">
                {SLIDES[index].caption}
              </p>
              <Link
                to="/lookbook"
                className="mt-5 inline-block border-b border-foreground pb-1 text-xs uppercase tracking-[0.2em] text-foreground hover:border-primary hover:text-primary"
              >
                See the lookbook
              </Link>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <button
                aria-label="Previous look"
                onClick={() => go(-1)}
                className="border-b border-foreground pb-0.5 text-xs uppercase tracking-[0.2em] hover:text-primary"
              >
                Prev
              </button>
              <div className="flex gap-2">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.caption}
                    aria-label={`Look ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 w-6 transition-colors ${i === index ? "bg-primary" : "bg-foreground/25"}`}
                  />
                ))}
              </div>
              <button
                aria-label="Next look"
                onClick={() => go(1)}
                className="border-b border-foreground pb-0.5 text-xs uppercase tracking-[0.2em] hover:text-primary"
              >
                Next
              </button>
            </div>
          </div>
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
