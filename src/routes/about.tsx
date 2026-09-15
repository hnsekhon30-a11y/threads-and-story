import { createFileRoute } from "@tanstack/react-router";
import about from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Haseena By Hasneet" },
      {
        name: "description",
        content:
          "Haseena By Hasneet is a clothing brand built on natural fibres, slow craft and a soft, seasonal palette. Our story and our making.",
      },
      { property: "og:title", content: "About — Haseena By Hasneet" },
      {
        property: "og:description",
        content:
          "Natural fibres, slow craft and a soft, seasonal palette — the Haseena By Hasneet story.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    title: "Natural fibres",
    body: "Linen, organic cotton and responsible wool — soft on the skin, kinder to the soil.",
  },
  {
    title: "Small batches",
    body: "We cut and finish in limited runs so nothing is wasted and every piece is considered.",
  },
  {
    title: "A soft palette",
    body: "Rose, beige, tan, sage and pastel blue — colours that rest easy and layer without effort.",
  },
];

function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Our story
            </p>
            <h1 className="mt-3 text-balance font-serif text-5xl leading-[1.05] text-foreground">
              Clothing that feels like a slow morning.
            </h1>
            <p className="mt-5 text-sm text-foreground/70">
              Haseena By Hasneet began in a small atelier with a single idea: that what we
              wear should be as gentle as the day it came from. We choose natural
              fibres, finish in small batches, and let a soft, seasonal palette do
              the talking.
            </p>
            <p className="mt-4 text-sm text-foreground/70">
              Every piece is made to be lived in — to soften, to fade a little,
              and to last.
            </p>
          </div>
          <div className="overflow-hidden bg-muted">
            <img
              src={about}
              alt="The Haseena By Hasneet atelier with fabric swatches in soft tones"
              width={1024}
              height={768}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-accent/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="font-serif text-4xl text-foreground">What we hold to</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title}>
                <h3 className="font-serif text-2xl text-foreground">{v.title}</h3>
                <p className="mt-3 text-sm text-foreground/70">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-serif text-3xl leading-snug text-foreground">
          “We make fewer things, more slowly, in colours that ask nothing of you.”
        </p>
        <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          — The Haseena By Hasneet studio
        </p>
      </section>
    </>
  );
}
