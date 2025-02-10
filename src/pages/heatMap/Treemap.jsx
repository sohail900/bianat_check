import React from "react";
import { Layout, Tooltip, Button } from "antd";
import BianatHeader from "../../components/BianatHeader";
import IplotTreeMap from "../../components/IplotTreeMap";
import { useSelector } from "react-redux";

const TreeMap = () => {
  const { Content } = Layout;
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const text = (
    <p>
      <span>1 Day Performance</span>
      <span>
        Color indicates today's stock performance in percent. Based on the color
        you can identify losers (red), and gainers (green).
      </span>
    </p>
  );
  return (
    <Layout>
      <BianatHeader />
      <Content
        className={`landing-content ${currentTheme === "Dark" && "dark-skin"}`}
      >
        <div className="main-section" style={{ minHeight: 650 }}>
          <IplotTreeMap />
        </div>
        <div style={{ paddingLeft: 16 }}>
          <Tooltip placement="topLeft" title={text}>
            <Button
              className="percentBtn"
              style={{
                backgroundColor: "#F63538",
                borderColor: currentTheme === "Dark" && "#12161f",
              }}
            >
              -3%
            </Button>
          </Tooltip>
          <Tooltip placement="top" title={text}>
            <Button
              className="percentBtn"
              style={{
                backgroundColor: "#BF4045",
                borderColor: currentTheme === "Dark" && "#12161f",
              }}
            >
              -2%
            </Button>
          </Tooltip>
          <Tooltip placement="topRight" title={text}>
            <Button
              className="percentBtn"
              style={{
                backgroundColor: "#8B444E",
                borderColor: currentTheme === "Dark" && "#12161f",
              }}
            >
              -1%
            </Button>
          </Tooltip>
          <Tooltip placement="topLeft" title={text}>
            <Button
              className="percentBtn"
              style={{
                backgroundColor: "#414554",
                borderColor: currentTheme === "Dark" && "#12161f",
              }}
            >
              0%
            </Button>
          </Tooltip>
          <Tooltip placement="top" title={text}>
            <Button
              className="percentBtn"
              style={{
                backgroundColor: "#35764E",
                borderColor: currentTheme === "Dark" && "#12161f",
              }}
            >
              1%
            </Button>
          </Tooltip>
          <Tooltip placement="topRight" title={text}>
            <Button
              className="percentBtn"
              style={{
                backgroundColor: "#2F9E4F",
                borderColor: currentTheme === "Dark" && "#12161f",
              }}
            >
              2%
            </Button>
          </Tooltip>
          <Tooltip placement="topRight" title={text}>
            <Button
              className="percentBtn"
              style={{
                backgroundColor: "#30CC5A",
                borderColor: currentTheme === "Dark" && "#12161f",
              }}
            >
              3%
            </Button>
          </Tooltip>
        </div>
      </Content>
    </Layout>
  );
};

export default TreeMap;
