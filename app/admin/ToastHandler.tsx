"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const messages: Record<string, string> = {
  created: "Product added successfully.",
  updated: "Product updated successfully.",
  deleted: "Product deleted successfully.",
};

export default function ToastHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get("toast");

    if (!status) return;

    const message = messages[status];

    if (message) {
      toast.success(message);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");

    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [searchParams, pathname, router]);

  return null;
}