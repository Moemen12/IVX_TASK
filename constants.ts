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
      labelBackgroundColor: "#262C36",
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
    // tickMarkFormatter: (time, tickMarkType, locale) => {
    //   const date = new Date(time * 1000); // Convert from seconds to milliseconds
    //   const hours = String(date.getHours()).padStart(2, "0");
    //   const minutes = String(date.getMinutes()).padStart(2, "0");
    //   const seconds = String(date.getSeconds()).padStart(2, "0");

    //   return `${hours}:${minutes}:${seconds}`;
    // },
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
    pressedMouseMove: true,
  },
};

export const areaSeriesOptions: DeepPartial<
  AreaStyleOptions | SeriesOptionsCommon
> = {
  lineColor: "#f7cb07",
  topColor: "rgba(247, 203, 7, 0.08)",
  bottomColor: "rgba(247, 203, 7, 0.02)",
  lineWidth: 2,
  lastValueVisible: false,
  priceLineVisible: false,
  crosshairMarkerVisible: false,
};

export const lineSeriesOptions: DeepPartial<
  LineSeriesOptions | SeriesOptionsCommon
> = {
  color: "#f7cb07",
  lineWidth: 2,
  crosshairMarkerVisible: false,
  lastValueVisible: true,
  priceLineVisible: true,
  priceLineWidth: 1,
  priceLineColor: "#f7cb07",
  priceLineStyle: LineStyle.Dashed,
};
