import React from "react";
import { Empty, Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";

import BianatHeader from "../../components/BianatHeader";

const SessionExpired = () => {
  const navigate = useNavigate();
  const { Content } = Layout;

  return (
    <Layout>
      <BianatHeader />
      <Content style={{ color: "rgba(0, 0, 0, 0.25)", height: "100vh" }}>
        <Empty
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            margin: 0,
          }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          imageStyle={{
            height: 80,
          }}
          description={<span>Link is Expired or Invalid!!</span>}
        >
          <Button
            type="primary"
            onClick={() => {
              navigate("/");
            }}
          >
            Go to Homepage
          </Button>
        </Empty>
      </Content>
    </Layout>
  );
};

export default SessionExpired;
