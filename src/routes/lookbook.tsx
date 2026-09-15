import { createFileRoute } from "@tanstack/react-router";
import lookbook from "@/assets/lookbook.jpg";
import collection1 from "@/assets/collection-1.jpg";
import collection2 from "@/assets/collection-2.jpg";
import collection3 from "@/assets/collection-3.jpg";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "Lookbook — Haseenaa by Hasneet Kaur" },
      {
        name: "description",
        content:
          "The Haseenaa by Hasneet Kaur autumn lookbook: soft layering, natural light and a quiet palette of rose, beige, tan and sage.",
      },
      { property: "og:title", content: "Lookbook — Haseenaa by Hasneet Kaur" },
      {
        property: "og:description",
        content:
          "Soft layering, natural light and a quiet palette of rose, beige, tan and sage.",
      },
    ],
  }),
  component: LookbookPage,
});

const FRAMES = [
  { image: hero, caption: "Frame 01 — Rose linen, studio light" },
  { image: collection2, caption: "Frame 02 — Blue hour, tan layering" },
  { image: collection3, caption: "Frame 03 — Dusty rose knit, close" },
  { image: collection1, caption: "Frame 04 — Sage and sand, flat" },
];

function LookbookPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Autumn / Winter 2026
        </p>
        <h1 className="mt-3 font-serif text-5xl text-foreground">The Lookbook</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          A quiet season photographed in natural light. Every frame is shoppable —
          tap a look to find the pieces behind it.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden bg-muted">
          <img
            src={lookbook}
            alt="Haseenaa by Hasneet Kaur lookbook editorial, two models in soft beige and sage"
            width={1024}
            height={1280}
            className="w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
          {FRAMES.map((f, i) => (
            <figure key={f.caption} className={i % 2 === 1 ? "sm:mt-20" : ""}>
              <div className="overflow-hidden bg-muted">
                <img
                  src={f.image}
                  alt={f.caption}
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <figcaption className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {f.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
