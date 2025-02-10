import React, { useEffect, useContext, useState } from "react";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { updateStock } from "../../../../features/Stock/stockSlice";
import { updateRankIndustryStock } from "../../../../features/RankIndustryStock/rankIndustryStockSlice";
import {
  updateScreener,
  updateScreenerName,
} from "../../../../features/Screener/screenerSlice";
import { KuzzleContext } from "../../../../App";
import { Button } from "antd";
import esb from "elastic-builder";

const StockRankInIndustry = ({ handleShowScreener }) => {
  const { currentStock } = useSelector((state) => state.currentStock);
    const stockType = useSelector((state) => state.currentStock.stockType);
  const [stocksRankData, setStocksRankData] = useState([]);
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const [topStocks, setTopStocks] = useState([]);
  const { currentIndustry, bianatGroupSymbol } = useSelector(
    (state) => state.currentIndustry
  );
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const getRankIndustryStock = async () => {
    try {
      const response = await kuzzle.document.search(
        "bianat",
        "indicators",
        esb
          .requestBodySearch()
          .query(esb.matchQuery("bianatGroupSymbol", bianatGroupSymbol ))
          .sort(esb.sort("rsRating")),
        { size: 3 }
      );
      setTopStocks(response.hits);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRankIndustryStock();
  }, [currentIndustry, bianatGroupSymbol]);

  const getStockRankInIndustry = async (stockName) => {
    try {
      const response = await kuzzle.document.search(
        "bianat",
        "indicators",
        esb
          .requestBodySearch()
          .query(esb.matchQuery("code", stockName))
          .source({ includes: ["epsRating", "relativeStrength.current"] })
      );

      setStocksRankData(response.hits[0]._source);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
   
      getStockRankInIndustry(currentStock);
   
  }, [currentStock]);
  
  console.log("stocksRankData", stocksRankData);
  return (
    <>
      <table className="table chart-table mb-1">
        <thead>
          <tr>
            <th colSpan="2">{t("Stock Rank In Industry Group")}</th>
          </tr>
        </thead>
        {stocksRankData && stocksRankData.length > 0 && (
          <tbody>
            <tr>
              <td>{t("EPS Rating")}</td>
              <td>{parseInt(stocksRankData.epsRating)}</td>
            </tr>
            <tr>
              <td>{t("RS Rating")}</td>
              <td>{parseInt(stocksRankData?.relativeStrength?.current)}</td>
            </tr>
          </tbody>
        )}
      </table>

      <table className="table chart-table mb-1">
        <thead>
          <tr>
            <th colSpan="2">{t("top_performer_industry.title")}</th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th>{t("top_performer_industry.code")}</th>
            <th>{t("top_performer_industry.rs_rating")}</th>
            <th>{t("top_performer_industry.eps_rating")}</th>
          </tr>
        </thead>
        {topStocks &&
          topStocks.length > 0 &&
          topStocks.map(
            (stock) => (
              (
                <tbody>
                  <tr>
                    <td
                      className="text-success"
                      onClick={() => dispatch(updateStock(stock._source?.code))}
                      style={{ cursor: "pointer" }}
                    >
                      {i18n.language === "ar"
                        ? stock._source.shortNameAr
                        : stock._source.shortNameEn}
                    </td>
                    <td>{stock._source?.relativeStrength?.current}</td>
                    <td>{stock._source?.epsRating}</td>
                  </tr>
                </tbody>
              )
            )
          )}
      </table>
      <Button
        type="primary"
        className="mt-1"
        onClick={() => {
          dispatch(updateRankIndustryStock(true));
          dispatch(updateScreenerName("Industry"));
          handleShowScreener(true);
        }}
      >
        {t("View Industry Stock")}
      </Button>
    </>
  );
};

export default StockRankInIndustry;
