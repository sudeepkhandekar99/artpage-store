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

      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="soft-button rounded-md border bg-background px-3 py-2 text-base font-extrabold"
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="font-display text-xl font-bold tracking-tight">
            Store Admin
          </div>

          <form action={logoutAction}>
            <Button
              size="sm"
              variant="outline"
              type="submit"
              className="soft-button font-bold"
            >
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

          <aside className="sidebar-shell relative h-full w-[280px] border-r p-5 shadow-2xl slide-up">
            <div className="mb-7 flex items-start justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight">
                  Store Admin
                </h1>
                <p className="mt-1 text-sm font-bold text-muted-foreground">
                  @{username}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="soft-button rounded-md border bg-background/80 px-3 py-1 text-sm font-extrabold"
                aria-label="Close menu"
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
                        : "text-foreground hover:bg-white/70"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <form action={logoutAction} className="mt-8">
              <Button
                type="submit"
                variant="outline"
                className="soft-button w-full font-bold"
              >
                Logout
              </Button>
            </form>
          </aside>
        </div>
      )}

      <div className="md:grid md:grid-cols-[240px_1fr]">
        <aside className="sidebar-shell sticky top-0 hidden h-screen border-r p-5 md:block">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Store Admin
            </h1>
            <p className="mt-1 text-sm font-bold text-muted-foreground">
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
                      : "text-foreground hover:bg-white/70"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <form action={logoutAction} className="absolute bottom-5 left-5 right-5">
            <Button
              type="submit"
              variant="outline"
              className="soft-button w-full font-bold"
            >
              Logout
            </Button>
          </form>
        </aside>

        <main className="min-w-0 px-4 py-5 sm:px-5 lg:px-7">
          {children}
        </main>
      </div>
    </div>
  );
}