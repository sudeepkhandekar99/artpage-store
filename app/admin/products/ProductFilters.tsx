"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProductFiltersProps = {
  q: string;
  category: string;
  status: string;
  featured: string;
};

const selectClass =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-ring";

export default function ProductFilters({
  q,
  category,
  status,
  featured,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(q);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.replace(
      params.toString() ? `${pathname}?${params.toString()}` : pathname,
      {
        scroll: false,
      }
    );
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter("q", search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="soft-card p-4 sm:p-5">
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <div className="space-y-1.5">
          <label className="text-sm font-bold">Search</label>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by product name"
            className="font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold">Category</label>
          <select
            value={category}
            onChange={(event) => updateFilter("category", event.target.value)}
            className={selectClass}
          >
            <option value="all">All</option>
            <option value="canvas">Canvas</option>
            <option value="vinyl">Vinyl</option>
            <option value="bookmark">Bookmark</option>
            <option value="print">Print</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold">Status</label>
          <select
            value={status}
            onChange={(event) => updateFilter("status", event.target.value)}
            className={selectClass}
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold">Featured</label>
          <select
            value={featured}
            onChange={(event) => updateFilter("featured", event.target.value)}
            className={selectClass}
          >
            <option value="all">All</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </select>
        </div>

        <div className="flex items-end">
          <Button asChild variant="outline" className="soft-button w-full">
            <Link href="/admin/products">Clear</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}