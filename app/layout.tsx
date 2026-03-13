import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Puck Overrides Demo",
  description: "Demo for @anvilkit/puck-overrides",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
