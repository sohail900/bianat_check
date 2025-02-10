import React, { useEffect, useContext, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Row, Col, Card, Image, Button, Tooltip, Divider } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { KuzzleContext } from "../../../App";
import MarketSnapShowModal from "./MarketSnapShot/MarketSnapShotModal";
import downMarket from "../../../assets/downMarket.png";
import sideWayArrow from "../../../assets/sideWayArrow.png";
import uptrend from "../../../assets/uptrend.png";
import green from "../../../assets/green.jpg";
import red from "../../../assets/red.jpg";
import orange from "../../../assets/orange.jpg";

const MarketSnapShot = () => {
  const { t, i18n } = useTranslation();
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const [data, setData] = useState("");
  const [marketSnapData, setMarketSnapData] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentOutlook, setCurrentOutlook] = useState("");
  const [trading, setTrading] = useState("");
  const [currentOutlookEn, setCurrentOutlookEn] = useState("");
  const [currentOutlookAr, setCurrentOutlookAr] = useState("");
  const [tradingen, setTradingen] = useState("");
  const [tradingar, setTradingar] = useState("");

  const [snapshot, setSnapshot] = useState(null);

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const getData = async () => {
      try {
        if (!snapshot) {
          const response = await kuzzle.document.search(
            "bianat",
            "snapshot",
            {}
          );
          setMarketSnapData(response.hits[0]._source);
          setCurrentOutlook(response.hits[0]._source.currentOutlook.marketPre);
          setTrading(response.hits[0]._source.tradingEnv.colorValue);
          setCurrentOutlookEn(response.hits[0]._source.currentOutlook.currentOutlooken);
          setCurrentOutlookAr(response.hits[0]._source.currentOutlook.currentOutlookar);
          setTradingen(response.hits[0]._source.tradingEnv.tradingEnven);
          setTradingar(response.hits[0]._source.tradingEnv.tradingEnvar);
        } else {
          const response = await kuzzle.document.get(
            "bianat",
            "snapshot",
            snapshot
          );
          setMarketSnapData(response._source);
          setCurrentOutlook(response._source.currentOutlook.marketPre);
          setTrading(response._source.tradingEnv.colorValue);
          setCurrentOutlookEn(response._source.currentOutlook.currentOutlooken);
          setCurrentOutlookAr(response._source.currentOutlook.currentOutlookar);
          setTradingen(response._source.tradingEnv.tradingen);
          setTradingar(response._source.tradingEnv.tradingar);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [snapshot]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await kuzzle.document.get("bianat", "indicators", "TASI");

      const obj = result._source;

      if (obj.confirmUptrend) {
        setData("Confirm Uptrend");
      } else if (obj.uptrendUnderPressure) {
        setData("Uptrend Under Pressure");
      } else if (obj.marketInCorrection) {
        setData("Market In Correction");
      }
    };

    fetchData();
  }, []);


  


  return (
    <>
      <Col xs={{ span: 24 }} lg={{ span: 12 }}>
        <Card className="info-card min-h" title={`${t("Market_Snapshot")}`}>
          {auth && auth.user?.roles.includes("admin") && (
            <Button
              className="edit-btn"
              icon={<EditOutlined />}
              onClick={() => {
                setVisible(!visible);
              }}
            />
          )}
          <div className="data-list">
            <Row>
              {/* <Row gutter={8}>
            <Col span={8}>
              <label className="label">{`${t("fridays")} ${t(
                "action"
              )}:`}</label>
            </Col>
            <Col span={16}>
              <p>Indexes extend rebound</p>
            </Col>
          </Row> */}
              <Col span={10} className="text-center">
                <Row gutter={8} className="snap-col">
                  <Col span={24} style={{ display: "table-cell" }}>
                    <p>
                      {`${t("current_outlook")}:`}{" "}
                      <span className="d-inline">
                        {marketSnapData &&
                          marketSnapData?.currentOutlook[
                            `currentOutlook${i18n.language}`
                          ]}
                      </span>
                    </p>

                    {currentOutlook && (
                      <Tooltip
                        title={
                          marketSnapData &&
                          marketSnapData.currentOutlook[
                            `currentOutlook${i18n.language}`
                          ]
                        }
                      >
                        <Image
                          preview={false}
                          className="downtrend"
                          style={{ marginLeft: 30 }}
                          src={
                            currentOutlook &&
                            currentOutlook === "Sideways_Market"
                              ? sideWayArrow
                              : currentOutlook === "Confirmed_Uptrend"
                              ? uptrend
                              : downMarket
                          }
                        />
                      </Tooltip>
                    )}
                  </Col>
                </Row>
              </Col>
              <Col span={2}>
                <Divider
                  className="divider"
                  type="vertical"
                  style={{ height: "100%" }}
                />
              </Col>

              <Col span={12} className="text-center">
                <Row gutter={8} className="snap-col">
                  <Col span={24} style={{ display: "table-cell" }}>
                    <p>
                      {t("Trading Environment")}:{" "}
                      <span className="d-inline">
                        {marketSnapData &&
                          marketSnapData?.tradingEnv[`trading${i18n.language}`]}
                      </span>
                    </p>

                    {trading && (
                      <Tooltip
                        title={
                          marketSnapData &&
                          marketSnapData.tradingEnv[`tradingen${i18n.language}`]
                        }
                      >
                        <Image
                          preview={false}
                          className="downtrend-trade"
                          style={{ marginLeft: 50 }}
                          src={
                            trading && trading === "Red"
                              ? red
                              : trading === "Green"
                              ? green
                              : orange
                          }
                        />
                      </Tooltip>
                    )}
                  </Col>
                </Row>
              </Col>
              {/* <Row gutter={8}>
            <Col span={8}>
              <label className="label">{`${t("distribution_days")}:`}</label>
            </Col>
            <Col span={16}>
              <p>2 on S&P 500, 1 on Nasdaq</p>
            </Col>
          </Row> */}
            </Row>
          </div>
        </Card>
      </Col>

      <MarketSnapShowModal
        visible={visible}
        setVisible={setVisible}
        setSnapshot={setSnapshot}
        marketSnapData={marketSnapData}
        currentOutlook={currentOutlook}
        setCurrentOutlook={setCurrentOutlook}
        trading={trading}
        setTrading={setTrading}
        currentOutlookEn={currentOutlookEn}
        currentOutlookAr={currentOutlookAr}
        tradingen={tradingen}
        tradingar={tradingar}
        setCurrentOutlookEn={setCurrentOutlookEn}
        setCurrentOutlookAr={setCurrentOutlookAr}
        setTradingen={setTradingen}
        setTradingar={setTradingar}
      />
    </>
  );
};

export default MarketSnapShot;
