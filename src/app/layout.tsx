import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mustafa-electronics.pk"),
  title: {
    default: "Mustafa Electronics | Electronics & Accessories in Pakistan",
    template: "%s | Mustafa Electronics",
  },
  description: "Shop electronics, mobile accessories, chargers, audio, computer accessories, smart gadgets and more in Pakistan.",
  keywords: ["electronics Pakistan", "mobile accessories Pakistan", "chargers", "Bluetooth headphones", "power banks", "computer accessories", "Mustafa Electronics"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Mustafa Electronics",
    title: "Mustafa Electronics | Electronics & Accessories in Pakistan",
    description: "Reliable electronics, thoughtful accessories, and better everyday tech.",
    url: "/",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
