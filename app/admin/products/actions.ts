"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/requireSuperAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "product-images";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (!value) return 0;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);

  if (!(value instanceof File)) return null;
  if (value.size === 0) return null;

  return value;
}

function validateImage(file: File, type: "png" | "jpg") {
  if (type === "png" && file.type !== "image/png") {
    throw new Error("PNG image must be image/png.");
  }

  if (type === "jpg" && file.type !== "image/jpeg") {
    throw new Error("JPG image must be image/jpeg.");
  }
}

async function uploadOriginalImage({
  file,
  path,
  contentType,
}: {
  file: File;
  path: string;
  contentType: string;
}) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: true,
    cacheControl: "31536000",
  });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  return path;
}

export async function createProduct(formData: FormData) {
  await requireSuperAdmin();

  const id = crypto.randomUUID();

  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const price = getNumber(formData, "price");
  const dimensions = getString(formData, "dimensions");
  const category = getString(formData, "category").toLowerCase();
  const sku = getString(formData, "sku");
  const altText = getString(formData, "alt_text");
  const status = getString(formData, "status") || "draft";
  const featured = getBoolean(formData, "featured");

  const pngFile = getFile(formData, "png_image");
  const jpgFile = getFile(formData, "jpg_image");

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!category) {
    throw new Error("Category is required.");
  }

  if (!pngFile && !jpgFile) {
    throw new Error("Upload at least one image.");
  }

  let pngImagePath: string | null = null;
  let jpgImagePath: string | null = null;

  if (pngFile) {
    validateImage(pngFile, "png");

    pngImagePath = await uploadOriginalImage({
      file: pngFile,
      path: `${category}/${id}/product.png`,
      contentType: "image/png",
    });
  }

  if (jpgFile) {
    validateImage(jpgFile, "jpg");

    jpgImagePath = await uploadOriginalImage({
      file: jpgFile,
      path: `${category}/${id}/product.jpg`,
      contentType: "image/jpeg",
    });
  }

  const { error } = await supabaseAdmin.from("products").insert({
    id,
    name,
    description: description || null,
    price,
    dimensions: dimensions || null,
    category,
    sku: sku || null,
    is_made_to_order: true,
    png_image_path: pngImagePath,
    jpg_image_path: jpgImagePath,
    png_original_filename: pngFile?.name || null,
    jpg_original_filename: jpgFile?.name || null,
    png_size_bytes: pngFile?.size || null,
    jpg_size_bytes: jpgFile?.size || null,
    alt_text: altText || name,
    status,
    featured,
  });

  if (error) {
    throw new Error(`Product create failed: ${error.message}`);
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/products/new");

  redirect("/admin/products/new?toast=created");
}

export async function updateProduct(formData: FormData) {
  await requireSuperAdmin();

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Product id is required.");
  }

  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const price = getNumber(formData, "price");
  const dimensions = getString(formData, "dimensions");
  const category = getString(formData, "category").toLowerCase();
  const sku = getString(formData, "sku");
  const altText = getString(formData, "alt_text");
  const status = getString(formData, "status") || "draft";
  const featured = getBoolean(formData, "featured");

  const pngFile = getFile(formData, "png_image");
  const jpgFile = getFile(formData, "jpg_image");

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!category) {
    throw new Error("Category is required.");
  }

  const payload: Record<string, unknown> = {
    name,
    description: description || null,
    price,
    dimensions: dimensions || null,
    category,
    sku: sku || null,
    alt_text: altText || name,
    status,
    featured,
    is_made_to_order: true,
  };

  if (pngFile) {
    validateImage(pngFile, "png");

    payload.png_image_path = await uploadOriginalImage({
      file: pngFile,
      path: `${category}/${id}/product.png`,
      contentType: "image/png",
    });

    payload.png_original_filename = pngFile.name;
    payload.png_size_bytes = pngFile.size;
  }

  if (jpgFile) {
    validateImage(jpgFile, "jpg");

    payload.jpg_image_path = await uploadOriginalImage({
      file: jpgFile,
      path: `${category}/${id}/product.jpg`,
      contentType: "image/jpeg",
    });

    payload.jpg_original_filename = jpgFile.name;
    payload.jpg_size_bytes = jpgFile.size;
  }

  const { error } = await supabaseAdmin
    .from("products")
    .update(payload)
    .eq("id", id);

  if (error) {
    throw new Error(`Product update failed: ${error.message}`);
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/products/new");

  redirect("/admin/products?toast=updated");
}

export async function deleteProduct(formData: FormData) {
  await requireSuperAdmin();

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Product id is required.");
  }

  const { data: product, error: fetchError } = await supabaseAdmin
    .from("products")
    .select("png_image_path, jpg_image_path")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(`Product fetch failed: ${fetchError.message}`);
  }

  const paths = [
    product?.png_image_path,
    product?.jpg_image_path,
  ].filter(Boolean) as string[];

  if (paths.length > 0) {
    const { error: storageError } = await supabaseAdmin.storage
      .from(BUCKET)
      .remove(paths);

    if (storageError) {
      throw new Error(`Image delete failed: ${storageError.message}`);
    }
  }

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) {
    throw new Error(`Product delete failed: ${error.message}`);
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/products/new");

  redirect("/admin/products?toast=deleted");
}