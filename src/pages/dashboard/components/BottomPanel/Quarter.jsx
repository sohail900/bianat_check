import React, { useState } from "react";
import { Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  quarterDiff,
  caretComponent,
  fixValue,
  successOrDanger,
} from "../../../../utils/ReuseableFunctions";

const Quarter = ({ sales, earnings, taxMargin, data, wholeData }) => {

  const { t, i18n } = useTranslation();
  let month = moment(data?.date, "YYYY-MM-DD").format("MM");
  let year = moment(data?.date, "YYYY-MM-DD").format("YYYY");
  let day = moment(data?.date, "YYYY-MM-DD").format("DD");
  let preQuarter = wholeData.filter(
    (obj) => obj.date == `${year - 1}-${month}-${day}`
  );

  const { currentTheme } = useSelector((state) => state.currentTheme);

  // if(preQuarter.length>0 &&(!data[sales] || !preQuarter[0][earnings] || !preQuarter[0][sales])) return (<div></div>)

  return (
    <Col flex="auto">
      {preQuarter && preQuarter.length > 0 && (
        <table className="table table-info">
          <tbody>
            <tr>
              <th
                colSpan="4"
                style={{ textAlign: "center" }}
                className={`${
                  i18n.language === "en" ? "font-loader-en" : "font-loader"
                }`}
              >
                {t("Qtr Ended")} {data.date}
              </th>
            </tr>
            <tr>
              <td className={`${successOrDanger(preQuarter[0][earnings])}`}>
                {caretComponent(preQuarter[0][earnings])}
                &nbsp;
                {preQuarter[0][earnings]
                  ? `${fixValue(preQuarter[0][earnings])}`
                  : "N/A"}
              </td>
              <td>{t("vs")}</td>
              <td className={`${successOrDanger(data[earnings])}`}>
                {caretComponent(data[earnings])}
                &nbsp;
                {data[earnings] ? `${fixValue(data[earnings])}` : "N/A"}
              </td>

              <td
                className={`${successOrDanger(
                  quarterDiff(preQuarter[0][earnings], data[earnings])
                )}`}
              >
                {quarterDiff(preQuarter[0][earnings], data[earnings])}%
              </td>
            </tr>
            <tr>
              <td className={`${successOrDanger(preQuarter[0][sales])}`}>
                {caretComponent(preQuarter[0][sales])}
                &nbsp;
                {preQuarter[0][sales] ? `${preQuarter[0][sales]} M` : "N/A"}
              </td>
              <td>{t("vs")}</td>
              <td className={`${successOrDanger(data[sales])}`}>
                {caretComponent(data[sales])}
                &nbsp;
                {data[sales] ? `${fixValue(data[sales])} M` : "N/A"}
              </td>

              <td
                className={`${successOrDanger(
                  quarterDiff(preQuarter[0][sales], data[sales])
                )}`}
              >
                {quarterDiff(preQuarter[0][sales], data[sales])}%
              </td>
            </tr>
            <tr>
              {taxMargin === "margin" ? (
                <>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className={`${successOrDanger(data[taxMargin])}`}>
                    {caretComponent(data[taxMargin])}
                    &nbsp;
                    {fixValue(data[taxMargin])}%
                  </td>
                </>
              ) : (
                <>
                  <td
                    colSpan={3}
                    className={`${currentTheme != "Dark" && "peValue"}`}
                  >
                    {fixValue(data?.minPE)}
                  </td>

                  <td className={`${currentTheme != "Dark" && "peValue"}`}>
                    {fixValue(data?.maxPE)}
                  </td>
                </>
              )}
            </tr>
          </tbody>
        </table>
      )}
    </Col>
  );
};

export default Quarter;
