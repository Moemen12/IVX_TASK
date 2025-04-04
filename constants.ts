import {
  AreaStyleOptions,
  ChartOptions,
  ColorType,
  DeepPartial,
  LineSeriesOptions,
  LineStyle,
  SeriesOptionsCommon,
} from "lightweight-charts";
import { CryptoCurrency } from ".";

export const cryptoCurrencies: CryptoCurrency[] = [
  { symbol: "BTC", name: "Bitcoin", icon: "/assets/icons/btc.svg" },
  { symbol: "ETH", name: "Ethereum", icon: "/assets/icons/eth.svg" },
  { symbol: "SOL", name: "Solana", icon: "/assets/icons/sol.svg" },
  { symbol: "1000SHIB", name: "Shiba Inu", icon: "/assets/icons/shib.svg" },
  { symbol: "XRP", name: "Ripple", icon: "/assets/icons/xrp.svg" },
  { symbol: "LTC", name: "Litecoin", icon: "/assets/icons/ltc.svg" },
  { symbol: "1000PEPE", name: "Pepe", icon: "/assets/icons/pepe.svg" },
  { symbol: "DOGE", name: "Dogecoin", icon: "/assets/icons/doge.svg" },
  { symbol: "TRX", name: "Tron", icon: "/assets/icons/trx.svg" },
];

export const options: DeepPartial<ChartOptions> = {
  layout: {
    background: { type: ColorType.Solid, color: "#1a1d29" },
    textColor: "#d1d4dc",
    fontSize: 12,
    fontFamily: "GeogrotesqueWide, sans-serif",
  },
  grid: {
    vertLines: { color: "rgba(42, 46, 57, 0.4)", style: LineStyle.Dotted },
    horzLines: { color: "rgba(42, 46, 57, 0.4)", style: LineStyle.Dotted },
  },
  crosshair: {
    mode: 0,
    vertLine: {
      width: 1,
      color: "rgba(224, 227, 235, 0.1)",
      style: LineStyle.Solid,
    },
    horzLine: {
      width: 1,
      color: "rgba(224, 227, 235, 0.1)",
      style: LineStyle.Solid,
    },
  },
  timeScale: {
    borderColor: "rgba(197, 203, 206, 0.3)",
    timeVisible: true,
    secondsVisible: false,
    rightOffset: 5,
    barSpacing: 10,
    fixLeftEdge: true,
    lockVisibleTimeRangeOnResize: true,
    rightBarStaysOnScroll: true,
    borderVisible: true,
    visible: true,
  },
  rightPriceScale: {
    borderColor: "rgba(197, 203, 206, 0.3)",
    borderVisible: true,

    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
    autoScale: true,
    entireTextOnly: true,
  },
  handleScale: {
    axisPressedMouseMove: {
      time: true,
      price: true,
    },
    mouseWheel: true,
    pinch: true,
  },
  handleScroll: {
    mouseWheel: true,
    vertTouchDrag: true,
    pressedMouseMove: true,
  },
};

export const areaSeriesOptions: DeepPartial<
  AreaStyleOptions | SeriesOptionsCommon
> = {
  lineColor: "#f7cb07",
  topColor: "rgba(247, 203, 7, 0.4)",
  bottomColor: "rgba(247, 203, 7, 0.04)",
  lineWidth: 2,
  lastValueVisible: false,
  priceLineVisible: false,
};

export const lineSeriesOptions: DeepPartial<
  LineSeriesOptions | SeriesOptionsCommon
> = {
  color: "#f7cb07",
  lineWidth: 2,
  crosshairMarkerVisible: true,
  crosshairMarkerRadius: 4,
  lastValueVisible: true,
  priceLineVisible: true,
  priceLineWidth: 1,
  priceLineColor: "#f7cb07",
  priceLineStyle: LineStyle.Dashed,
};

export const topLineSeriesOptions: DeepPartial<
  LineSeriesOptions | SeriesOptionsCommon
> = {
  color: "#00ff00", // Green color for the top line
  lineWidth: 2,
  crosshairMarkerVisible: false, // Disable markers for the top line
  lastValueVisible: false, // Hide the last value label
  priceLineVisible: false, // Hide the price line
};
