import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Image, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { getShariaCompliantsData } from "../../../../services/apis";
import circleRed from "../../../../assets/circle.png";
import circleGreen from "../../../../assets/circleGreen.png";

const Shariah = () => {
  const { currentStock } = useSelector((state) => state.currentStock);
  const [shariahData, setShariahData] = useState([]);
  const { Title } = Typography;
    const { t, i18n } = useTranslation();
  const getData = async () => {
    try {
      const response = await getShariaCompliantsData(currentStock);
      setShariahData(response);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    getData();
  }, [currentStock]);
  return (
    <>
      <Title level={4}>{t("dashboard.right_panel.Shariah")}</Title>
      <table className="table chart-table mb-1">
        <tbody>
          {shariahData && shariahData.length > 0 && (
            <>
              <tr>
                <td>{t("dashboard.right_panel.Al Rajhi Capital")}</td>
                <td>
                  {
                    <Image
                      src={
                        shariahData[0]?.al_rajhi_capital === "1"
                          ? circleGreen
                          : circleRed
                      }
                      className="circle-img"
                    />
                  }
                </td>
              </tr>
              <tr>
                <td>{t("dashboard.right_panel.Albilad Capital")}</td>
                <td>
                  {
                    <Image
                      src={
                        shariahData[0]?.albilad_finance === "1"
                          ? circleGreen
                          : circleRed
                      }
                      className="circle-img"
                    />
                  }
                </td>
              </tr>
              <tr>
                <td>{t("dashboard.right_panel.Alinma Investment")}</td>
                <td>
                  {
                    <Image
                      src={
                        shariahData[0]?.alinma_investment === "1"
                          ? circleGreen
                          : circleRed
                      }
                      className="circle-img"
                    />
                  }
                </td>
              </tr>
              <tr>
                <td>{t("dashboard.right_panel.Dr. Al-Osaimi")}</td>
                <td>
                  {
                    <Image
                      src={
                        shariahData[0]?.dr_muhammad_bin_saud === "1"
                          ? circleGreen
                          : circleRed
                      }
                      className="circle-img"
                    />
                  }
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </>
  );
};

export default Shariah;
