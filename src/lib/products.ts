import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  price: string;
  tag: string;
  description: string;
  image_path: string | null;
  sort_order: number;
  is_published: boolean;
};

export type ProductWithUrl = Product & { imageUrl: string | null };

const BUCKET = "product-images";
const SIGNED_URL_TTL = 60 * 60 * 24 * 7; // 7 days

export async function signImageUrls(products: Product[]): Promise<ProductWithUrl[]> {
  const paths = products
    .map((p) => p.image_path)
    .filter((p): p is string => Boolean(p));

  const urlByPath = new Map<string, string>();
  if (paths.length > 0) {
    const { data } = await supabase.storage
      .from(BUCKET)
      .createSignedUrls(paths, SIGNED_URL_TTL);
    for (const entry of data ?? []) {
      if (entry.path && entry.signedUrl) urlByPath.set(entry.path, entry.signedUrl);
    }
  }

  return products.map((p) => ({
    ...p,
    imageUrl: p.image_path ? (urlByPath.get(p.image_path) ?? null) : null,
  }));
}

export async function fetchProducts(includeHidden = false): Promise<ProductWithUrl[]> {
  let query = supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (!includeHidden) query = query.eq("is_published", true);

  const { data, error } = await query;
  if (error) throw error;
  return signImageUrls((data ?? []) as Product[]);
}

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function deleteProductImage(path: string | null) {
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
