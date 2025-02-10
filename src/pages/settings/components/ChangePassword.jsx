import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { useTranslation } from "react-i18next";
import authApi from "../../../services/authApi";
import { authChatBot } from "../../../utils/firebase/config";
import { updatePassword } from "firebase/auth";

const ChangePassword = () => {
  const { t, i18n } = useTranslation();
  const { Title } = Typography;
  const onSubmit = async (values) => {
    try {
      const user = authChatBot.currentUser
      if (user) {
        // Update the password
        await updatePassword(user, values.password);
        alert("Password updated successfully");
      } else {
        alert("Error updating password please login again into your account and change password.");
      }
    } catch (error) {
      alert("Error updating password please login again into your account and change password.")
    }
  };
  return (
    <>
      <Title level={3}>{t("Change Password")}</Title>
      <Form
        name="basic"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 12 }}
        initialValues={{ prefix: "86" }}
        autoComplete="off"
        onFinish={onSubmit}
      >
        <Form.Item
          name="password"
          label={t("Password")}
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={t("Confirm Password")}
          dependencies={["password"]}
          hasFeedback
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

        <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
          <Button type="primary" htmlType="submit">
            {t("Update")}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePassword;
