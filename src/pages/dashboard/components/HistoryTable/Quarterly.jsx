import React, { useState, useEffect } from "react";
import { getQuarters } from "../../../../services/apis";
import Quarter from "./components/quarter";
import { useTranslation } from "react-i18next";
import { fixValue } from "../../../../utils/ReuseableFunctions";
import authApi from "./../../../../services/authApi";

const Quarterly = ({ currentStock }) => {
  const { t, i18n } = useTranslation();
  const [quarters, setQuarters] = useState();
  const [epsQuarterly, setEpsQuarterly] = useState();

  const handleEpsQuarterly = (year) => {
    if (epsQuarterly) {
      return fixValue(epsQuarterly.epsRating[year]);
    }
    return "N/A";
  };

  const handleEpsChange = (year) => {
    // const data = JSON.parse(epsQuarterly);
    // if (data) {
    //   return data[year].epsDifference;
    // }
    return "N/A";
  };

  useEffect(() => {
    const abortController = new AbortController();
    const getQuarter = async () => {
      try {
        const response = await getQuarters(currentStock);
        console.log(response);
        setQuarters(response);
      } catch (err) {
        console.log(err);
      }
    };
    getQuarter();
    return () => {
      abortController.abort();
    };
  }, [currentStock]);

  useEffect(() => {
    const getEpsQuarterly = async () => {
      try {
        const response = await authApi.get(
          `/fundamentals/quarterly-eps-rating/${currentStock}`
        );
        setEpsQuarterly(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getEpsQuarterly();
  }, [currentStock]);

  return (
    <table className="quarterly table chart-table" style={{ fontSize: "9px" }}>
      <thead>
        <tr>
          <th>{t("dashboard.quarterly")}</th>
          <th>{t("dashboard.eps")}</th>
          <th>{t("dashboard.change")}</th>
          <th className="text-center">{t("dashboard.sales")}</th>
          <th
            className={`${
              i18n.language === "en" ? "text-center" : "text-start"
            }`}
          >
            {t("dashboard.change")}
          </th>
        </tr>
      </thead>
      <tbody>
        {quarters &&
          quarters.map((quarter) => (
            <Quarter
              data={quarter}
              wholeData={quarters}
              handleEpsQuarterly={handleEpsQuarterly}
              handleEpsChange={handleEpsChange}
            />
          ))}
      </tbody>
    </table>
  );
};

export default Quarterly;
