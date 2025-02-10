import React, { useEffect, useState } from "react";
import {
  Form,
  Typography,
  Input,
  Button,
  Modal,
  message,
  notification,
} from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import SubscriptionCards from "../../landing/Components/SubscriptionCards";
import Payment from "../../Subscription-old/Payment";
import authApi from "./../../../services/authApi";
import { useQuery } from "../../../hooks/useQuery";

const ChangePayment = () => {
  const query = useQuery();
  const plan_id = query.get("plan_id");
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const { Title } = Typography;
  const auth = useSelector((state) => state.auth);
  const [subPlanCode, setSubPlanCode] = useState(plan_id);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const { t, i18n } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const [expiryDate , setExpiryDate] = useState(null)
  const [packageName , setPackageName] = useState(null)
  // Removed the notification for subscription status
  useEffect(() => {
    const storedSub = localStorage.getItem("new_sub");
    if (storedSub) {
      let parsedSub = JSON.parse(storedSub);
      setIsUserSubscribed(parsedSub.subscribed);
      setExpiryDate(parsedSub.expiryDate)
      setPackageName(parsedSub.packageName)
    }
  }, []);

  useEffect(() => {
    const getPlans = async () => {
      try {
        const { data } = await authApi.get(`subscriptions`);
        setSubscriptionPlans(data[0].plan);
      } catch (error) {
        console.log(error);
      }
    };

    getPlans();
  }, [plan_id]);

  const handleCancel = () => {
    // Directly close the modal
    setIsModalVisible(false);
  };

  const addressChange = async (data) => {
    try {
      const response = await authApi.patch(
        "subscriptions/update_customer_address",
        data
      );

      if (response.status === 200) {
        const subscriptionResponse = await authApi.post("subscriptions", {
          plan_id: subPlanCode ? subPlanCode : "1",
        });
        if (subscriptionResponse.status === 201) {
          message.success("Address added successfully");
          window.open(`${subscriptionResponse.data}`, "_blank");
          setIsModalVisible(false);
        }
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handlePayment = async (values) => {
    let address = {
      ...values,
      phone: values.prefix + values.phone,
    };

    setSubPlanCode(values.subscription);
    delete address.prefix;

    await addressChange(address);
  };

  const deleteSubscription = async () => {
    try {
      const subscriptionResponse = await authApi.post(
        `subscriptions/cancel/${auth.user?.subscriptionIds[0]}`
      );
      if (subscriptionResponse.status === 200) {
        message.success("Subscription cancelled successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const holdSubscription = async () => {
    try {
      const holdSubResponse = await authApi.patch(
        `subscriptions/hold/${auth.user?.subscriptionIds[0]}`
      );
      if (holdSubResponse.status === 200) {
        message.success("Subscription held successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Removed subscription state check logic
  return (
    <div className={i18n.language === "en" ? "font-loader-en" : "font-loader"}>
      {contextHolder}
      <Title level={3}>{t("Payments")}</Title>

      {!isUserSubscribed && (
        <>
          <Button
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            {t("Subscribe")}
          </Button>
          <h1>{t("settings.youAreNotSubscribed")}</h1>
        </>
      )}

      {isUserSubscribed &&
      <>
        <h1>{t("settings.youAreSubscribed")}</h1>
        <p> <strong> Package :</strong> {packageName && packageName  }</p>
        <p><strong>Expiry Date : </strong>{expiryDate && expiryDate.split("T")[0]}</p>
      </>
      }

      {/* Show payment options for all users */}
      {/* <Form>
        <div className="subscription-card-detail">
          <Form.Item
            label={t("Card Number")}
            name="cardNumber"
            rules={[
              {
                required: true,
                message: "Please input your card number!",
              },
            ]}
          >
            <p className="text-muted fw-700" style={{ margin: "0px" }}>
              444
            </p>
          </Form.Item>
          <Form.Item
            label={t("Expiration Date")}
            name="expirationDate"
            rules={[
              {
                required: true,
                message: "Please input your expiration date!",
              },
            ]}
          >
            <p className="text-muted fw-700" style={{ margin: "0px" }}>
              23-5-22
            </p>
          </Form.Item>

          <div>
            <Button style={{ margin: "0px 5px" }} onClick={holdSubscription}>
              {t("Hold")}
            </Button>
            <Button onClick={deleteSubscription}>{t("Cancel")}</Button>
          </div>
        </div>
      </Form> */}

      <Modal
        className={`sub-modal ${currentTheme === "Dark" && "dark-skin"}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <SubscriptionCards userType="freeUser" />
      </Modal>
    </div>
  );
};

export default ChangePayment;
