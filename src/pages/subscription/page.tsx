import React from "react";
import { useSearchParams } from "react-router-dom";

export default function Subscription() {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan_id");

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col font-cairo">
      <h1>Payment Details</h1>
      <h1>You selected uhh planId {planId}</h1>
    </div>
  );
}
