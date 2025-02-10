import React, { useEffect, useState } from "react";
import { message, Typography, Row, Col, Button } from "antd";
import { NavLink as Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import authApi from "../../../services/authApi";
import UserAuthModal from "../../../components/UserAuthModal";
import { useSelector } from "react-redux";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { dbChatBot } from "../../../utils/firebase/config";
import MoyasarPay from "./MoyasarPay";

const { Title } = Typography;

const SubscriptionCards = ({ userType }) => {
  const [plans, setPlans] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [active, setActive] = useState("signup");
  const { t, i18n } = useTranslation();
  const auth = useSelector((state) => state.auth);
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const fetchPlans = async () => {
    try {
      const q = query(
        collection(dbChatBot, "subscriptions"),
        orderBy("duration", "asc")
      );
      const querySnapshot = await getDocs(q);

      // Map through the documents and extract the data
      const plansArray = querySnapshot.docs.map((doc) => ({
        id: doc.id, // In case you need the document ID
        ...doc.data(), // Spread the document data
      }));
      // console.log(plansArray)
      setPlans(plansArray);
    } catch (err) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    setCurrentPath(location.pathname);
    fetchPlans();
  }, []);

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
  };

  const { user } = auth;
  return (
    <section
      id="subscription"
      className={`bianat-plan ${currentTheme === "Dark" && "dark-skin"} ${
        i18n.language === "en" ? "font-loader-en" : "font-loader"
      }`}
    >
      <div className="min-container">
        {!selectedPlan && (
          <>
            <Title level={1}>{t("CHOOSE YOUR BIANAT PLAN")}</Title>
            <Row gutter={4}>
              {plans.map((plan, index) => (
                <Col xs={{ span: 24 }} lg={{ span: 6 }} key={index}>
                  <div className="card">
                    <div className="card-body">
                      <Title level={2}>{plan[i18n.language === "en"? "titleEn" :"titleAr"]}</Title>
                      <p>{plan[i18n.language === "ar" ? "descriptionAr" : "descriptionEn"]}</p>
                      <Title level={3}>{plan.price} /- SAR</Title>
                      {/* <span className="duration">
                      {t(`subscription_plans.${plan.name}.subtitle`)}
                    </span> */}
                      <Button
                        className="sub-btn ant-btn-primary select-btn"
                        onClick={() => handleSubscribe(plan)}
                      >
                        {t("Subscribe")}
                      </Button>
                      {/* {currentPath === "/settings" ? (
                    <Link
                      to={`/subscription?plan_id=${plan.plan_code}`}
                      state={{ from: userType, planName: plan.name }}
                    >
                      <Button className="sub-btn ant-btn-primary select-btn">
                        Subscribe
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="sub-btn ant-btn-primary select-btn"
                      onClick={() => setShowModal(true)}
                    >
                      {t(`subscription_plans.${plan.name}.select`)}
                    </Button>
                  )} */}
                      {/* <p className="billed">
                      {t(`subscription_plans.${plan.name}.info`)}
                      {t(`subscription_plans.${plan.name}.discount`)}
                    </p> */}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}
        {selectedPlan && (
          <MoyasarPay
            userChosePlan={selectedPlan}
            backBtn={() => setSelectedPlan(null)}
          />
        )}
      </div>
      <UserAuthModal
        showModal={showModal}
        setShowModal={setShowModal}
        active={active}
        setActive={setActive}
      />
    </section>
  );
};

export default SubscriptionCards;
