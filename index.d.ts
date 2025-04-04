export interface CryptoCurrency {
  symbol: string;
  name: string;
  icon: string;
}

export interface BinanceHistoricalError {
  code: string;
  msg: string;
}

export interface LineData {
  time: Time;
  value: number;
}

// Define the type for price direction
export type PriceDirection = "up" | "down" | null;

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

// Define the aggTrade event interface for Binance Futures
export interface AggTradeEvent {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  a: number; // Aggregate trade ID
  p: string; // Price
  q: string; // Quantity
  f: number; // First trade ID
  l: number; // Last trade ID
  T: number; // Trade time
  m: boolean; // Is the buyer the market maker?
}
export type TimeframeOption = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
