import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { numFormatter } from "../../../../utils/ReuseableFunctions";
import { getIndustryStockRankData } from "../../../../services/apis";

const IndustrySummary = () => {
  const [stockRankData, setStockRankData] = useState(null);
  const { currentStock } = useSelector((state) => state.currentStock);
  const { currentIndustry } = useSelector((state) => state.currentIndustry);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const getStockRankData = async () => {
      try {
        setStockRankData(null);
        const data = await getIndustryStockRankData(currentIndustry);
        setStockRankData(data);
      } catch (err) {
        console.log(err);
      }
    };
    getStockRankData();
  }, [currentIndustry]);

  return (
    <table className="table chart-table mb-1">
      {stockRankData ? (
        <>
          <thead>
            <tr>
              <th colSpan="2">{t("Industry Summary")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* <td>{`Industry ${stockRankData.totalIndustry} Rank`}</td> */}
              <td>{t("Industry Rank")}</td>
              <td
                className={`${
                  i18n.language === "en" ? "text-end" : "text-start"
                }`}
              >
                {stockRankData?.industryRank} {t("of 38")}
              </td>
            </tr>
            {/* <tr>
              <td>{t("Industry Market Value")}</td>
              <td
                className={`${
                  i18n.language === "en" ? "text-end" : "text-start"
                }`}
              >
                {stockRankData?.marketCapitalization &&
                  numFormatter(stockRankData?.marketCapitalization)}
              </td>
            </tr> */}
            <tr>
              <td>{t("Number of stocks")}</td>
              <td
                className={`${
                  i18n.language === "en" ? "text-end" : "text-start"
                }`}
              >
                {stockRankData?.tickers}
              </td>
            </tr>
            <tr>
              <td>{t("New High Stocks")}</td>
              <td
                className={`${
                  i18n.language === "en" ? "text-end" : "text-start"
                }`}
              >
                {stockRankData?.isNewHigh}
              </td>
            </tr>
            <tr>
              <td>{t("New Low Stocks")}</td>
              <td
                className={`${
                  i18n.language === "en" ? "text-end" : "text-start"
                }`}
              >
                {stockRankData?.isNewLow}
              </td>
            </tr>
          </tbody>
        </>
      ) : (
        <Spin />
      )}
    </table>
  );
};

export default IndustrySummary;
