import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import {
  deleteProductImage,
  fetchProducts,
  uploadProductImage,
  type ProductWithUrl,
} from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Product manager — Haseenaa by Hasneet Kaur" },
      {
        name: "description",
        content: "Private product manager for the Haseenaa by Hasneet Kaur shop.",
      },
      { property: "og:title", content: "Product manager — Haseenaa by Hasneet Kaur" },
      {
        property: "og:description",
        content: "Add, edit and remove products in the Haseenaa by Hasneet Kaur shop.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const TAGS = ["New", "Linen", "Knit", "Tan"];

function AdminPage() {
  const navigate = useNavigate();
  const { session, user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  if (loading || (session && isAdmin === null)) {
    return <p className="mx-auto max-w-5xl px-6 py-24 text-sm text-muted-foreground">Loading…</p>;
  }
  if (!session) return null;

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-foreground">No access</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This account isn't allowed to manage products.
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="mt-6 border-b border-foreground pb-0.5 text-xs uppercase tracking-[0.2em]"
        >
          Sign out
        </button>
      </section>
    );
  }

  return <ProductManager email={user?.email ?? ""} />;
}

function ProductManager({ email }: { email: string }) {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => fetchProducts(true),
  });

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [tag, setTag] = useState(TAGS[0]!);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const addProduct = useMutation({
    mutationFn: async () => {
      let imagePath: string | null = null;
      if (file) imagePath = await uploadProductImage(file);
      const { error: err } = await supabase.from("products").insert({
        name,
        price,
        tag,
        image_path: imagePath,
        sort_order: products.length,
      });
      if (err) throw err;
    },
    onSuccess: () => {
      setName("");
      setPrice("");
      setFile(null);
      setError(null);
      refresh();
    },
    onError: (e: Error) => setError(e.message),
  });

  const removeProduct = useMutation({
    mutationFn: async (p: ProductWithUrl) => {
      const { error: err } = await supabase.from("products").delete().eq("id", p.id);
      if (err) throw err;
      await deleteProductImage(p.image_path);
    },
    onSuccess: refresh,
    onError: (e: Error) => setError(e.message),
  });

  const toggleVisible = useMutation({
    mutationFn: async (p: ProductWithUrl) => {
      const { error: err } = await supabase
        .from("products")
        .update({ is_published: !p.is_published })
        .eq("id", p.id);
      if (err) throw err;
    },
    onSuccess: refresh,
    onError: (e: Error) => setError(e.message),
  });

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Studio</p>
          <h1 className="mt-2 font-serif text-4xl text-foreground">Your products</h1>
          <p className="mt-2 text-sm text-muted-foreground">Signed in as {email}</p>
        </div>
        <div className="flex items-center gap-5">
          <Link
            to="/shop"
            className="border-b border-border pb-0.5 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-primary"
          >
            View shop
          </Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="border-b border-border pb-0.5 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-primary"
          >
            Sign out
          </button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addProduct.mutate();
        }}
        className="mt-10 grid gap-5 border border-border p-6 sm:grid-cols-2"
      >
        <h2 className="font-serif text-2xl text-foreground sm:col-span-2">Add a product</h2>
        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent pb-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Price</label>
          <input
            required
            placeholder="₹2,400"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent pb-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Category
          </label>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent pb-2 text-sm outline-none focus:border-primary"
          >
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 w-full text-sm text-muted-foreground file:mr-3 file:border file:border-border file:bg-transparent file:px-3 file:py-1 file:text-xs file:uppercase file:tracking-[0.15em]"
          />
        </div>
        {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={addProduct.isPending}
            className="bg-primary px-8 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60"
          >
            {addProduct.isPending ? "Saving…" : "Add product"}
          </button>
        </div>
      </form>

      <div className="mt-12">
        <h2 className="font-serif text-2xl text-foreground">
          In your shop ({products.length})
        </h2>
        {isLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
        ) : products.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Nothing here yet — add your first product above.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {products.map((p) => (
              <li key={p.id} className="flex items-center gap-5 py-4">
                <div className="h-20 w-16 shrink-0 overflow-hidden bg-muted">
                  {p.imageUrl && (
                    <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-lg text-foreground">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.price} · {p.tag}
                    {!p.is_published && " · hidden"}
                  </p>
                </div>
                <button
                  onClick={() => toggleVisible.mutate(p)}
                  className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-primary"
                >
                  {p.is_published ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove "${p.name}"?`)) removeProduct.mutate(p);
                  }}
                  className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-destructive"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
