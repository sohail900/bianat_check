import React from "react";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import {
  fixValue,
  successOrDanger,
} from "../../../../../utils/ReuseableFunctions";

/**
 * @name PercentageChangeTable
 * @description FundOwnerShip component
 * @purpose  This component is used to display the fund ownership table.
 * @returns {JSX} JSX element
 */

const PercentageChangeTable = ({ data }) => {
  const { Title } = Typography;
  const { t } = useTranslation();

  return (
    <>
      {data && (
        <>
          <Title level={4}>{t("dashboard.percentage_change")}</Title>
          <table className="table chart-table mb-1">
            <tbody>
              <tr>
                <td>{t("Daily")}</td>
                <td
                  className={`text-end text-success ${successOrDanger(
                    data.change_timeData?.daily
                  )}`}
                >
                  {fixValue(data.change_timeData?.daily)}%
                </td>
              </tr>
              <tr>
                <td>{t("Weekly")}</td>
                <td
                  className={`text-end text-success ${successOrDanger(
                    data.change_timeData?.weekly
                  )}`}
                >
                  {fixValue(data.change_timeData?.weekly)}%
                </td>
              </tr>
              <tr>
                <td>{t("Monthly")}</td>
                <td
                  className={`text-end text-success ${successOrDanger(
                    data.change_timeData?.monthly
                  )}`}
                >
                  {fixValue(data.change_timeData?.monthly)}%
                </td>
              </tr>
              <tr>
                <td>{t("Quarterly")}</td>
                <td
                  className={`text-end text-success ${successOrDanger(
                    data.change_timeData?.quarterly
                  )}`}
                >
                  {fixValue(data.change_timeData?.quarterly)}%
                </td>
              </tr>
              <tr>
                <td>{t("YTD")}</td>
                <td
                  className={`text-end text-success ${successOrDanger(
                    data.change_timeData?.yearly
                  )}`}
                >
                  {fixValue(data.change_timeData?.yearly)}%
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default PercentageChangeTable;
