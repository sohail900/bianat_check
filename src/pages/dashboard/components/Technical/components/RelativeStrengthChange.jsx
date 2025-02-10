import React from "react";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
const RelativeStrengthChange = ({ data }) => {
  const { Title } = Typography;
  const { t } = useTranslation();
  return (
    <>
      {data && (
        <>
          <Title level={4}>{t("Relative Strength Change")}</Title>
          <table className="table chart-table mb-1">
            <tbody>
              <tr>
                <td>{t("technical.since_1_week")}</td>
                <td className="text-end text-success">
                  {data.relativeStrength?.since1Week
                    ? data.relativeStrength?.since1Week
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>{t("technical.since_4_weeks")}</td>
                <td className="text-end text-success">
                  {data.relativeStrength?.since4Weeks
                    ? data.relativeStrength?.since4Weeks
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>{t("technical.since_3_months")}</td>
                <td className="text-end text-success">
                  {data.relativeStrength?.since3Months
                    ? data.relativeStrength?.since3Months
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>{t("technical.since_6_months")}</td>
                <td className="text-end text-success">
                  {data.relativeStrength?.since6Months
                    ? data.relativeStrength?.since6Months
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default RelativeStrengthChange;
