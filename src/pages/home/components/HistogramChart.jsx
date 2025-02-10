import React, { useState, useEffect, useContext } from "react";
import { Column } from "@ant-design/plots";
import esb from "elastic-builder";
import { Card, Dropdown, Button, Menu } from "antd";
import Title from "antd/lib/typography/Title";
import { useTranslation } from "react-i18next";

import { KuzzleContext } from "../../../App";
import IndexDropdown from "../../marketSnapShot/components/IndexDropdown";

const HistogramChart = () => {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("TASI");
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const fetchData = async () => {
      const { hits } = await kuzzle.document.search(
        "bianat",
        "high-low-history",

        esb
          .requestBodySearch()
          .query(esb.matchQuery("indx", chartType))
          .sort(esb.sort("timestamp", "asc")),
        { size: 1000 }
      );

      const chartData = hits.reduce((acc, curr) => {
        const source = curr._source;
        const date = new Date(source.timestamp);
        acc.push(
          {
            date: date.toLocaleDateString(),
            type: t("high"),
            value: source.high.length,
          },
          {
            date: date.toLocaleDateString(),
            type: t("low"),
            value: source.low.length,
          }
        );
        return acc;
      }, []);

      setData(chartData);
    };

    fetchData();
  }, [chartType]);

  const config = {
    data,
    height: 180,
    isStack: true,
    xField: "date",
    yField: "value",
    seriesField: "type",
    maxColumnWidth: 25,
    colorField: "type",
    color: ({ type }) => {
      if (type === "high" || type === "أعلى") {
        return "#26de81";
      }
      return "#ef5350";
    },
    legend: {
      layout: "horizontal",
      position: "top",
      offsetX: 0,
      marker: {
        spacing: i18n.language === "ar" ? 30 : 10,
      },
      itemName: {
        spacing: i18n.language === "ar" ? 30 : 10,
      },
    },
    label: {
      position: "middle",
      style: {
        opacity: 0,
      },
      layout: [
        {
          type: "interval-adjust-position",
        },
        {
          type: "interval-hide-overlap",
        },
        {
          type: "adjust-color",
        },
      ],
    },
  };

  return (
    <Card className="min-card histogram-chart">
      <Title level={4}>{t("NEW HIGH NEW LOW")}</Title>
      <IndexDropdown setValue={setChartType} />
      <Column {...config} />
    </Card>
  );
};

export default HistogramChart;
//
