import React, { useEffect, useState } from "react";
import { Treemap } from "@ant-design/charts";
import { getTreeData } from "../../../services/apis";

const TreeMapChart = () => {
  const [treeData, setTreeData] = useState([]);
  useEffect(() => {
    const abortController = new AbortController();
    const getTreeMapData = async () => {
      try {
        const result = await getTreeData();
        console.log("heat map", result);
        setTreeData(result);
      } catch (error) {
        console.log(error);
      }
    };
    getTreeMapData();
    return () => {
      abortController.abort();
    };
  }, []);
  const data = {
    name: "root",
    children: treeData,
  };
  const config = {
    data,
    colorField: "percentage",
    color: ({ percentage }) => {
      if (percentage < -3) {
        return "#DC3341";
      }
      if (percentage < -2) {
        return "#B22833";
      }
      if (percentage < -1) {
        return "#80262E";
      }
      if (percentage === 0) {
        return "#1E222D";
      } else if (percentage == 1) {
        return "#1A3326";
      } else if (percentage == 2) {
        return "#80262E";
      } else {
        return "#089950";
      }
    },
    legend: {
      position: "top-left",
    },
    interactions: [
      {
        type: "treemap-drill-down",
      },
      {
        type: "view-zoom",
      },
      {
        type: "drag-move",
      },
    ],
    tooltip: {
      follow: true,
      enterable: true,
      offset: 5,
      customContent: (value, items) => {
        if (!items || items.length <= 0) return;
        const { data: itemData } = items[0];
        const parent = itemData.path[1];
        const root = itemData.path[itemData.path.length - 1];
        return (
          `<div className='container'>` +
          `<div className='title'>${itemData.name}</div>` +
          `<div className='tooltip-item'><span>Value </span><span>${itemData.value}</span></div>` +
          `<div className='tooltip-item'><span>Brand </span><span>${itemData.brand}</span></div>` +
          `<div className='tooltip-item'><span>Brand proportion </span><span>${(
            (itemData.value / parent.value) *
            100
          ).toFixed(2)}%</span></div>` +
          `<div className='tooltip-item'><span>market share </span><span>${(
            (itemData.value / root.value) *
            100
          ).toFixed(2)}%</span></div>` +
          `</div>`
        );
      },
    },
  };
  return treeData && treeData.length > 0 && <Treemap {...config} />;
};

export default TreeMapChart;
