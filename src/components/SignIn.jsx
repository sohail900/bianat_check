import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Form, Input, Button, Checkbox, Row, Col, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { getSubscriptionDetails, login } from "../features/Auth/authSlice";
import { useDispatch } from "react-redux";

/**
 * @name SignIn
 * @description SignIn Component for the app.
 * @purpose To render the sign in form of the app.
 * @param {function} handleTokenVerfication - Function to handle token verification.
 * @param {function} setShowModal - Function to set the show modal state.
 * @param {function} setActive - Function to set the active state.
 * @returns {JSX.Element} JSX object.
 * @example <SignIn handleTokenVerfication={handleTokenVerfication} setShowModal={setShowModal} setActive={setActive} />
 */

export default function SignIn({
  handleTokenVerfication,
  setShowModal,
  setActive,
}) {
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const onFinishLogin = async (values) => {
    setLoading(true);
    try {
      const result = await handleTokenVerfication();
      if (!result.success) {
        throw new Error("Captcha is required");
      }

      const response = await dispatch(login(values)).unwrap();

      if (response.isAuth) {
        setShowModal(false);
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      message.error(err?.response?.data?.message);
    }
    setLoading(false);
  };

  return (
    <Form
      name="normal_login"
      className={`login-form ${currentTheme === "Dark" && "dark-skin"} ${
        i18n.language === "en" ? "font-loader-en" : "font-loader"
      }`}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinishLogin}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: t("Please input your Username!"),
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          type="email"
          placeholder={t("Email")}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: t("Please input your Password!"),
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder={t("Password")}
        />
      </Form.Item>

      <Row>
        <Col span={12}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>{t("Remember me")}</Checkbox>
          </Form.Item>
        </Col>
        <Col span={12} className="text-end">
          <a
            className="login-form-forgot"
            onClick={(e) => {
              e.preventDefault();
              setActive("forgot-password");
            }}
          >
            {t("Forgot password")}
          </a>
        </Col>
      </Row>
      <Form.Item style={{ marginTop: "10px" }}>
        <Button block type="primary" htmlType="submit">
          {t("Log in")}
        </Button>
      </Form.Item>
      {loading && (
        <Form.Item>
          <Spin
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          />
        </Form.Item>
      )}
      <Form.Item style={{ marginTop: "24px", marginBottom: "0px" }}>
        <div style={{ textAlign: "center" }}>
          <span className="dark-white"> {t("Don't have an account?")}</span>
          <a
            onClick={(e) => {
              e.preventDefault();
              setActive("signup");
            }}
            variant="body2"
          >
            {t("Sign Up")}
          </a>
        </div>
      </Form.Item>
    </Form>
  );
}
