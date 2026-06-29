"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ToastHandler from "./ToastHandler";

type AdminShellProps = {
  username: string;
  children: React.ReactNode;
  logoutAction: () => Promise<void>;
};

const navItems = [
  {
    label: "Add Product",
    href: "/admin/products/new",
  },
  {
    label: "All Products",
    href: "/admin/products",
  },
];

export default function AdminShell({
  username,
  children,
  logoutAction,
}: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <ToastHandler />

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="soft-button rounded-md border bg-background px-3 py-2 text-base font-bold"
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="text-base font-bold">Store Admin</div>

          <form action={logoutAction}>
            <Button size="sm" variant="outline" type="submit" className="soft-button">
              Logout
            </Button>
          </form>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 fade-in md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="relative h-full w-[280px] border-r bg-background p-5 shadow-2xl slide-up">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold tracking-tight">Store Admin</h1>
                <p className="text-sm font-semibold text-muted-foreground">
                  @{username}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="soft-button rounded-md border px-3 py-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`sidebar-link block ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <form action={logoutAction} className="mt-8">
              <Button type="submit" variant="outline" className="soft-button w-full">
                Logout
              </Button>
            </form>
          </aside>
        </div>
      )}

      <div className="md:grid md:grid-cols-[240px_1fr]">
        <aside className="sticky top-0 hidden h-screen border-r bg-background p-5 md:block">
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight">Store Admin</h1>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              Logged in as {username}
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link block ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <form action={logoutAction} className="absolute bottom-5 left-5 right-5">
            <Button type="submit" variant="outline" className="soft-button w-full">
              Logout
            </Button>
          </form>
        </aside>

        <main className="min-w-0 px-4 py-5 sm:px-5 lg:px-7">{children}</main>
      </div>
    </div>
  );
}