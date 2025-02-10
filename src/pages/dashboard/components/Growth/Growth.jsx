import React, { useContext, useEffect } from "react";
import { Menu, Typography, Dropdown, Button, Image, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { DownOutlined } from "@ant-design/icons";
import circleRed from "../../../../assets/circle.png";
import circleGreen from "../../../../assets/circleGreen.png";
import { useState } from "react";
import { useSelector } from "react-redux";
import { KuzzleContext } from "../../../../App";
import authApi from "../../../../services/authApi";
import { quarterDiff } from "../../../../utils/ReuseableFunctions";

const Checklist = () => {
  const { Title } = Typography;
  const { t } = useTranslation();

  const { kuzzleHttp } = useContext(KuzzleContext);
  const [currentAction, setCurrentAction] = useState(undefined);
  const [earningChange, setEarningChange] = useState();
  const [salesChange, setSalesChange] = useState();
  const [rsRating, setRSRating] = useState();

  const { currentTheme } = useSelector((state) => state.currentTheme);
  const { currentStock } = useSelector((state) => state.currentStock);

  const [checkListData, setCheckListData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await authApi.get(
        `fundamentals/quarterly-fundamental-data/${currentStock}?limit=8`
      );

      if (data.data.length === 8) {
        let quarter1 = data.data[0];
        let quarter2 = data.data[4];
        let quarter3 = data.data[1];
        let quarter4 = data.data[5];

        let earningChangePer1 = quarterDiff(quarter2.eps, quarter1.eps);
        let earningChangePer2 = quarterDiff(quarter4.eps, quarter3.eps);

        let salesChangePer1 = quarterDiff(quarter2.sales, quarter1.sales);
        let salesChangePer2 = quarterDiff(quarter4.sales, quarter3.sales);
        setEarningChange(
          earningChangePer1 >= 25 && earningChangePer2 >= 25 ? (
            <Image src={circleGreen} className="circle-img" />
          ) : (
            <Image src={circleRed} className="circle-img" />
          )
        );
        setSalesChange(
          salesChangePer1 >= 25 && salesChangePer2 >= 25 ? (
            <Image src={circleGreen} className="circle-img" />
          ) : (
            <Image src={circleRed} className="circle-img" />
          )
        );
      }
    };

    fetchData();
  }, [currentStock]);

  useEffect(() => {
    const fetchData = async () => {
      const { _source: data } = await kuzzleHttp.document.get(
        "bianat",
        "indicators",
        currentStock
      );
      setRSRating(
        data?.relativeStrength?.current >= 80 ? (
          <Image src={circleGreen} className="circle-img" />
        ) : (
          <Image src={circleRed} className="circle-img" />
        )
      );
    };

    fetchData();
  }, [currentStock]);

  useEffect(() => {
    const fetchData = async () => {
      const { _source: data } = await kuzzleHttp.document.get(
        "bianat",
        "checklist",
        currentStock
      );

      delete data._kuzzle_info;

      setCheckListData(data);
    };

    fetchData();
  }, [currentStock]);

  useEffect(() => {
    if (Object.keys(checkListData).length > 0) {
      setCurrentAction("wjo");
    }
  }, [checkListData]);

  const menu = (
    <Menu className={currentTheme === "Dark" && "dark-skin"}>
      <Menu.Item
        key={"growth"}
        onClick={() => {
          setCurrentAction("growth");
        }}
      >
        {t(`dashboard.right_panel.growth`)}
      </Menu.Item>
      {Object.keys(checkListData).map((key, index) => {
        return (
          <Menu.Item
            key={index}
            onClick={() => {
              setCurrentAction(key);
            }}
          >
            {t(`checklist.${key}.name`)}
          </Menu.Item>
        );
      })}
    </Menu>
  );
  return (
    <>
      {/* <Title level={4}>{t("dashboard.right_panel.growth")}</Title>
      <span className="fs-12 darkspan">
        {t("dashboard.right_panel.growth_tab_description")}
      </span> */}
      <br />
      <Dropdown overlay={menu}>
        <Button className="checklist_btn">
          {currentAction
            ? t(`checklist.${currentAction}.name`)
            : t("dashboard.right_panel.growth")}
          <DownOutlined />
        </Button>
      </Dropdown>

      {/* <span className="fs-12 darkspan">{t("dashboard.benchmark")}</span> */}
      <span className="fs-12 darkspan">{t("dashboard.criteria")}</span>
      <div className="table-responsive">
        <table className="table chart-table checklist-tbl mb-1 mt-1">
          <tbody>
            {currentAction && currentAction !== "growth" ? (
              checkListData &&
              Object.keys(checkListData[currentAction]).map((key, index) => {
                return (
                  <tr key={index}>
                    <td>{t(`checklist.${currentAction}.settings.${key}`)}</td>
                    <td>
                      {
                        <Image
                          src={
                            checkListData[currentAction][key]
                              ? circleGreen
                              : circleRed
                          }
                          className="circle-img"
                        />
                      }
                    </td>
                  </tr>
                );
              })
            ) : (
              <React.Fragment>
                <tr>
                  <td>
                    <Tooltip
                      title={t(
                        "The current RS Rating is greater than or equal to 80"
                      )}
                    >
                      {t("dashboard.right_panel.RS_Rating")}
                    </Tooltip>
                  </td>
                  <td
                    className={`text-end ${
                      rsRating === "Pass" ? "text-success" : "text-dangers"
                    }`}
                  >
                    {rsRating}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Tooltip
                      title={t(
                        "Earnings for the last two quarters are greater than equal to the 25%"
                      )}
                    >
                      {t("dashboard.right_panel.Earnings_Change")}
                    </Tooltip>
                  </td>
                  <td
                    className={`text-end ${
                      earningChange === "Pass" ? "text-success" : "text-dangers"
                    }`}
                  >
                    {earningChange}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Tooltip
                      title={t(
                        "Sales for the last two quarters are greater than equal to the 25%"
                      )}
                    >
                      {t("dashboard.right_panel.Sales_Change")}
                    </Tooltip>
                  </td>
                  <td
                    className={`text-end ${
                      salesChange === "Pass" ? "text-success" : "text-dangers"
                    }`}
                  >
                    {salesChange}
                  </td>
                </tr>
              </React.Fragment>
            )}
          </tbody>
        </table>
      </div>
      {/* {currentAction && checkListData && (
        <React.Fragment>
          <span className="fs-12 darkspan">{t("dashboard.benchmark")}</span>
          <div className="table-responsive">
            <table className="table chart-table checklist-tbl mb-1 mt-1">
              <tbody>
                {currentAction &&
                  Object.keys(checkListData[currentAction]).map(
                    (key, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            {t(`checklist.${currentAction}.settings.${key}`)}
                          </td>
                          <td>
                            {
                              <Image
                                src={
                                  checkListData[currentAction][key]
                                    ? circleGreen
                                    : circleRed
                                }
                                className="circle-img"
                              />
                            }
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
          </div>
        </React.Fragment>
      )} */}
    </>
  );
};

export default Checklist;
