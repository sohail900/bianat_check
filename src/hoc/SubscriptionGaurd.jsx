import React, { useState } from "react";
import { Empty, Button, Image } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import histogramChartlight from "../assets/subscriptions_img/histogramChartlight.png";
import histogramChartdark from "../assets/subscriptions_img/histogramChartdark.png";
import { t } from "i18next";

/**
 * @name SubscriptionGaurd
 * @description This component is used to check if the user is subscribed to the page or not. If not, it will show a button to upgrade to paid plan.
 * @returns {JSX.Element}
 */

const UpgradePackage = ({ id, specific_width = "" }) => {
  const [currentImage, setCurrentImage] = useState();
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const navigate = useNavigate();
  const fetchImage = async (fileName) => {
    try {
      const response = await import(`../assets/subscriptions_img/${fileName}`); // change relative path to suit your needs
      setCurrentImage(response.default);
    } catch (err) {
      console.log(err);
    }
  };
  let imageSrc = `${id}${currentTheme === "Dark" ? "dark" : "light"}.png`;
  fetchImage(imageSrc);
  return (
    <div className="position-relative" style={{ width: specific_width }}>
      <Image
        src={currentImage}
        style={{ width: "100%", height: "100%" }}
        preview={false}
      />
      <div className="subscribe_btn_sec">
        {/* <p>{t("Subscribe to Unlock")}</p> */}
        <Button
          onClick={() => navigate("/settings")}
          className="subscribe_btn ant-btn ant-btn-primary fs-12"
        >
          {t("Subscribe")}
          {/* {t("Comming Soon")} */}
        </Button>
      </div>
    </div>
  );
};

const SubscriptionGaurd = ({ children, page, id,specific_width }) => {
  const { subscriptionDetails } = useSelector((state) => state.auth);
  const pageFound = subscriptionDetails?.pages?.find(
    (item) => item.id === page
  );

  // if (!pageFound) {
  //   return <UpgradePackage id={id} specific_width={specific_width} />;
  // }

  // if (pageFound.allWidgetsAllowed) 
    return children;

  // const widgetFound = pageFound.widgets.find((item) => item.id === id);

  // if (!widgetFound) {
  //   return <UpgradePackage specific_width={specific_width} id={id} />;
  // }

  // return children;
};

export default SubscriptionGaurd;
