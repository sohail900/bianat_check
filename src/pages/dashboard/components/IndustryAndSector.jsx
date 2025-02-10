import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Typography, Collapse } from "antd";
import esb from "elastic-builder";
import { getResources } from "../../../services/apis";
import IndustrySummary from "./IndustryAndSector/IndustrySummary";
import { KuzzleContext } from "../../../App";
import StockRankInIndustry from "./IndustryAndSector/StockRankInIndustry";

/**
 * @name OwnerFund
 * @description Owner fund component for dashboard
 * @purpose To display owner fund data
 * @returns {JSX} JSX elements
 */

const OwnerFund = ({ handleShowScreener }) => {
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const [stocks, setStocks] = useState([]);
  const { t } = useTranslation();
  const [data, setData] = useState();
  const currentStock = useSelector((state) => state.currentStock.currentStock);
  const stockType = useSelector((state) => state.currentStock.stockType);
  const realTimeData = useSelector((state) => state.realTime.realTimeData);
  
  useEffect(() => {
    const getResourcesData = async () => {
      try {
        const result = await getResources(currentStock);
        setData(result);
      } catch (err) {
        console.log(err);
      }
    };
    if(stockType ==="Stock"){
      getResourcesData();
    }
  }, [currentStock]);

  const getAllStocks = async () => {
    let id = await kuzzle.document.search(
      "bianat",
      "indicators",
      esb
        .requestBodySearch()
        .query(esb.matchQuery("sector", data.Sector))
        .source(["close", "code", "change_p"]),
      {
        size: 10000,
      }
    );
    setStocks(id.hits);
  };

  useEffect(() => {
    if (data) {
      getAllStocks();
    }
  }, [data]);

  return (
    <div>
      <div className="section-1">
        {/* <Title level={4}>{t("Competators")}</Title> */}
        <IndustrySummary />
        <StockRankInIndustry handleShowScreener={handleShowScreener} />
        {/* <Button type="primary" size="small" ghost className="view-btn">
          View Stock in Industry
        </Button> */}
      </div>
      <div className="section-1 mb-1">
        {/* <Title level={4}>{t("Sector")}</Title> */}
        {/* <TopIndustriesInSector /> */}
        {/* <Button type="primary" size="small" ghost className="view-btn">
          View Stocks in Sector
        </Button> */}
      </div>

      {/* <div className="section-1">
        <Collapse className="sm-collapse" defaultActiveKey={["1"]}>
          <Panel header={t("OverView")} key="1">
           <OverView /> 
          </Panel>
          <Panel header={t("Stocks in Group")} key="2">
           <StocksInGroup /> 
          </Panel>
          <Panel header={t("Top Stocks")} key="3">
             <TopStocks /> 
          </Panel>
           <Panel header="Sector" key="4">
            <Sectors />
          </Panel> 
        </Collapse>
      </div> */}
    </div>
  );
};

export default OwnerFund;
