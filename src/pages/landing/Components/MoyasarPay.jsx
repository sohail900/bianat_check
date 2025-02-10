import React, { useEffect } from "react";
import { dbChatBot } from "../../../utils/firebase/config";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
const MoyasarPay = ({ userChosePlan , backBtn }) => {
  const {t , i18n} = useTranslation()
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("HEREEEE" , auth.user.id);
    let userId = auth.user.id;
    // const user = localStorage.getItem("new_sub");
    // if (user) {
    //   const parsedUser = JSON.parse(user);
    //   userId = parsedUser.username;
    // }
    if (userChosePlan && userId) {
      console.log(userChosePlan, userId);
      Moyasar.init({
        element: ".mysr-form",
        amount: userChosePlan.price * 100,
        currency: "SAR",
        description: `${userChosePlan.titleEn} subscription bought.`,
        publishable_api_key: process.env.REACT_APP_MOYASSAR_PK,
        callback_url: "https://bianat.sa/thanks",
        methods: ["creditcard"],
        on_completed: async function (payment) {
          let nPayment = { ...payment };
          console.log(nPayment);
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + userChosePlan.duration);
          const paymentDocRef = doc(collection(dbChatBot, "payments"));

          const paymentData = {
            id: paymentDocRef.id,
            payment: nPayment,
            expiryDate,
            paymentDate: new Date(),
            userId,
            subscriptionPlan: userChosePlan,
          };

          console.log(paymentData);

          await setDoc(paymentDocRef, paymentData);

          console.log("New payment document created with ID:", paymentDocRef.id);

          // // Assuming `userDocRef` is the reference to the user document
          const userDocRef = doc(collection(dbChatBot, "users"), userId);

          // Define the fields you want to update in the user document
          const updatedUserData = {
            subscription: "paid",
            subscriptionPlanId: userChosePlan.id,
            paymentId: paymentDocRef.id,
            expiryDate,
          };

          // Update the document with the specified fields
          await updateDoc(userDocRef, updatedUserData);

          console.log("User document updated successfully!");
        },
      });
    }
  }, []);

  return (
    <>
    <button onClick={backBtn}> { i18n.language === "en" ? "⬅️" : "➡️"} Back</button>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mysr-form"
      ></motion.div>
    </>
  );
};

export default MoyasarPay;
