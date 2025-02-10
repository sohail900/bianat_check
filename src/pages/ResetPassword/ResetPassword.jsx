import React from "react";
import { Form, Input, Button, message, Layout, Typography, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import authApi from "../../services/authApi";
import BianatHeader from "../../components/BianatHeader";

const { Content } = Layout;
const { Title } = Typography;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const { data } = await authApi.patch(
        `auth/reset-password/${token}`,
        values
      );

      if (data.status === "success") {
        message.success("Password Reset Successfully!!");

        setTimeout(() => {
          navigate("/");
        }, 5000);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <div>
      <Layout>
        <BianatHeader />
        <Content
          style={{
            marginTop: 80,
            height: "calc(100vh - 80px)",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Space direction="vertical" style={{ margin: "auto" }}>
            <Title style={{ textAlign: "center" }} level={3}>
              Reset Password
            </Title>
            <Form
              name="basic"
              style={{
                width: 600,
              }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ prefix: "86" }}
              autoComplete="off"
              onFinish={onSubmit}
            >
              <Form.Item
                name="password"
                label="Password"
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
                label="Confirm Password"
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
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Content>
      </Layout>
    </div>
  );
};

export default ResetPassword;
