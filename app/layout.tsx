import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iv — Download Anything",
  description: "Paste a URL. Pick a format. Done.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
