"use client";

import React, { JSX } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, TrendingUp } from "lucide-react";
import Link from "next/link";

const NotFound = (): JSX.Element => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500">
            404
          </h1>
          <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-full blur-xl opacity-70 animate-pulse"></div>
        </div>

        <h2 className="text-3xl font-bold mb-4">Lost in the Crypto Void</h2>

        <p className="text-gray-400 mb-8">
          The page you&apos;re looking for has either mooned or crashed.
          Don&apos;t worry - even the most volatile assets find their way back.
        </p>

        <div className="relative w-64 h-64 mx-auto mb-8">
          <Image
            src="/assets/not-found.svg"
            alt="Crypto astronaut lost in space"
            width={400}
            height={400}
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.back()}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Link href="/" passHref>
            <Button className="bg-[#252836] hover:bg-[#2a2d3a] font-semibold">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>

          <Link href="/trading/BTC" passHref>
            <Button className="bg-green-500/90 hover:bg-green-600/90 font-semibold">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trade BTC
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-[#252836] rounded-lg text-left">
          <div className="flex items-center mb-2">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-400">
              Crypto markets are open (BTC: $XX,XXX | 24h: X.XX%)
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
