import React, { useEffect, useState, createRef, useMemo } from "react";
import { Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SaveTwoTone, FullscreenOutlined, RollbackOutlined } from "@ant-design/icons";
import Plotly from "plotly.js-dist";
import { useScreenshot, createFileName } from "use-react-screenshot";
import authApi from "../services/authApi";
import { useSelector } from "react-redux";

/**
 * @name IplotTreeMap
 * @description: This component is used to render a treemap.
 * @purpose: To render a treemap.
 * @returns {Object} JSX object.
 */

const IplotTreeMap = () => {
  const { i18n } = useTranslation();
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const ref = createRef(null);
  const [image, takeScreenShot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0,
  });

  const download = (image, { name = "Bianat", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.title = "Bianat.sa";
    a.download = createFileName(extension, name);

    a.click();
  };

  const downloadScreenshot = () => takeScreenShot(ref.current).then(download);
  let colorArray = [];
  const assignColor = (data) => {
    data.text.forEach((item, index) => {
      if (typeof item === "string") {
        if (item === "sector") {
          colorArray.push("#262931");
        } else {
          colorArray.push("#38694F");
        }
      } else {
        if (item >= 0) {
          if (item >= 3) {
            colorArray.push("#30CC5A");
          } else if (item >= 2 && item < 3) {
            colorArray.push("#2F9E4F");
          } else if (item >= 1) {
            colorArray.push("#35764E");
          } else if (item > 0 && item < 1) {
            colorArray.push("#55C38C");
          } else if (item === 0) {
            colorArray.push("#414554");
          }
        } else if (item < 0) {
          if (item <= -3) {
            colorArray.push("#F63538");
          } else if (item <= -2) {
            colorArray.push("#BF4045");
          } else if (item <= -1) {
            colorArray.push("#8B444E");
          } else if (item < 0 && item > -1) {
            colorArray.push("#F8898C");
          }
        }
      }
    });
  };

  const fetchDataFromAPI = useMemo(async () => {
    const { data } = await authApi.get(
      `indicators/iplot-tree-map/${i18n.language}`
    );
    return data;
  }, [i18n.language]);

  const handleRedirect = () => {
    if (path === "/treemap") {
      navigate("/dashboard");
    } else {
      navigate("/treemap");
    }
  };
  


  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataFromAPI;
      assignColor(data);
      const layout = {
        treemapcolorway: colorArray,
        // width: "100%",
        // height: "100%",
        paper_bgcolor: currentTheme === "Dark" ? "#12161f" : "#fff",
        height: 750,
        font:"arial",
        uniformtext: {
          minsize:10,
        },
        margin: {
          autoexpand: true,
          b: 0,
          l: 0,
          r: 0,
          t: 0,
        },
      };

      const obj = {
        type: "treemap",
        textinfo: "text+label",
        texttemplate: "<b>%{label}</b><br><span>%{text}%</span>",
        hoverinfo: "label+text+value",
        outsidetextfont: { size: 15 },
        insidetextfont: { size: 20 },
        hovermode:false,
        textfont: {
          size: 13,
          thickness: "bold",
        },
        marker: {
          autocolorscale: true,
          colors: colorArray,
          colorscale: true,
          line: { width: 1 },

          colorscale: ["0.0", "rgb(165,0,38)"],
        },
        tiling: { squarifyratio: 2, packing: "squarify" },
        maxdepth: 10,
        pathbar: { visible: false },
        hoverinfo:"none",
        textposition: "middle center",
        ...data,
      };

      Plotly.newPlot("myDiv", [obj], layout);
    };

    fetchData();
  }, [i18n.language, currentTheme]);

  return (
    <div>
      <div className="treemap_btn">
        <Button
          className="fullScreenBtn"
          onClick={() => {
            handleRedirect();
          }}
          icon={path === "/treemap"?<RollbackOutlined/>:<FullscreenOutlined />}
        ></Button>

        <Button
          className="save-btn"
          onClick={downloadScreenshot}
          icon={<SaveTwoTone />}
        />
      </div>
      <div ref={ref}>
        <span
          className={`${
            currentTheme === "Dark" ? "screenshot-txt" : "screenshot-txt-dark"
          } `}
        >
          BIANAT.sa
        </span>
        <div
          id="myDiv"
          className={`treemap-wrap ${
            i18n.language === "ar" && "treemap-wrap-ar"
          } ${i18n.language === "en" ? "font-loader-en" : "font-loader"}`}
        ></div>
      </div>
    </div>
  );
};

export default IplotTreeMap;
