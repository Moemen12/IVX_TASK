import Link from "next/link";
import { JSX } from "react";

export default function CurrencyNotFound(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1a1d29] text-white p-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-yellow-500 mb-4">
          Currency Not Found
        </h1>
        <p className="text-lg mb-6">
          The cryptocurrency you&apos;re looking for is not supported or
          doesn&apos;t exist.
        </p>
        <div className="bg-[#252836] p-4 rounded-md mb-6 text-left">
          <p className="text-red-400 font-mono text-sm">
            Error: Invalid cryptocurrency symbol
          </p>
          <p className="text-gray-400 font-mono text-sm mt-2">
            Please use one of our supported cryptocurrencies.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Link
            href="/trading/BTC"
            className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition-colors"
          >
            Go to Bitcoin (BTC)
          </Link>
        </div>
      </div>
    </div>
  );
}
