import React from "react";
import { Layout } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BianatHeader from "../../components/BianatHeader";
import Footer from "../landing/Components/Footer";

const RefundPolicy = () => {
  const { Content } = Layout;
  const { t, i18n } = useTranslation();
  const { currentTheme } = useSelector((state) => state.currentTheme);
  return (
    <Layout className={`${currentTheme === "Dark" && "dark-skin"}`}>
      <BianatHeader />
      <Content
        className={`landing-content pb-6 ${
          i18n.language === "en" ? "font-loader-en" : "font-loader"
        }`}
      >
        <div className="min-container refund-pg">
          <div className="inner-heading">
            <h1 className="privacy-heading">{t("Refund Policy")}</h1>
          </div>
          <div>
            <h3>{t("A refund can be made under these conditions")}</h3>
            <ul>
              <li>
                {t(
                  "The return request must be made within 3 days of account activation"
                )}
              </li>
              <li>{t("The amount will be accepted")}</li>
              <li>
                {t(
                  "Suspension of the account immediately after the return request"
                )}
              </li>
            </ul>
          </div>
          <div>
            <h3>{t("Refund Policy")}</h3>
            <p>
              {t(
                "We reserve the right to alter this policy at any time, at our discretion"
              )}
            </p>
            <p>
              {t(
                "Credit/debit card purchases will be refunded to the card used for purchase"
              )}
            </p>
          </div>
          <div>
            <h3>{t("CANCELLATION & AUTO-RENEWAL POLICY")}</h3>
            <p>{t("Purchased Subscriptions are auto-renewed")}</p>
          </div>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default RefundPolicy;
