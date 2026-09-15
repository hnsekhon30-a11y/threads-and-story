import { createFileRoute, Link } from "@tanstack/react-router";
import { LookbookIntro } from "@/components/LookbookIntro";
import collection1 from "@/assets/collection-1.jpg";
import collection2 from "@/assets/collection-2.jpg";
import collection3 from "@/assets/collection-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Haseenaa by Hasneet Kaur — Soft, considered clothing" },
      {
        name: "description",
        content:
          "Haseenaa by Hasneet Kaur is a clothing brand built on natural fibres, slow craft and a soft palette of rose, beige, tan, sage and pastel blue.",
      },
      { property: "og:title", content: "Haseenaa by Hasneet Kaur — Soft, considered clothing" },
      {
        property: "og:description",
        content:
          "Natural fibres, slow craft and a soft palette of rose, beige, tan, sage and pastel blue.",
      },
    ],
  }),
  component: Index,
});

const COLLECTIONS = [
  {
    name: "The Linen Edit",
    blurb: "Breathable linen in sage and sand.",
    image: collection1,
    to: "/shop" as const,
  },
  {
    name: "Blue Hour",
    blurb: "Pastel blue meets warm tan.",
    image: collection2,
    to: "/shop" as const,
  },
  {
    name: "Rose Knit",
    blurb: "Hand-finished knitwear in dusty rose.",
    image: collection3,
    to: "/shop" as const,
  },
];

function Index() {
  return (
    <>
      {/* Full-screen name + lookbook carousel */}
      <LookbookIntro />

      <section className="mx-auto max-w-7xl px-6 pt-20">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Autumn / Winter 2026
        </p>
        <h2 className="mt-5 max-w-2xl text-balance font-serif text-5xl leading-[1.05] text-foreground">
          Soft on the skin, slow by design.
        </h2>
        <p className="mt-5 max-w-md text-sm text-muted-foreground">
          Clothing made from natural fibres in small batches — rose, beige, tan,
          sage and a whisper of pastel blue.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-block border-b border-foreground pb-1 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Shop the collection
        </Link>
      </section>


      {/* Collections grid */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Featured
            </p>
            <h2 className="mt-2 font-serif text-4xl text-foreground">Collections</h2>
          </div>
          <Link
            to="/shop"
            className="hidden border-b border-foreground pb-0.5 text-xs uppercase tracking-[0.2em] text-foreground hover:border-primary hover:text-primary sm:inline-block"
          >
            View all
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.name}
              to={c.to}
              className="group block"
            >
              <div className="overflow-hidden bg-muted">
                <img
                  src={c.image}
                  alt={c.name}
                  width={800}
                  height={1000}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="font-serif text-2xl text-foreground">{c.name}</h3>
                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  Explore
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Lookbook band */}
      <section className="bg-accent/30">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              The Lookbook
            </p>
            <h2 className="mt-3 font-serif text-4xl text-foreground">
              A quiet season, in pictures.
            </h2>
            <p className="mt-4 max-w-md text-sm text-foreground/70">
              Soft layering, natural light and the colours of a slow autumn.
              Browse the full editorial and find the pieces behind each frame.
            </p>
            <Link
              to="/lookbook"
              className="mt-8 inline-block border-b border-foreground pb-1 text-xs uppercase tracking-[0.2em] text-foreground hover:border-primary hover:text-primary"
            >
              See the lookbook
            </Link>
          </div>
          <div className="overflow-hidden bg-muted">
            <img
              src={collection2}
              alt="A look from the haseenaabyhasneetkaur lookbook"
              width={800}
              height={1000}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
