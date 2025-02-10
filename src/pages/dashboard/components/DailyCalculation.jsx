import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Row, Col } from "antd";
import { numFormatter } from "../../../utils/ReuseableFunctions";

/**
 * @name DailyCalculation
 * @description Daily calculation component for dashboard
 * @purpose To display daily calculation data
 * @param {data} data - data to be displayed
 * @returns {JSX} JSX elements
 */

const DailyCalculation = ({ data }) => {
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const { t, i18n } = useTranslation();

  return (
    <Row className={`${currentTheme === "Dark" && "bg-color"}`}>
      <Col span={24} className="br-1">
        <table className="table chart-table">
          <tbody>
            <tr>
              <td colSpan="3">{`${t("P_E")}`}</td>
              <td
                className={`${
                  i18n.language === "en" ? "text-end" : "text-start"
                }`}
              >
                {data?.p_e ? parseInt(data?.p_e) : data?.p_e}
              </td>
            </tr>
            {/* <tr>
              <td>{`${t("Mkt_Cap")}`}</td>
              <td
                className={`${
                  i18n.language === "en" ? "text-end" : "text-start"
                }`}
              >
                {numFormatter(data.mkt_cap)} {`${t("Sr")}`}
              </td>
            </tr> */}
            {/* <tr>
              <td>{`${t("Shares")}`}</td>
              <td
                colSpan="3"
                className={`${
                  i18n.language === "en" ? "text-end" : "text-start"
                }`}
              >
                {data.share && numFormatter(data.share[0])}
              </td>
            </tr> */}
            {/* <tr>
              <td style={{ borderBottom: "none" }}>{`${t("Funds")}`}</td>
              <td
                style={{ borderBottom: "none" }}
                className={`${
                  i18n.language === "en" ? "text-end" : "text-start"
                }`}
              >
                56%
              </td>
            </tr> */}
          </tbody>
        </table>
      </Col>
    </Row>
  );
};

export default DailyCalculation;
