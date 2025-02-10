import React, { useContext, useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import esb from "elastic-builder";
import { Card, Typography } from "antd";
import IndexDropdown from "../../marketSnapShot/components/IndexDropdown";
import { useTranslation } from "react-i18next";
import { KuzzleContext } from "../../../App";

const { Title } = Typography;

const MultiLineChart = ({ smaNumber }) => {
  const { t, i18n } = useTranslation();
  const [chartType, setChartType] = useState("TASI");
  const upKey = `sma${smaNumber}Up`;
  const downKey = `sma${smaNumber}Down`;

  const [data, setData] = useState([]);
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const fetchData = async (chartType) => {
    const result = await kuzzle.document.search(
      "bianat",
      "sma-history",
      esb
        .requestBodySearch()
        .query(esb.matchQuery("indx", chartType))
        .source([upKey, downKey, "timestamp"])
        .sort(esb.sort("timestamp", "asc")),
      { size: 1000 }
    );

    const chartData = result.hits.reduce((acc, curr) => {
      const source = curr._source;
      const date = new Date(source.timestamp);
      acc.push(
        {
          date: date.toLocaleDateString(),
          type: `${t("Above")} ${smaNumber} ${t("sma")}`,
          value: source[upKey]?.length,
        },
        {
          date: date.toLocaleDateString(),
          type: `${t("Below")} ${smaNumber} ${t("sma")}`,
          value: source[downKey]?.length,
        }
      );
      return acc;
    }, []);

    setData(() => chartData);
  };

  useEffect(() => {
    fetchData(chartType);
  }, [chartType]);

  const config = {
    data,
    height: 220,
    xField: "date",
    yField: "value",
    yAxis: {
      label: {
        formatter: (v) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    seriesField: "type",
    color: ({ type }) => {
      return type && (type.includes("Above") || type.includes("فوق"))
        ? "#26de81"
        : "#ef5350";
    },
    legend: {
      layout: "horizontal",
      position: "top",
      offsetX: 0,
      marker: {
        spacing: i18n.language === "ar" ? 90 : 10,
      },
      itemName: {
        spacing: i18n.language === "ar" ? 40 : 10,
      },
    },
    lineStyle: () => {
      return {
        // lineDash: [4, 4],
        opacity: 1,
      };
    },
    point: {
      size: 0,
      shape: "custom-point",
      style: {
        opacity: 0,
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },
  };

  return (
    <Card className="min-card" style={{ marginTop: "8px" }}>
      <Title level={4}>{`${t("ABOVE | BELOW SMA")}${smaNumber}`}</Title>
      <IndexDropdown setValue={setChartType} />
      <Line {...config} />
    </Card>
  );
};

export default MultiLineChart;
