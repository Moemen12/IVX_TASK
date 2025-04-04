import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TimeframeOption } from "..";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeframeInterval = (timeframe?: TimeframeOption): number => {
  const intervalMap: { [key: string]: number } = {
    "1m": 60 * 1000, // 1 minute
    "5m": 5 * 60 * 1000, // 5 minutes
    "15m": 15 * 60 * 1000, // 15 minutes
    "1h": 60 * 60 * 1000, // 1 hour
    "4h": 4 * 60 * 60 * 1000, // 4 hours
    "1d": 24 * 60 * 60 * 1000, // 1 day
  };

  return timeframe ? intervalMap[timeframe] : 100;
};
