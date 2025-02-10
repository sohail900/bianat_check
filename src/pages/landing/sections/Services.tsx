import React from "react";
import { motion, useInView } from "framer-motion";
import { FadeInFromDown } from "@shared/lib/utils";
import { useTranslation } from "react-i18next";

type Service = {
  title: string;
  description: string;
};

type Services = Service[];

const services: Services = [
  {
    title: "DIVE DEEPER",
    description: "Expand_your_research_by_one_click",
  },
  {
    title: "Bianat Market Screen Research",
    description: "Bianat_Market_Screen_Research_is_where",
  },

  {
    title: "Chart Your Destination",
    description: "The_keystone_of_Bianat_Platform_offers",
  },
];

const Services = () => {
  const { t } = useTranslation();
  return (
    <div
      id="services"
      className="w-full mt-24 flex justify-center items-center flex-col"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-y-4 md:gap-4 md:w-2/3">
        {services.map((service, index) => (
          <motion.div
            variants={FadeInFromDown}
            initial="hidden"
            whileInView="visible"
            custom={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            key={index}
            className={`p-5 md:py-12 text-center bg-white rounded-2xl relative shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] ${
              index === 2 ? "md:col-span-2" : ""
            }`}
          >
            <div
              className={`bg-blue-600 bg-opacity-5 w-32 h-32 blur-lg absolute ${
                index % 2 === 1 ? "-left-5" : "right-0"
              } top-0`}
            />
            <h1 className="mb-1">{t(service.title).toString()}</h1>
            <p>{t(service.description).toString()}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Services;
