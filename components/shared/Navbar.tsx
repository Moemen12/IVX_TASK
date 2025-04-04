import Link from "next/link";
import React, { JSX } from "react";

const Navbar: React.FC = (): JSX.Element => {
  return (
    <nav className="border-b border-black py-4 px-4 flex items-center justify-between">
      <Link className="text-white font-bold text-3xl" href="/">
        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          IVX
        </span>
        Labs
      </Link>

      <div className="font-extrabold uppercase flex items-center gap-4">
        <Link className="text-white" href="/">
          login
        </Link>
        <Link
          className="bg-[#FFFB1D] px-4 py-2 rounded-md text-black font-extrabold"
          href="/"
        >
          join now
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
