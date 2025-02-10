import React from "react";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
const RelativeStrengthRating = ({ data }) => {
  const { Title } = Typography;
  const { t } = useTranslation();
  return (
    <>
      {data && (
        <>
          <Title level={4}>{t("Relative Strength Rating")}</Title>
          <table className="table chart-table mb-1">
            <tbody>
              <tr>
                <td>{t("dashboard.rs_rating")}</td>
                <td className="text-end text-success">
                  {data.relativeStrength?.current
                    ? data.relativeStrength?.current
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>{t("technical.1_Week_Ago")}</td>
                <td className="text-end text-success">
                  {data.relativeStrength?.weekAgo
                    ? data.relativeStrength?.weekAgo
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>{t("technical.4_Weeks_Ago")}</td>
                <td className="text-end text-success">
                  {data.relativeStrength?.weekAgo4
                    ? data.relativeStrength?.weekAgo4
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>{t("technical.3_Months_Ago")}</td>
                <td className="text-end text-success">
                  {data.relativeStrength?.monthAgo3
                    ? data.relativeStrength?.monthAgo3
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>{t("technical.6_Months_Ago")}</td>
                <td className="text-end text-success">
                  {data.relativeStrength?.monthAgo6
                    ? data.relativeStrength?.monthAgo6
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>{t("technical.1_Year_Ago")}</td>
                <td className="text-end text-success">
                  {data.relativeStrength?.yearAgo
                    ? data.relativeStrength?.yearAgo
                    : "N/A"}
                </td>
              </tr>
              {/* <tr>
                <td>{t("technical.52_Week_High")}</td>
                <td className="text-end text-success">
                  {data.weekHigh52 && parseFloat(data.weekHigh52)
                    ? parseFloat(data.weekHigh52).toFixed(2)
                    : "N/A"}
                </td>
              </tr> */}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default RelativeStrengthRating;
