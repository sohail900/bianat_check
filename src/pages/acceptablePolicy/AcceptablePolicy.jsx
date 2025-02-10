import React from "react";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import BianatHeader from "../../components/BianatHeader";
import Footer from "../landing/Components/Footer";

/**
 * @name AcceptablePolicy
 * @description AcceptablePolicy page
 * @purpose To display the AcceptablePolicy page
 * @returns {JSX} JSX element containing the AcceptablePolicy page
 */

const AcceptablePolicy = () => {
  const { t, i18n } = useTranslation();
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const { Content } = Layout;
  return (
    <Layout className={`${currentTheme === "Dark" && "dark-skin"}`}>
      <BianatHeader />
      <Content
        className={`landing-content pb-6 ${
          i18n.language === "en" ? "font-loader-en" : "font-loader"
        }`}
      >
        <div className="min-container acceptable-pg">
          <div className="inner-heading">
            <h1 className="privacy-heading">{t("Use Policy")}</h1>
          </div>
          <div>
            <h3>{t("Acceptable Use Policy")}</h3>
            <p>{t("Bianat website Acceptable Use Policy")}</p>
          </div>
          <div>
            <h3>{t("DISCLAIMER")}</h3>
            <p>{t("Bianat is not liable for any inaccurate")}</p>
            <p>{t("Bianat does not assume any responsibility")}</p>
          </div>
          <div>
            <h3>{t("LIMITATIONS OF LIABILITY")}</h3>
            <p>{t("By continuing to use this website, the user agrees")}</p>
          </div>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default AcceptablePolicy;
