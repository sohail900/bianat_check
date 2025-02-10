import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import BianatHeader from "../../components/BianatHeader";
import Footer from "../landing/Components/Footer";

const Privacy = () => {
  const { Content } = Layout;
  const { t, i18n } = useTranslation();
  const { currentTheme } = useSelector((state) => state.currentTheme);

  return (
    <Layout className={`${currentTheme === "Dark" && "dark-skin"} `}>
      <BianatHeader />
      <Content
        className={`landing-content pb-6 ${
          i18n.language === "en" ? "font-loader-en" : "font-loader"
        } `}
      >
        <div className="min-container privacy-pg">
          <div className="inner-heading">
            <h1 className="privacy-heading">{t("Privacy Policy")}</h1>
            <p>{t("Personal information at Bianat")}</p>
          </div>
          <div>
            <h3>{t("Background")}</h3>
            <p>{t("Bianat recognizes the importance of keeping users")}</p>
          </div>
          <div>
            <h3>{t("Privacy")}</h3>
            <p>{t("Bianat shall not collect any personal information")}</p>
            <p>
              {t("This website has taken considerable measures to safeguard")}
            </p>
            <p>
              {t("Bianat monitors all data transfer to and from the website")}
            </p>
            <p>{t("Bianat reserve the right to change this Privacy Policy")}</p>
          </div>
          <div>
            <h3>{t("LEGAL DISCLAIMER")}</h3>
            <p>
              {t(
                "By accessing this website, you agree to be bound by these terms"
              )}
            </p>
            <p>
              {t(
                "The information contained on the Site is for information purposes"
              )}
            </p>
          </div>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Privacy;
