import React, { useState } from "react";
import { Form, Input, Button, Spin, message } from "antd";
import { useTranslation } from "react-i18next";
import { MailOutlined } from "@ant-design/icons";
import authApi from "../services/authApi";

/**
 * @name: ForgotPassword
 * @description:  Forgot Password Component for the app.
 * @purpose: To render the forgot password form of the app.
 * @param {function} handleTokenVerfication - Function to handle token verification.
 * @param {function} setShowModal - Function to set the show modal state.
 * @param {function} setActive - Function to set the active state.
 * @returns {JSX.Element}
 */

const ForgotPassword = ({
  handleTokenVerfication,
  setShowModal,
  setActive,
}) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const verified = await handleTokenVerfication();
      if (!verified.success) {
        throw new Error("Captcha is required");
      }

      const response = await authApi.post("auth/forgot-password", values);

      if (response.data.status === "success") {
        message.success(response.data.message);
      }

      setShowModal(false);
    } catch (err) {
      message.error(err.message);
    }
    setLoading(false);
  };

  return (
    <Form name="forgot-password" className="login-form" onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
        ]}
      >
        <Input
          type="email"
          placeholder="email@email.com"
          prefix={<MailOutlined className="site-form-item-icon" />}
        />
      </Form.Item>

      <Form.Item style={{ marginTop: "10px" }}>
        <Button block type="primary" htmlType="submit">
          {t("Forgot Password")}
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
          {t("Already have an account? ")}
          <a
            onClick={(e) => {
              e.preventDefault();
              setActive("login");
            }}
            variant="body2"
          >
            {t("Login")}
          </a>
        </div>
      </Form.Item>
    </Form>
  );
};

export default ForgotPassword;
