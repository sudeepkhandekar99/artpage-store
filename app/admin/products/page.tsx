import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { deleteProduct, updateProduct } from "./actions";
import ProductFormFields from "./ProductFormFields";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const BUCKET = "product-images";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  dimensions: string | null;
  category: string;
  sku: string | null;
  png_image_path: string | null;
  jpg_image_path: string | null;
  alt_text: string | null;
  status: string;
  featured: boolean;
  created_at: string;
};

type PageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    featured?: string;
  }>;
};

function publicImageUrl(path: string | null) {
  if (!path) return null;

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const category = params.category || "all";
  const status = params.status || "all";
  const featured = params.featured || "all";

  let query = supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  if (category !== "all") {
    query = query.eq("category", category);
  }

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (featured === "true") {
    query = query.eq("featured", true);
  }

  if (featured === "false") {
    query = query.eq("featured", false);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const products = (data || []) as Product[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            All Products
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Filter, review, edit, and delete your products.
          </p>
        </div>

        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <form
            action="/admin/products"
            className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                name="q"
                placeholder="Search by product name"
                defaultValue={q}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                name="category"
                defaultValue={category}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All</option>
                <option value="canvas">Canvas</option>
                <option value="vinyl">Vinyl</option>
                <option value="bookmark">Bookmark</option>
                <option value="print">Print</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                defaultValue={status}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Featured</label>
              <select
                name="featured"
                defaultValue={featured}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All</option>
                <option value="true">Featured</option>
                <option value="false">Not Featured</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button type="submit" className="flex-1 md:flex-none">
                Filter
              </Button>

              <Button asChild variant="outline" className="flex-1 md:flex-none">
                <Link href="/admin/products">Clear</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {products.length} product{products.length === 1 ? "" : "s"}
        </p>
      </div>

      <Separator />

      <div className="grid gap-5">
        {products.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No products found. Try clearing the filters or add a new product.
            </CardContent>
          </Card>
        )}

        {products.map((product) => {
          const imageUrl =
            publicImageUrl(product.jpg_image_path) ||
            publicImageUrl(product.png_image_path);

          return (
            <Card key={product.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
                  <div className="flex h-[180px] w-full items-center justify-center rounded-lg border bg-muted lg:w-[180px]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.alt_text || product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No image
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 space-y-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words text-xl font-medium">
                          {product.name}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="secondary">{product.category}</Badge>
                          <Badge>{product.status}</Badge>
                          {product.featured && (
                            <Badge variant="outline">Featured</Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-lg font-semibold">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </div>

                    <details className="rounded-lg border p-4">
                      <summary className="cursor-pointer text-sm font-medium">
                        Edit Product
                      </summary>

                      <form action={updateProduct} className="mt-5 space-y-6">
                        <input type="hidden" name="id" value={product.id} />

                        <ProductFormFields
                          product={product}
                          imageLabel="Replace Images"
                        />

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <Button type="submit" className="w-full sm:w-auto">
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </details>

                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <Button
                        type="submit"
                        variant="destructive"
                        className="w-full sm:w-auto"
                      >
                        Delete Product
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}