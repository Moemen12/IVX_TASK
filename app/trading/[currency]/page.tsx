"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  createChart,
  LineSeries,
  AreaSeries,
  type IChartApi,
  type ISeriesApi,
  type Time,
  type LineData,
} from "lightweight-charts";
import { Search } from "lucide-react";
import { notFound, usePathname, useRouter } from "next/navigation";
import {
  areaSeriesOptions,
  cryptoCurrencies,
  lineSeriesOptions,
  options,
} from "@/constants";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AggTradeEvent,
  ConnectionStatus,
  PriceDirection,
  TimeframeOption,
} from "@/index";

export default function TradingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  // Chart state
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [lineSeries, setLineSeries] = useState<ISeriesApi<"Line"> | null>(null);
  const [areaSeries, setAreaSeries] = useState<ISeriesApi<"Area"> | null>(null);

  // Price state
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceDirection, setPriceDirection] = useState<PriceDirection>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const priceUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chartUpdateTimeRef = useRef<number>(0);
  const latestPriceRef = useRef<number | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract the base currency from the URL path
  const baseCurrency = pathname.split("/").pop() || "BTC";
  const validCurrency = cryptoCurrencies.some(
    (c) => c.symbol.toLowerCase() === baseCurrency.toLowerCase()
  );
  if (!validCurrency) {
    notFound();
  }

  // Trading pair and timeframe state
  const [symbol, setSymbol] = useState(`${baseCurrency}USDT`);
  const [timeframe, setTimeframe] = useState<TimeframeOption | null>(null); // Default: No timeframe selected

  // Key for remounting chart when currency changes
  const [chartKey, setChartKey] = useState(baseCurrency);

  // Update symbol when baseCurrency changes
  useEffect(() => {
    setSymbol(`${baseCurrency}USDT`);
    setChartKey(baseCurrency); // Force re-initialization of chart
  }, [baseCurrency]);

  // Initialize chart - using chartKey to force re-initialization
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up any existing chart
    if (chart) {
      chart.remove();
      setChart(null);
      setLineSeries(null);
      setAreaSeries(null);
    }

    // Get container dimensions
    const container = chartContainerRef.current;

    // Create chart
    const newChart = createChart(container, options);
    setChart(newChart);

    // Add area series for the yellow background
    const newAreaSeries = newChart.addSeries(AreaSeries, areaSeriesOptions);
    setAreaSeries(newAreaSeries);

    // Add line series on top
    const newLineSeries = newChart.addSeries(LineSeries, lineSeriesOptions);
    setLineSeries(newLineSeries);

    // Enable zooming and time scale margin
    newChart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (newChart && chartContainerRef.current) {
        newChart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (newChart) {
        newChart.remove();
      }
      setChart(null);
      setLineSeries(null);
      setAreaSeries(null);

      // Close WebSocket if it exists
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [chartKey]); // Important: Chart re-initializes when chartKey changes

  // Function to update price and chart
  const updatePriceAndChart = useCallback(
    (newPrice: number) => {
      // Update price direction
      if (previousPrice !== null) {
        if (newPrice > previousPrice) {
          setPriceDirection("up");
        } else if (newPrice < previousPrice) {
          setPriceDirection("down");
        }
      }

      // Update state
      setPreviousPrice(currentPrice);
      setCurrentPrice(newPrice);

      // Update chart if series exist (but limit updates based on timeframe)
      const now = Date.now();

      // Calculate minimum time between updates based on timeframe
      let updateInterval = 300; // Default for no timeframe (300ms)
      if (timeframe === "1m") updateInterval = 60 * 1000; // 1 minute
      if (timeframe === "5m") updateInterval = 5 * 60 * 1000;
      if (timeframe === "15m") updateInterval = 15 * 60 * 1000;
      if (timeframe === "1h") updateInterval = 60 * 60 * 1000;
      if (timeframe === "4h") updateInterval = 4 * 60 * 60 * 1000;
      if (timeframe === "1d") updateInterval = 24 * 60 * 60 * 1000;

      // Only update chart if enough time has passed according to timeframe
      if (
        lineSeries &&
        areaSeries &&
        now - chartUpdateTimeRef.current > updateInterval
      ) {
        try {
          const time = (now / 1000) as Time;
          const candleData: LineData = {
            time,
            value: newPrice,
          };
          lineSeries.update(candleData);
          areaSeries.update(candleData);
          chartUpdateTimeRef.current = now;
        } catch (error) {
          console.error("Error updating chart:", error);
        }
      }
    },
    [currentPrice, previousPrice, lineSeries, areaSeries, timeframe]
  );

  // Set up interval for updating price every 300ms (default behavior)
  useEffect(() => {
    // Function to update UI with latest price
    const updateUI = () => {
      if (latestPriceRef.current !== null) {
        updatePriceAndChart(latestPriceRef.current);
      }
    };

    // Set up interval
    priceUpdateIntervalRef.current = setInterval(updateUI, 300); // Default: 300ms

    // Clean up interval on unmount
    return () => {
      if (priceUpdateIntervalRef.current) {
        clearInterval(priceUpdateIntervalRef.current);
        priceUpdateIntervalRef.current = null;
      }
    };
  }, [updatePriceAndChart]);

  // Fetch historical data and connect to WebSocket
  useEffect(() => {
    if (!lineSeries || !areaSeries) return;

    setIsLoading(true);
    setConnectionStatus("connecting");
    let isMounted = true;

    // Close any existing WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Fetch historical data
    const fetchHistoricalData = async () => {
      try {
        // Use Binance Futures API for historical data
        const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${
          timeframe || "1m"
        }&limit=500`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        const data = await response.json();
        if (!isMounted) return;
        if (!Array.isArray(data)) {
          console.error("API did not return an array:", data);
          setIsLoading(false);
          return;
        }

        const formattedData: LineData[] = data.map((d) => ({
          time: (d[0] / 1000) as Time,
          value: Number.parseFloat(d[4]),
        }));

        if (lineSeries && areaSeries) {
          lineSeries.setData(formattedData);
          areaSeries.setData(formattedData);
          if (formattedData.length > 0) {
            const latestPrice = formattedData[formattedData.length - 1].value;
            latestPriceRef.current = latestPrice;
            setCurrentPrice(latestPrice);
            setPreviousPrice(latestPrice);
          }
        }

        setIsLoading(false);
        if (isMounted) {
          // Connect to WebSocket for price updates
          connectWebSocket();
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
        if (isMounted) {
          setIsLoading(false);
          setConnectionStatus("disconnected");
          // Try again after a delay
          reconnectTimeoutRef.current = setTimeout(fetchHistoricalData, 5000);
        }
      }
    };

    // Connect to WebSocket using aggTrade stream (updates every 100ms)
    const connectWebSocket = () => {
      try {
        const lowerCaseSymbol = symbol.toLowerCase();
        // Use Binance Futures WebSocket with aggTrade stream
        const ws = new WebSocket(
          `wss://fstream.binance.com/ws/${lowerCaseSymbol}@aggTrade`
        );
        wsRef.current = ws;

        // Set up ping interval to keep connection alive
        let pingInterval: NodeJS.Timeout | null = null;
        ws.onopen = () => {
          console.log(
            `WebSocket connected for ${symbol} using aggTrade stream`
          );
          setConnectionStatus("connected");
          // Send ping every 3 minutes to keep connection alive
          pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ method: "ping" }));
            }
          }, 3 * 60 * 1000);
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const message = JSON.parse(event.data) as AggTradeEvent;
            // The 'p' field contains the price
            if (message.p) {
              const newPrice = Number.parseFloat(message.p);
              latestPriceRef.current = newPrice;
            }
          } catch (error) {
            console.error("Error processing WebSocket message:", error);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setConnectionStatus("disconnected");
        };

        ws.onclose = (event) => {
          console.log(`WebSocket closed with code: ${event.code}`);
          setConnectionStatus("disconnected");
          // Clear ping interval
          if (pingInterval) {
            clearInterval(pingInterval);
            pingInterval = null;
          }
          // Try to reconnect if component is still mounted
          if (isMounted && wsRef.current === ws) {
            reconnectTimeoutRef.current = setTimeout(connectWebSocket, 2000);
          }
        };
      } catch (error) {
        console.error("Error setting up WebSocket:", error);
        if (isMounted) {
          setConnectionStatus("disconnected");
          // Try again after a delay
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
        }
      }
    };

    fetchHistoricalData();

    return () => {
      isMounted = false;
      // Close WebSocket if it exists
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      // Clear any reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [symbol, timeframe, lineSeries, areaSeries]);

  // Handle mouse and touch events for chart dragging
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;

    const handleMouseDown = () => {
      setIsDragging(true);
      document.body.style.cursor = "grabbing";
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "default";
    };

    const handleTouchStart = () => {
      setIsDragging(true);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    container.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: TimeframeOption) => {
    setTimeframe(newTimeframe);
  };

  // Handle currency change
  const handleCurrencyChange = (newCurrency: string) => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    router.push(`/trading/${newCurrency}`);
  };

  // Find current currency
  const currentCurrency =
    cryptoCurrencies.find((currency) => currency.symbol === baseCurrency) ||
    cryptoCurrencies[0];

  return (
    <div className="flex flex-col w-full h-screen bg-[#1a1d29] text-white p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
        <div className="flex items-center gap-2">
          <Select onValueChange={handleCurrencyChange} value={baseCurrency}>
            <SelectTrigger className="bg-[#252836] text-white hover:bg-[#2a2d3a] transition-colors border-0">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <Image
                    width={20}
                    height={20}
                    src={currentCurrency.icon || "/placeholder.svg"}
                    alt={currentCurrency.name}
                    className="rounded-full"
                  />
                  <span>{currentCurrency.symbol}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#252836] text-white">
              <div className="p-2 border-b border-gray-700">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-2 top-2.5 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-[#1a1d29] text-white pl-8 pr-2 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="py-1 max-h-96 overflow-y-auto">
                {cryptoCurrencies
                  .filter(
                    (currency) =>
                      currency.symbol
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      currency.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((currency) => (
                    <SelectItem
                      key={currency.symbol}
                      value={currency.symbol}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2d3a] transition-colors"
                    >
                      <Image
                        width={20}
                        height={20}
                        src={currency.icon || "/placeholder.svg"}
                        alt={currency.name}
                        className="rounded-full"
                      />
                      <span>{currency.symbol}</span>
                    </SelectItem>
                  ))}
              </div>
            </SelectContent>
          </Select>

          {currentPrice && (
            <span
              className={`text-xl font-semibold ${
                priceDirection === "up"
                  ? "text-green-400"
                  : priceDirection === "down"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              $
              {currentPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          )}

          <div className="ml-2 flex items-center">
            <div
              className={`h-2 w-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-500"
                  : connectionStatus === "connecting"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            <span className="ml-1 text-xs text-gray-400">
              {connectionStatus === "connected"
                ? "Connected"
                : connectionStatus === "connecting"
                ? "Connecting..."
                : "Disconnected"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 md:gap-2">
          {(["1m", "5m", "15m", "1h", "4h", "1d"] as TimeframeOption[]).map(
            (tf) => (
              <button
                key={tf}
                onClick={() => handleTimeframeChange(tf)}
                className={`px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm rounded ${
                  timeframe === tf
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {tf}
              </button>
            )
          )}
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1d29] bg-opacity-70 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      )}

      <div
        ref={chartContainerRef}
        className={`w-full h-[500px] ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      />
    </div>
  );
}
