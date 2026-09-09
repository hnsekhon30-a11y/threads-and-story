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
  const [progress, setProgress] = useState(0);

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
        {/* Infinite square-photo marquee */}
        <div
          className="transition-opacity duration-700"
          style={{ opacity: clamp(progress * 2.2) }}
        >
          <div className="animate-marquee flex w-max gap-6 px-3 hover:[animation-play-state:paused]">
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
            className="font-serif text-[16vw] leading-none text-foreground mix-blend-difference sm:text-[13vw]"
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
