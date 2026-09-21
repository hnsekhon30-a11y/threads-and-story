import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Haseenaa by Hasneet Kaur" },
      {
        name: "description",
        content:
          "Browse Haseenaa by Hasneet Kaur collections: linen separates, pastel blue layers and dusty rose knitwear, made from natural fibres.",
      },
      { property: "og:title", content: "Shop — Haseenaa by Hasneet Kaur" },
      {
        property: "og:description",
        content:
          "Linen separates, pastel blue layers and dusty rose knitwear, made from natural fibres.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

const FILTERS = ["All", "Linen", "Knit", "New", "Tan"] as const;

function ShopPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  const items = filter === "All" ? products : products.filter((p) => p.tag === filter);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="border-b border-border pb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">The Shop</p>
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

      {isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">
          Nothing here yet — new pieces are on their way.
        </p>
      ) : (
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <article key={p.id} className="group">
              <div className="relative overflow-hidden bg-muted">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    width={800}
                    height={1000}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="aspect-[4/5] w-full" />
                )}
                <span className="absolute left-3 top-3 bg-background/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground">
                  {p.tag}
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h2 className="font-serif text-xl text-foreground">{p.name}</h2>
                <span className="text-sm text-foreground/70">{p.price}</span>
              </div>
              {p.description && (
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
