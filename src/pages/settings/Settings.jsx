import React, { useEffect } from "react";
import { Layout, Card, Row, Col, Select } from "antd";
import { useTranslation } from "react-i18next";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useSelector } from "react-redux";
import BianatHeader from "../../components/BianatHeader";
import ChangePassword from "./components/ChangePassword";
import ChangeProfileData from "./components/ChangeProfileData";
import Payment from "./components/ChangePayment";

const { Option } = Select;

const Setting = () => {
  const { Content } = Layout;
  const { t, i18n } = useTranslation();
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);
  const auth = useSelector((state) => state.auth);

  // UseEffect to handle the page direction dynamically based on language
  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
  }, [i18n.language]);

  return (
    <Layout>
      <BianatHeader />
      <Content
        className={`content font-loader ${
          i18n.language === "en" ? "font-loader-en" : "font-loader"
        } ${currentTheme === "Dark" && "dark-skin"}`}
        style={{ minHeight: "100vh" }}
      >
        <GoogleReCaptchaProvider
          reCaptchaKey="6Ld6vckeAAAAAJiHOE4496QEKUuhk62GYYKsR8on"
          language={i18n.language}
          scriptProps={{
            async: false,
            defer: false,
            appendTo: "head",
            nonce: undefined,
          }}
        >
          <div className="min-container">
            <Card className="content-card">
              <Row>
                {/* Adjust Row alignment dynamically based on language */}
                <Col flex="auto" span={24}>
                  <div id="updateProfile" className="content-data">
                    <ChangeProfileData user={auth.user} />
                  </div>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col span={12}>
                  <div id="updatePassword" className="password-content-data">
                    <ChangePassword />
                  </div>
                </Col>
                <Col span={12}>
                  <div id="payment" className="payment-content-data">
                    <Payment />
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </GoogleReCaptchaProvider>
      </Content>
    </Layout>
  );
};

export default Setting;
