import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ranin Art Admin",
    template: "%s | Ranin Art Admin",
  },
  description: "Admin dashboard for managing Ranin Art products.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable}`}>
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}