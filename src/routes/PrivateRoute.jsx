import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { dbChatBot } from "../utils/firebase/config";

const PrivateRoute = ({ Component }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true); // Added loading state
  const loc = useLocation();

  const checkFirebaseSubscription = async (responseData) => {
    const { paymentId, id } = responseData;

    if (!paymentId) {
      return { subscribed: false, username: id };
    }

    try {
      const docRef = doc(dbChatBot, "payments", paymentId); // Get the document directly using paymentId
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const paymentData = docSnapshot.data();

        if (
          (paymentData.payment.status &&
            paymentData.payment.status !== "paid") ||
          (paymentData.payment.paymentStatus &&
            paymentData.payment.paymentStatus !== "paid")
        )
          return { subscribed: false, username: id };

        // Process the expiry date
        let expiryDate;
        if (paymentData.expiryDate instanceof Timestamp) {
          expiryDate = paymentData.expiryDate.toDate();
        } else if (
          typeof paymentData.expiryDate === "object" &&
          paymentData.expiryDate.seconds
        ) {
          expiryDate = new Date(paymentData.expiryDate.seconds * 1000);
        } else {
          console.error("Invalid expiryDate format");
          return { subscribed: false, username: id };
        }

        const currentDate = new Date();

        // Check if the subscription is expired
        if (currentDate > expiryDate) {
          console.log("Subscription expired");
          return { subscribed: false, username: id };
        } else {
          console.log("Subscription is active");
          return {
            subscribed: true,
            username: id,
            subscriptionData: paymentData,
            expiryDate,
          };
        }
      } else {
        console.log("No payment data found");
        return { subscribed: false, username: id };
      }
    } catch (error) {
      console.error("Error checking subscription: ", error);
      return { subscribed: false, username: id };
    }
  };

  const browserPathName = window.location.pathname;

  useEffect(() => {
    async function fetch() {
      let userId = auth?.user?.id;
      let paymentId = auth?.user?.paymentId || null;
      let subscriptionStatus = auth?.user?.subscription;
      if (subscriptionStatus && subscriptionStatus === "paid") {
        const subscription = await checkFirebaseSubscription({
          id: userId,
          paymentId,
        });
        if (subscription) {
          console.log(subscription);
          if (!subscription.subscribed) {
            console.log("HERE AND NOT SUBSCRIBED");
            navigate("/settings");
          }
          localStorage.setItem(
            "new_sub",
            JSON.stringify({
              subscribed: subscription.subscribed,
              username: subscription.username,
              expiryDate: subscription.expiryDate ?? "",
              packageName:
                subscription?.subscriptionData?.subscriptionPlan?.titleEn ?? "",
            })
          );
        }
      } else {
        console.log("Subscription is free so skipping the subscription check.");
        localStorage.setItem(
          "new_sub",
          JSON.stringify({
            subscribed: false,
            username: userId,
            expiryDate: "",
            packageName: "",
          })
        );
        if (!auth.isAuth) return;
        navigate("/settings");
      }

      setLoading(false); // Set loading to false once the subscription check is complete
    }
    fetch();
  }, [browserPathName]);

  useEffect(() => {}, []);

  // Check if the user is authenticated
  if (!auth.isAuth) {
    return <Navigate to="/" replace={true} />;
  }

  // Show loading spinner while checking subscription
  if (loading) {
    return (
      <Spin
        size="large"
        style={{ justifyContent: "center", marginTop: "25%", display: "flex" }}
      />
    );
  }

  return <Component />;
};

export default React.memo(PrivateRoute);
