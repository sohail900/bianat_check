import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import {
  quarterDiff,
  fixValue,
  numFormatter,
} from "../../../../../utils/ReuseableFunctions";
const Quarter = ({ data, wholeData, handleEpsQuarterly, handleEpsChange }) => {
  const { t, i18n } = useTranslation();
  let month = moment(data.date, "YYYY-MM-DD").format("MM");
  let year = moment(data.date, "YYYY-MM-DD").format("YYYY");
  let day = moment(data.date, "YYYY-MM-DD").format("DD");
  let preQuarter = wholeData.filter(
    (obj) => obj.date == `${year - 1}-${month}-${day}`
  );
  return (
    preQuarter.length > 0 && (
      <tr>
        <td>{`${month}-${year}`}</td>
        <td>{handleEpsQuarterly(`${year}-${month}-${day}`)}</td>
        <td className="text-success">
          {handleEpsChange(`${year}-${month}-${day}`)}
        </td>
        <td>{numFormatter(parseFloat(data.netIncome))}</td>
        <td className={`${i18n.language === "en" ? "text-end" : "text-start"}`}>
          {quarterDiff(preQuarter[0].netIncome, data.netIncome)}%
        </td>
      </tr>
    )
  );
};

export default Quarter;
