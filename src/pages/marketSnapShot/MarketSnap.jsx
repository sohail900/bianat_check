import React, { useEffect } from "react";
import { Layout, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import BianatHeader from "../../components/BianatHeader";
import HighLights from "../home/components/Highlights";
import HistogramChart from "../home/components/HistogramChart";
import MultiLineChart from "../home/components/MultiLineChart";
import SubscriptionGaurd from "../../hoc/SubscriptionGaurd";
import BianatFooter from "../../components/BianatFooter";

const MarketSnap = () => {
  const { Content } = Layout;
  const { i18n } = useTranslation();
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);

  useEffect(() => {
    if (window.Tawk_API) {
      window.Tawk_API.hideWidget();
    }
    return () => {
      if (window.Tawk_API) {
        window.Tawk_API.showWidget();
      }
    };
  }, []);
  return (
    <Layout>
      <BianatHeader />
      <Content
        //  style={{overflowY:"scroll", paddingBottom:"50px"}}
        className={`landing-content ${
          i18n.language === "en" ? "font-loader-en" : "font-loader"
        } ${currentTheme === "Dark" && "dark-skin"}`}
      >
        <div className="live-update-toolbar">
          <HighLights />
        </div>
        <div className="padding">
          <div className="container">
            <Row gutter={16}>
              <Col span={24}>
                <SubscriptionGaurd id="histogramChart" page="marketSnap">
                  <HistogramChart />
                </SubscriptionGaurd>
              </Col>
              <Col span={24}>
                <SubscriptionGaurd id="multilineSma50" page="marketSnap">
                  <MultiLineChart smaNumber={50} />
                </SubscriptionGaurd>
              </Col>
              <Col span={24}>
                <SubscriptionGaurd id="multilineSma200" page="marketSnap">
                  <MultiLineChart smaNumber={200} />
                </SubscriptionGaurd>
              </Col>
            </Row>
          </div>
        </div>
      </Content>
      <BianatFooter />
    </Layout>
  );
};

export default MarketSnap;
