import React, { useEffect, useState } from "react";
import { Divider, Button } from "antd";
import secured from "../../assets/secured.png";
import { dbChatBot } from "../../utils/firebase/config"; // Adjust path as needed
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const ThankYou = () => {
  const [loading , setLoading] = useState(true)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const status = urlParams.get("status");

    if (id && status) {
      updatePaymentStatus(id, status);
    }
  }, []);

  const updatePaymentStatus = async (id, status) => {
    console.log(id, status);
    try {
      const docRef = collection(dbChatBot, "payments");
      const q = query(docRef, where("payment.id", "==", id)); // Query for document where payment.id matches

      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => {
        return doc.data();
      });
      const paymentObj = data[0];
      /// i want you to do here that update paymentObj.payment.status to status from parameter , and then save the document (dont create new just save with existing id)

      if (paymentObj) {
        if (paymentObj.payment.status) paymentObj.payment.status = status;
        if (paymentObj.payment.paymentStatus)
          paymentObj.payment.paymentStatus = status;

        console.log(paymentObj);

        await updateDoc(querySnapshot.docs[0].ref, {
          payment: paymentObj.payment,
        });
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
    setLoading(false)
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col max-w-[750px] mx-auto">
      <img src={secured} className="h-64" alt="secured" />
      <h1 className="font-semibold uppercase text-6xl mb-4">Thank You!</h1>
      <p>
        <strong>Subscription Completed!</strong>
      </p>
      <Divider />
      <Button
        onClick={() => {
          window.location.href = "/";
        }}
        type="primary"
        shape="round"
        size="large"
        disabled={loading}
      >
        {loading?"Loading...":"Continue to Dashboard"}
      </Button>
    </div>
  );
};

export default ThankYou;
