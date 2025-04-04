"use client";

import Link from "next/link";
import type React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import VisuallyHidden for accessibility
import { DialogTitle } from "@radix-ui/react-dialog";
const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-black py-4 px-4 flex items-center justify-between">
      <Link className="text-white font-bold text-2xl sm:text-3xl" href="/">
        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          IVX
        </span>
        Labs
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden bg-[#e2df1ea8] text-black hover:bg-yellow-300 transition-colors border-0"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="bg-[#1a1d29] text-white p-6 rounded-l-lg shadow-lg"
        >
          <VisuallyHidden>
            <DialogTitle>Mobile Navigation Menu</DialogTitle>
          </VisuallyHidden>

          <div className="flex flex-col gap-6 mt-8">
            <Link
              className="text-lg font-semibold hover:text-gray-300 transition-colors"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="bg-[#FFFB1D] px-4 py-2 rounded-md text-black font-extrabold text-center hover:bg-yellow-300 transition-colors"
              href="/join"
            >
              JOIN NOW
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <div className="font-extrabold uppercase hidden md:flex items-center gap-4">
        <Link
          className="text-white hover:text-gray-300 transition-colors"
          href="/login"
        >
          login
        </Link>
        <Link
          className="bg-[#FFFB1D] px-4 py-2 rounded-md text-black font-extrabold hover:bg-yellow-300 transition-colors"
          href="/join"
        >
          join now
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
