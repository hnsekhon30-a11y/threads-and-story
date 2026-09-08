import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import collection1 from "@/assets/collection-1.jpg";
import collection2 from "@/assets/collection-2.jpg";
import collection3 from "@/assets/collection-3.jpg";
import collection4 from "@/assets/collection-4.jpg";
import collection5 from "@/assets/collection-5.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Rosewood" },
      {
        name: "description",
        content:
          "Browse Rosewood collections: linen separates, pastel blue layers and dusty rose knitwear, made from natural fibres.",
      },
      { property: "og:title", content: "Shop — Rosewood" },
      {
        property: "og:description",
        content:
          "Linen separates, pastel blue layers and dusty rose knitwear, made from natural fibres.",
      },
    ],
  }),
  component: ShopPage,
});

const PRODUCTS = [
  { name: "Sage Linen Trousers", price: "£120", image: collection1, tag: "Linen" },
  { name: "Blue Hour Shirt", price: "£95", image: collection2, tag: "New" },
  { name: "Rose Knit Sweater", price: "£140", image: collection3, tag: "Knit" },
  { name: "Sand Linen Dress", price: "£160", image: hero, tag: "Linen" },
  { name: "Pastel Blue Coat", price: "£260", image: collection2, tag: "New" },
  { name: "Tan Wide Trouser", price: "£110", image: collection1, tag: "Tan" },
];

const FILTERS = ["All", "Linen", "Knit", "New", "Tan"] as const;

function ShopPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const items =
    filter === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.tag === filter);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="border-b border-border pb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          The Shop
        </p>
        <h1 className="mt-2 font-serif text-5xl text-foreground">All collections</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Every piece is cut from natural fibres and finished in small batches.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "border pb-1 text-xs uppercase tracking-[0.15em] transition-colors " +
              (filter === f
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground")
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <article key={p.name} className="group">
            <div className="relative overflow-hidden bg-muted">
              <img
                src={p.image}
                alt={p.name}
                width={800}
                height={1000}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 bg-background/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground">
                {p.tag}
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <h2 className="font-serif text-xl text-foreground">{p.name}</h2>
              <span className="text-sm text-foreground/70">{p.price}</span>
            </div>
            <button className="mt-3 border-b border-border pb-0.5 text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              Add to bag
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
