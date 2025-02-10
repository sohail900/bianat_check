import React from "react";
import { Layout } from "antd";
import { Collapse } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BianatHeader from "./../../components/BianatHeader";
import Footer from "../landing/Components/Footer";

const Questions = () => {
  const { Panel } = Collapse;
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
        <div className="min-container faq-page">
          <div className="inner-heading">
            <h1 className="privacy-heading">
              {t("FREQUENTLY ASKED QUESTIONS")}
            </h1>
            <p>
              {t(
                "Get answers to some of the most common questions about Bianat platform."
              )}
            </p>
          </div>

          <div className="faq-panel pb-3">
            <Collapse defaultActiveKey={["1"]}>
              <Panel
                header={t(
                  "What Makes Bianat Different From Other Stock platforms?"
                )}
                key="1"
                className={`${i18n.language === "ar" ? "chgRight" : "chgLeft"}`}
              >
                <p>{t("Bianat was developed from the ground up in order")}</p>
              </Panel>
              <Panel
                header={t(
                  "Do You Have To Be An Experienced Investor To Use Bianat, Or Can Beginners Use It Too?"
                )}
                className={`${i18n.language === "ar" ? "chgRight" : "chgLeft"}`}
                key="2"
              >
                <p>
                  {t("Bianat works for investors of all experience levels")}
                </p>
              </Panel>
              <Panel
                header={t("What If I Have Questions About How To Use Bianat?")}
                className={`${i18n.language === "ar" ? "chgRight" : "chgLeft"}`}
                key="3"
              >
                <p>
                  {t("Our experienced Bianat Coaches are just a phone call")}
                </p>
              </Panel>
              <Panel
                header={t(
                  "Do Bianat Members Get Any Extras Like Webinars, Videos Or Market Analysis?"
                )}
                className={`${i18n.language === "ar" ? "chgRight" : "chgLeft"}`}
                key="4"
              >
                <p>{t("Yes! Bianat members get access to new webinars")}</p>
              </Panel>
              <Panel
                header={t("Can I Use Bianat On Multiple Computers Or Devices?")}
                className={`${i18n.language === "ar" ? "chgRight" : "chgLeft"}`}
                key="5"
              >
                <p>
                  {t(
                    "Yes, your subscription allows you to use Bianat on all of your devices: desktop, tablet and mobile"
                  )}
                </p>
              </Panel>
              <Panel
                className={`${i18n.language === "ar" ? "chgRight" : "chgLeft"}`}
                header={t("How Much Does Bianat Cost?")}
                key="6"
              >
                <p>{t("Bianat Basic plan subscription costs SR1499/ year.")}</p>
              </Panel>
              <Panel
                className={`${i18n.language === "ar" ? "chgRight" : "chgLeft"}`}
                header={t("Can I Cancel My Bianat Membership?")}
                key="7"
              >
                <p>
                  {t(
                    "You can cancel any time. Just send an email to us at info@bianat.sa and explain why you want to leave us."
                  )}
                </p>
              </Panel>
            </Collapse>
          </div>
          <div>
            <p>
              <strong>{t("Any Other Questions? Ask Us!")}</strong>
              {t(
                " Just email us at info@bianat.sa and we'll be glad to answer your questions."
              )}
            </p>
          </div>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Questions;
