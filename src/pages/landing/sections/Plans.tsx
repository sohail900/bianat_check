import React, { useEffect, useState } from "react";
import authApi from "../../../services/authApi";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FadeInFromDown } from "@shared/lib/utils";
import AnimatedText from "@shared/ui/AnimatedText";
import { cn } from "@shared/lib/utils";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { dbChatBot } from "../../../utils/firebase/config";

type Plan = {
  plan_code: number;
  name: string;
  description: string;
  recurring_price: number;
};

type Plans = Plan[];

const Plans = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<any>([]);
  const { t, i18n } = useTranslation();

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
      console.log(err)
    }
  };
  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div id="plans" className="w-full flex flex-col items-center">
      <AnimatedText delay={0.6} className="text-3xl">
        <>
          {t("CHOOSE YOUR BIANAT PLAN")
            .split(" ")
            .map((word, index) => (
              <span
                key={index}
                className={`inline-block mx-1 ${index == 1 && "text-blue-600"}`}
              >
                {word}
              </span>
            ))}
        </>
      </AnimatedText>
      <AnimatedText delay={0.8} className="mt-5 text-black text-opacity-80">
        {t("Cancel Any Time").toString()}
      </AnimatedText>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4">
        {plans.map((plan:any, index:any) => (
          <motion.div
            variants={FadeInFromDown}
            initial="hidden"
            whileInView="visible"
            custom={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            key={index}
            className={cn(
              "text-center bg-blue-600 relative m-2 p-2 rounded-md flex flex-col justify-between text-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]",
              {
                ["outline-dashed outline-blue-600 shadow-xl shadow-blue-600 z-10"]:
                  plan.titleEn === "ANNUAL",
              }
            )}
          >
            {plan.titleEn == "ANNUAL" && (
              <h1 className="absolute -left-8 bg-red-500 p-2 rounded-md z-10 text-white top-0 -rotate-45">
                {t("Best Value").toString()}
              </h1>
            )}
            <h1 className="text-lg text-white mb-4 min-w-fit">
              {i18n.language === "en"? plan.titleEn: plan.titleAr }
            </h1>

            <p className="">
            {i18n.language === "en"? plan.descriptionEn: plan.descriptionAr }
            </p>
            {/* <div className="mt-2 text-white/70">
              <p>{t(`subscription_plans.${plan.name}.discount`).toString()}</p>
              <p>{t(`subscription_plans.${plan.name}.subtitle`).toString()}</p>
            </div> */}
            <button
              onClick={() => navigate(`/sign-up?planId=${plan.plan_code}`)}
              className="text-blue-600 w-full rounded-md py-2 mt-4 bg-white active:scale-95 transition-all duration-150 ease-in-out"
            >
              {t("Subscribe").toString()} - {plan.price}{" "}
              {t("Sr").toString()}
            </button>
            {/* {t(`subscription_plans.${plan.plan_code}.info`) && (
              <div className="mt-2">
                {t(`subscription_plans.${plan.name}.info`).toString()}
              </div>
            )} */}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
