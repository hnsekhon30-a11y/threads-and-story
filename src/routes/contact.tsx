import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Rosewood" },
      {
        name: "description",
        content:
          "Get in touch with Rosewood — find our studio, ask about a piece, or join the newsletter for early access to new collections.",
      },
      { property: "og:title", content: "Contact — Rosewood" },
      {
        property: "og:description",
        content:
          "Find our studio, ask about a piece, or join the newsletter for early access to new collections.",
      },
    ],
  }),
  component: ContactPage,
});

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full border-b border-border bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-14 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Contact
          </p>
          <h1 className="mt-3 font-serif text-5xl text-foreground">
            Say hello
          </h1>
          <p className="mt-4 max-w-md text-sm text-foreground/70">
            Questions about a piece, a custom order, or press — we'd love to hear
            from you. We answer within two working days.
          </p>

          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Studio
              </dt>
              <dd className="mt-1 text-foreground/80">
                12 Linen Mews, Bethnal Green<br />London E2 6AH
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 text-foreground/80">
                <a href="mailto:hello@rosewood.example" className="hover:text-primary">
                  hello@rosewood.example
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Studio hours
              </dt>
              <dd className="mt-1 text-foreground/80">
                Tue – Sat, 10:00 – 18:00
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-card p-8 sm:p-10">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <h2 className="font-serif text-3xl text-foreground">Thank you</h2>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                Your message is on its way. We'll be in touch shortly.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 border-b border-foreground pb-0.5 text-xs uppercase tracking-[0.2em] text-foreground hover:border-primary hover:text-primary"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-7"
            >
              <Field label="Name">
                <input required type="text" placeholder="Your name" className={inputClass} />
              </Field>
              <Field label="Email">
                <input required type="email" placeholder="you@example.com" className={inputClass} />
              </Field>
              <Field label="Message">
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help?"
                  className={inputClass + " resize-none"}
                />
              </Field>
              <button
                type="submit"
                className="w-full bg-primary py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
