import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { deleteProduct, updateProduct } from "./actions";
import ProductFormFields from "./ProductFormFields";
import ProductFilters from "./ProductFilters";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

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
        <div className="space-y-5 slide-up">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">
                        All Products
                    </h2>
                    <p className="mt-1 text-base font-semibold text-muted-foreground">
                        Filter, review, edit, and delete products.
                    </p>
                </div>

                <Button asChild className="soft-button w-full font-bold sm:w-auto">
                    <Link href="/admin/products/new">Add Product</Link>
                </Button>
            </div>

            <ProductFilters
                q={q}
                category={category}
                status={status}
                featured={featured}
            />

            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-muted-foreground">
                    Showing {products.length} product{products.length === 1 ? "" : "s"}
                </p>
            </div>

            <Separator />

            <div className="grid gap-4">
                {products.length === 0 && (
                    <Card className="soft-card">
                        <CardContent className="p-6 text-sm font-semibold text-muted-foreground">
                            No products found. Clear filters or add a new product.
                        </CardContent>
                    </Card>
                )}

                {products.map((product) => {
                    const imageUrl =
                        publicImageUrl(product.jpg_image_path) ||
                        publicImageUrl(product.png_image_path);

                    return (
                        <Card key={product.id} className="soft-card">
                            <CardContent className="p-4 sm:p-5">
                                <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
                                    <div className="product-image-tile flex h-[150px] w-full items-center justify-center rounded-xl border p-2 sm:h-[160px] lg:w-[160px]">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={product.alt_text || product.name}
                                                className="max-h-full max-w-full object-contain transition-transform duration-200 hover:scale-105"
                                            />
                                        ) : (
                                            <span className="text-sm font-semibold text-muted-foreground">
                                                No image
                                            </span>
                                        )}
                                    </div>

                                    <div className="min-w-0 space-y-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <h3 className="break-words text-xl font-extrabold">
                                                    {product.name}
                                                </h3>

                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    <Badge variant="secondary" className="font-bold">
                                                        {product.category}
                                                    </Badge>
                                                    <Badge className="font-bold">{product.status}</Badge>
                                                    {product.featured && (
                                                        <Badge variant="outline" className="font-bold">
                                                            Featured
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="mt-2 grid gap-1 text-sm font-semibold text-muted-foreground sm:grid-cols-2">
                                                    {product.dimensions && (
                                                        <p>Dimensions: {product.dimensions}</p>
                                                    )}
                                                    {product.sku && <p>SKU: {product.sku}</p>}
                                                </div>
                                            </div>

                                            <p className="text-xl font-extrabold">
                                                ${Number(product.price).toFixed(2)}
                                            </p>
                                        </div>

                                        {product.description && (
                                            <p className="line-clamp-2 text-sm font-semibold text-muted-foreground">
                                                {product.description}
                                            </p>
                                        )}

                                        <details className="rounded-xl border bg-background p-4 transition-all duration-200 open:shadow-sm">
                                            <summary className="cursor-pointer text-sm font-extrabold">
                                                Edit Product
                                            </summary>

                                            <form action={updateProduct} className="mt-5 space-y-5">
                                                <input type="hidden" name="id" value={product.id} />

                                                <ProductFormFields
                                                    product={product}
                                                    imageLabel="Replace Images"
                                                />

                                                <Button type="submit" className="soft-button w-full font-bold sm:w-auto">
                                                    Save Changes
                                                </Button>
                                            </form>
                                        </details>

                                        <form action={deleteProduct}>
                                            <input type="hidden" name="id" value={product.id} />
                                            <Button
                                                type="submit"
                                                variant="destructive"
                                                className="soft-button w-full font-bold sm:w-auto"
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