import { PriceScaleMode } from "lightweight-charts";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { store } from "../app/Store";
import i18next from "./i18next";

export const fixValue = (value) => {
  if (value !== undefined) return parseFloat(value).toFixed(2);
  return value;
};
export const caretComponent = (value) => {
  return;
  //none reuseable
  if (value > 0) return <UpOutlined style={{ fontSize: "10px" }} />;
  else return <DownOutlined style={{ fontSize: "10px" }} />;
};

export const successOrDanger = (value) => {
  if (value !== undefined && value > 0) return "text-success";
  else return "text-dangers";
};

export const candleChartConfig = {
  height: 260,
};

const state = store.getState();
const { currentTheme } = state.currentTheme;

export const layout = {
  layout: {
    backgroundColor: currentTheme === "Dark" ? "#000000" : "#ffffff",
    textColor: currentTheme === "Dark" ? "#ffffff" : "#000000",
  },
};

export const lineChartConfig = {
  height: 260,
  ...layout,
  rightPriceScale: {
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
    mode: PriceScaleMode.Logarithmic,
  },
};

export const volumeChartConfig = {
  height: 260,
  ...layout,
  rightPriceScale: {
    scaleMargins: {
      top: 0.3,
      bottom: 0.25,
    },
    borderVisible: false,
  },
  layout: {
    backgroundColor: "#131722",
    textColor: "#d1d4dc",
  },
  grid: {
    vertLines: {
      color: "rgba(42, 46, 57, 0)",
    },
    horzLines: {
      color: "rgba(42, 46, 57, 0.6)",
    },
  },
};

export const quarterDiff = (a, b) => {
  const diff = ((b - a) / Math.abs(a)) * 100;

  return diff.toFixed(2);
};

export const numFormatter = (num) => {
  let sign = "";
  if (num < 0) {
    sign = "-";
  }

  num = Math.abs(num);
  if (num > 999 && num < 1000000) {
    return `${sign}${parseFloat(
      (num / 1000).toFixed(1)
    ).toLocaleString()} ${i18next.t("general.thousand")}`; // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return `${sign}${parseFloat(
      (num / 1000000).toFixed(1)
    ).toLocaleString()} ${i18next.t("general.million")}`; // convert to M for number from > 1 million
  } else if (num > 1000000000) {
    return `${sign}${parseFloat(
      (num / 1000000000).toFixed(1)
    ).toLocaleString()} ${i18next.t("general.billion")}`; // convert to M for number from > 1 million
  } else if (num < 900) {
    return `${sign}${fixValue(parseFloat(num))}`; // if value < 1000, nothing to do
  }
};
