import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnvilKit Puck Overrides — Shadcn UI Editor",
  description:
    "Enterprise-grade Puck Editor UI override system built on Shadcn UI and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
