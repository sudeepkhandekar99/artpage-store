import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type ProductFormProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  dimensions: string | null;
  category: string;
  sku: string | null;
  alt_text: string | null;
  status: string;
  featured: boolean;
};

const selectClass =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-ring";

export default function ProductFormFields({
  product,
  imageLabel = "Upload Images",
}: {
  product?: ProductFormProduct;
  imageLabel?: string;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="font-bold">Name</Label>
          <Input
            name="name"
            defaultValue={product?.name || ""}
            required
            className="font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="font-bold">Price</Label>
          <Input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product?.price ?? ""}
            required
            className="font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="font-bold">Dimensions</Label>
          <Input
            name="dimensions"
            placeholder='Example: 12" diameter'
            defaultValue={product?.dimensions || ""}
            className="font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="font-bold">SKU</Label>
          <Input
            name="sku"
            placeholder="Optional"
            defaultValue={product?.sku || ""}
            className="font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="font-bold">Category</Label>
          <select
            name="category"
            defaultValue={product?.category || "canvas"}
            className={selectClass}
          >
            <option value="canvas">Canvas</option>
            <option value="vinyl">Vinyl</option>
            <option value="bookmark">Bookmark</option>
            <option value="print">Print</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="font-bold">Status</Label>
          <select
            name="status"
            defaultValue={product?.status || "draft"}
            className={selectClass}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="font-bold">Description</Label>
        <Textarea
          name="description"
          defaultValue={product?.description || ""}
          rows={3}
          className="font-semibold"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="font-bold">Alt Text</Label>
        <Input
          name="alt_text"
          defaultValue={product?.alt_text || ""}
          placeholder="Optional image alt text"
          className="font-semibold"
        />
      </div>

      <div className="rounded-xl border bg-muted/25 p-4">
        <p className="mb-3 text-sm font-bold">{imageLabel}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="font-bold">PNG Image</Label>
            <Input name="png_image" type="file" accept="image/png" />
            <p className="text-xs font-medium text-muted-foreground">
              Transparent PNG. Original file is stored.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold">JPG Image</Label>
            <Input name="jpg_image" type="file" accept="image/jpeg" />
            <p className="text-xs font-medium text-muted-foreground">
              White-background JPG. Original file is stored.
            </p>
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-bold">
        <input
          name="featured"
          type="checkbox"
          defaultChecked={product?.featured || false}
          className="h-4 w-4"
        />
        Featured product
      </label>
    </div>
  );
}