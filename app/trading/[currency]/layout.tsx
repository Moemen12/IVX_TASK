import type { Metadata } from "next";
import "../../globals.css";
import Navbar from "@/components/shared/Navbar";

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
    <>
      <Navbar />
      {children}
    </>
  );
}
