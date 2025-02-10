import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, message } from "antd";
import { Typography } from "antd";
import { Spin } from "antd";
import authApi from "../services/authApi";
import { login } from "../features/Auth/authSlice";
import { useDispatch } from "react-redux";

/**
 * @name SignUp
 * @description: SignUp Component for the app.
 * @purpose: To render the signup form of the app.
 * @param {function} handleTokenVerfication - Function to handle token verification.
 * @param {function} setShowModal - Function to set the show modal state.
 * @param {function} setActive - Function to set the active state.
 * @returns {JSX.Element}
 */

export default function SignUp({
  handleTokenVerfication,
  setShowModal,
  setActive,
}) {
  const { Text } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [isSpin,setIsSpin] = useState(false);

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setIsSpin(true);
    try {
      const recaptcha = await handleTokenVerfication();
      if (!recaptcha.success) {
        throw new Error("reCaptcha is required!!");
      }
      values.username = values.email;
      const result = await authApi.post("auth/signup", values);
      if (result.status === 201) {
        setIsSpin(false);
        setLoading(true);
        setShowModal(false);
        form.resetFields();
        message.success(t("signup.success"));
         const response = await dispatch(login(values)).unwrap();
      } else {
        console.log(result.body.message)
        setLoading(false);
        setIsSpin(false)
        setError(result.body.message);
        message.error(result.body.message);
      }
    } catch (err) {
      message.error(err?.response?.data?.message);
    }
  };

  return (
    <Form
      form={form}
      name="signup"
      onFinish={onFinish}
      className={`login-form ${
        i18n.language === "en" ? "font-loader-en" : "font-loader"
      }`}
      layout="vertical"
    >
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[
          {
            required: true,
            message: "Please input your Name!",
          },
        ]}
      >
        <Input placeholder={t("name")} />
      </Form.Item>
      <Form.Item
        name="email"
        label={t("Email")}
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input placeholder={t("email")} type={"email"} />
      </Form.Item>
      <Form.Item
        name="password"
        label={t("Password")}
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input type="password" placeholder={t("Password")} />
      </Form.Item>
      <Form.Item
        label={t("Confirm Password")}
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <br />

      <Form.Item style={{ marginTop: "10px" }}>
        <Button
          block
          disabled={isSpin}
          type="primary"
          style={isSpin ? { background: "white" } : { background: "#004f85" }}
          htmlType="submit"
        >
          {isSpin ? <Spin size="small" /> : <>{t("Sign Up")}</>}
        </Button>
      </Form.Item>
      {error && (
        <Form.Item>
          <Text
            type="danger"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {t("Invalid Credentials")}
          </Text>
        </Form.Item>
      )}
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
          <span className="dark-white"> {t("Already have an account?")}</span>
          <a
            variant="body2"
            onClick={(e) => {
              e.preventDefault();
              setActive("login");
            }}
          >
            {t("Login")}
          </a>
        </div>
      </Form.Item>
    </Form>
  );
}
