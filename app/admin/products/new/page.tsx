import { createProduct } from "../actions";
import ProductFormFields from "../ProductFormFields";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Add Product",
};

export default function AddProductPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 slide-up">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">
          Add Product
        </h2>
        <p className="mt-1 text-base font-semibold text-muted-foreground">
          Upload PNG/JPG images and add product metadata.
        </p>
      </div>

      <Card className="soft-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-extrabold">New Product</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={createProduct} className="space-y-5">
            <ProductFormFields imageLabel="Product Images" />

            <Button
              type="submit"
              className="soft-button w-full font-bold sm:w-auto"
            >
              Create Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}