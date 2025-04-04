import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const GeogrotesqueWide = localFont({
  src: "../public/fonts/GeogrotesqueWide-Rg.woff2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IVX Labs",
  description: "Trading With IVX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeogrotesqueWide.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
