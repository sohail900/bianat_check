import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Row, Col } from "antd";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import authApi from "../../services/authApi";
import countries from "../../assets/countries.json";


const Payment = ({ handlePayment }) => {
  const { t,i18n} = useTranslation();
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [currentPlan,setCurrentPlan] = useState('');
  const params = new URLSearchParams(useLocation().search);

  const getPlans = async () => {
    try {
      const { data } = await authApi.get("subscriptions/plans");
      setSubscriptionPlans(data);
      const item = data.find(
        (item) => item.plan_code === params.get("plan_id")
      );
      setCurrentPlan(item);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPlans();
  }, []);

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{ width: 80 }}
        className={`${currentTheme === "Dark" && "dark-skin"}`}
      >
        <Option
          value="966"
          className={`${currentTheme === "Dark" && "dark-skin"}`}
        >
          +966
        </Option>
        <Option
          value="87"
          className={`${currentTheme === "Dark" && "dark-skin"}`}
        >
          +87
        </Option>
      </Select>
    </Form.Item>
  );
  return (
    <>
      <Row>
        <Col xs={{ span: 24 }} lg={{ span: 24, offset: 0 }}>
          <Form
            name="basic"
            layout="horizontal"
            onFinish={handlePayment}
            initialValues={{ prefix: "966" }}
          >
            <h4>{t("Address Details")}</h4>
            <Form.Item
              label={t("subscription.mobile")}
              name="phone"
              labelCol={{ offset: 0, span: 5 }}
              wrapperCol={{ offset: 0, span: 19 }}
              rules={[
                {
                  required: true,
                  message: t("Please input your phone!"),
                },
              ]}
            >
              <Input addonBefore={prefixSelector} type="number" />
            </Form.Item>
            <Form.Item
              label={t("Address")}
              name="address"
              labelCol={{ offset: 0, span: 5 }}
              wrapperCol={{ offset: 0, span: 19 }}
              rules={[
                {
                  required: true,
                  message: t("Please input your address!"),
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t("City")}
                  name="city"
                  labelCol={{ offset: 0, span: 11 }}
                  wrapperCol={{ offset: 0, span: 13 }}
                  rules={[
                    {
                      required: true,
                      message: t("Please input your city!"),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col offset={2} span={11}>
                <Form.Item
                  label={t("subscription.zip_code")}
                  name="zip"
                  labelCol={{ offset: 0, span: 11 }}
                  wrapperCol={{ offset: 0, span: 13 }}
                  rules={[
                    {
                      required: true,
                      message: t("Please input your zip code!"),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t("subscription.district")}
                  name="district"
                  labelCol={{ offset: 0, span: 11 }}
                  wrapperCol={{ offset: 0, span: 13 }}
                  rules={[
                    {
                      required: true,
                      message: t("Please input your district!"),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col offset={2} span={11}>
                <Form.Item
                  label={t("subscription.state")}
                  name="state"
                  labelCol={{ offset: 0, span: 11 }}
                  wrapperCol={{ offset: 0, span: 13 }}
                  rules={[
                    {
                      required: true,
                      message: t("Please input your state!"),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={t("subscription.country")}
              name="country"
              labelCol={{ offset: 0, span: 5 }}
              wrapperCol={{ offset: 0, span: 19 }}
              rules={[
                {
                  required: true,
                  message: t("Please input your country!"),
                },
              ]}
              initialValue="Saudi Arabia"
            >
              <Select className={`${currentTheme === "Dark" && "dark-skin"}`}>
                {countries &&
                  countries.map((country) => (
                    <Option
                      value={country.name}
                      className={`${currentTheme === "Dark" && "dark-skin"}`}
                    >
                      {i18n.language === "en" ? country.name : country.namear}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              label={t("subscription.Subscription")}
              name="subscription"
              labelCol={{ offset: 0, span: 5 }}
              wrapperCol={{ offset: 0, span: 19 }}
              rules={[{ required: true }]}
              defaultValue={currentPlan && currentPlan.plan_code}
              initialValue={
                subscriptionPlans &&
                subscriptionPlans.length > 0 &&
                subscriptionPlans[0].plan_code
              }
            >
              <Select className={`${currentTheme === "Dark" && "dark-skin"}`}>
                {subscriptionPlans &&
                  subscriptionPlans.map((plan) => {
                    return (
                      <Select.Option
                        className={`${currentTheme === "Dark" && "dark-skin"}`}
                        value={plan.plan_code}
                      >
                        {t(plan.name)}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
            <Form.Item
              label={t("subscription.promocode")}
              name="promocode"
              labelCol={{ offset: 0, span: 5 }}
              wrapperCol={{ offset: 0, span: 19 }}
              icon={<InfoCircleOutlined />}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button
                className="sub-btn ant-btn-primary ms-5"
                type="primary"
                htmlType="submit"
              >
                {t("Next")}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default Payment;
