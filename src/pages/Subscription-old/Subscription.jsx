import React, { useState } from "react";
import {
    Steps,
    Form,
    Input,
    Layout,
    Row,
    Col,
    Button,
    message,
    Spin,
    Modal,
    Typography,
} from 'antd'
import { Image } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import BianatFooter from "../../components/BianatFooter";
import BianatHeader from "../../components/BianatHeader";
import BianatTransparentLogo from "../.././assets/bianat-logo-transparent.png";
import authApi from "../../services/authApi";
import { updateStep } from "../../features/Steps/stepSlice";
import { login } from "../../features/Auth/authSlice";
import axios from "axios";

import {
  UserOutlined,
  EnvironmentOutlined,
  CheckOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import Payment from "./Payment";
import { useQuery } from "../../hooks/useQuery";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const Subscription = () => {
  const { t, i18n } = useTranslation();
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);
  const { currentStep } = useSelector((state) => state.currentStep);
  const [subscriptionResponse, setSubscriptionResponse] = useState(null);
  const [isModalVisible,setIsModalVisible] = useState(true)
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const { from } = location.state
  const { Title } = Typography

  const [signUpData, setSignUpData] = useState({
    Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(0);

  const [current, setCurrent] = useState(0);
  const { Step } = Steps;
  const { Content } = Layout;
  const query = useQuery();

  const plan_id = query.get("plan_id");
  const changeTab = () => {
    dispatch(updateStep(currentStep + 1));
  };
  console.log(location.state)

  useEffect(() => {

    if(from && from==='freeUser'){
      setCurrent(1)
    }

  }, [from]);


  const addressChange = async (data) => {
    try {
      const response = await authApi.patch(
        "subscriptions/update_customer_address",
        data
      );

    const {promocode: coupon_code} = data;

      if (response.status === 200) {
        const subscriptionResponse = await authApi.post("subscriptions", {
          plan_id: plan_id ? plan_id : "1",
          coupon_code:coupon_code,
        });
        if (subscriptionResponse.status === 201) {
          window.open(`${subscriptionResponse.data}`, "_blank");
          changeTab();
          message.success("Address added successfully");
        }else{
          console.log(subscriptionResponse)
          message.error(subscriptionResponse.data.message);
        }
      }
    } catch (error) {

      message.error(error.response.data.message);
    }
  };

  const handlePayment = async (values) => {
    let address = {
      ...values,
      phone: values.prefix + values.phone,
    };

    delete address.prefix;

    await addressChange(address);
  };

  const handleSignUp = async (values) => {
    setSignUpData({
      ...values,
    });

    try {
      const result = await authApi.post("auth/signup", values);
      if (result.status === 201 || result.status === 200) {
        const response = await dispatch(login(values)).unwrap();

        if (response.isAuth) {
          changeTab();
        }

        message.success(result.data.message);
      }
    } catch (err) {
      message.error("This username or email is already exist!!");
    }
  };


      const newAddressChange = async (data,userData) => {
      const myApi = axios.create({
          baseURL: process.env.REACT_APP_API_URL,
          withCredentials: true,
      })
        try {
            // const response = await myApi.patch(
            //     'subscriptions/update_customer_address',
            //     data,
            //     {
            //         headers: {
            //             Authorization: `Bearer ${userData.access_token}`,
            //         },
            //     }
            // )

            const { promocode: coupon_code } = data

            // if (response.status === 200) {
                const subscriptionResponse = await myApi.post(
                    'subscriptions',
                    {
                        plan_id: plan_id ? plan_id : '1',
                        coupon_code,
                        address_detail: {
                            ...data,
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${userData.access_token}`,
                        },
                    }
                )
                if (subscriptionResponse.status === 201) {
                  console.log(subscriptionResponse)
                    setSubscriptionResponse(subscriptionResponse)
                } else {
                    message.error(subscriptionResponse.data.message)
                }
            // }
        } catch (error) {
            message.error(error.response.data.message)
        }
    }

    const newHandlePayment = async (userData) => {
        let detail = {
            prefix: '966',
            phone: userData?.user?.phoneNumber,
            address: 'RAGI2929 2929 Rayhanah Bint Zaid 8118 Al Arid District',
            city: 'Al Arid',
            zip: '13337',
            district: 'Al Arid',
            state: 'RIYADH',
            country: 'Saudi Arabia',
            subscription: plan_id ? plan_id : '1',
        }
        let address = {
            ...detail,
            phone: detail?.prefix + detail.phone,
        }

        delete address.prefix

        await newAddressChange(address,userData)
    }




  useEffect(() => {
    if (auth.isAuth && !loading) {
      newHandlePayment(auth)
      changeTab();
      setLoading(true);
     
    }
  }, [auth.isAuth, loading]);

  useEffect(() => {
    setCurrent(currentStep);
  }, [currentStep]);

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      const { data } = await authApi.get(`subscriptions/plans/${plan_id}`);
      setPlan(data.plan);
    })();

    return () => {
      abortController.abort();
    };
  }, [plan_id]);

  return (
      <Layout className="layout-height">
          <BianatHeader />
          <Content
              className={`landing-content ${
                  i18n.language === 'en' ? 'font-loader-en' : 'font-loader'
              } ${currentTheme === 'Dark' && 'dark-skin'}`}
          >
              <Modal
                  className={`${currentTheme === 'Dark' && 'dark-skin'}`}
                  visible={isModalVisible}
                  // onCancel={handleCancel}
                  footer={null}
                  width={1000}
              >
                  <div className="sub-pay">
                      <Title level={1}>
                          {t`subscription_plans.${location?.state?.planName}.title`}
                          <p>
                              {t(
                                  `subscription_plans.${location?.state?.planName}.description`
                              )}
                          </p>
                      </Title>

                      <div className="flex justify-center items-center min-h-80">
                          {subscriptionResponse == null && (
                              <Spin size="large" />
                          )}
                          {subscriptionResponse != null && (
                              <Button
                                  className="ml-2 rounded"
                                  type="primary"
                                  size="large"
                                  onClick={() => {
                                      window.open(
                                          `${subscriptionResponse?.data}`,
                                          '_blank'
                                      )
                                      setStep(6)
                                  }}
                              >
                                  {t('Make Payment')}
                              </Button>
                          )}
                      </div>
                  </div>
              </Modal>

              <div className="container ">
                  <div className="subscriptio-main">
                     <Row gutter={16}>
              <Col xs={{ span: 24 }} lg={{ span: 10 }}>
                <div className="bianat-feature parallax">
                  <div className="color-overlay">
                    <div className="price">
                      <Image
                        src={BianatTransparentLogo}
                        alt="banner"
                        preview={false}
                        className="binat-img"
                      />
                      <h5>{t("Bianat Smart")}</h5>
                      <span className="sar">{t("Sar")}</span>
                      <strong>
                        {plan?.recurring_price}{" "}
                        {t(`subscription_plans.${plan?.name}.price`)}
                      </strong>
                      <small className="d-block fs-14">
                        {plan &&
                          t(`subscription_plans.${plan?.name}.duration_unit`)}
                      </small>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 14 }}>
                <div className="subscription-steps">
                  <h3 className="text-center">
                    {t("Sign Up Your User Account")}
                    <span className="d-block fs-14 text-gray">
                      {t("Fill All Form Fields To Go To Next Step")}
                    </span>
                  </h3>
                  <Steps size="small" current={current}>
                    <Step title={t("SignUp")} icon={<UserOutlined />} />
                    <Step title={t("Address")} icon={<EnvironmentOutlined />} />
                    <Step title={t("Done")} icon={<CheckOutlined />} />
                  </Steps>
                  <div className="subscription-steps-content">
                    {current === 0 && (
                      <Form
                        name="basic"
                        layout="horizontal"
                        onFinish={handleSignUp}
                        initialValues={{ remember: true }}
                      >
                        <Form.Item
                          label={t("Name")}
                          name="name"
                          labelCol={{ offset: 0, span: 7 }}
                          wrapperCol={{ offset: 0, span: 17 }}
                          rules={[
                            {
                              required: true,
                              message: "Please input your name!",
                            },
                          ]}
                        >
                          <Input value={signUpData.Name} />
                        </Form.Item>
                        <Form.Item
                          label={t("Email")}
                          name="email"
                          labelCol={{ offset: 0, span: 7 }}
                          wrapperCol={{ offset: 0, span: 17 }}
                          rules={[
                            {
                              required: true,
                              message: "Please input your email!",
                            },
                          ]}
                        >
                          <Input type="email" value={signUpData.Email} />
                        </Form.Item>
                        <Form.Item
                          label={t("Password")}
                          name="password"
                          labelCol={{ offset: 0, span: 7 }}
                          wrapperCol={{ offset: 0, span: 17 }}
                          rules={[
                            {
                              required: true,
                              message: "Please input your password!",
                            },
                          ]}
                        >
                          <Input.Password value={signUpData.Password} />
                        </Form.Item>
                        <Form.Item
                          label={t("Confirm Password")}
                          name="confirmPassword"
                          dependencies={["password"]}
                          labelCol={{ offset: 0, span: 7 }}
                          wrapperCol={{ offset: 0, span: 17 }}
                          rules={[
                            {
                              required: true,
                              message: "Please confirm your password!",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  !value ||
                                  getFieldValue("password") === value
                                ) {
                                  return Promise.resolve();
                                }

                                return Promise.reject(
                                  new Error(
                                    "The two passwords that you entered do not match!"
                                  )
                                );
                              },
                            }),
                          ]}
                        >
                          <Input.Password value={signUpData.confirmPassword} />
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
                    )}
                    {current === 1 && (
                      <>
                        <Payment handlePayment={handlePayment} />
                      </>
                    )}

                    {current === 2 && (
                      <>
                        <h3 className="text-center">
                          <EllipsisOutlined />
                          {t("Subscription in Progress")}
                        </h3>
                      </>
                    )}
                  </div>
                </div>
              </Col>
            </Row> 
                  </div>
              </div>
          </Content>
          <BianatFooter />
      </Layout>
  )
};

export default Subscription;
