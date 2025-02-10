import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@shared/ui/Button";
import Video from "../Components/Video";
import AnimatedText from "@shared/ui/AnimatedText";
import Navbar from "../Components/Navbar";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ROUTES } from "@shared/constants";
import Image from "@assets/insights.png";
import { twMerge } from "tailwind-merge";
import ImageSlider from "@shared/ui/ImageSliders";

const animation = {
  visible: ({ delay }: { delay: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.6,
      ease: [0.6, 0.01, -0.05, 0.95],
      delay,
    },
  }),
  hidden: { opacity: 0, y: 40 },
};

const ImageAnimation = {
  hidden: {
    y: 90,
    // rotateX: 30,
    opacity: 0,
  },
  visible: (i: number) => ({
    y: 0,
    // rotateX: 0,
    opacity: 1,
    transition: {
      duration: 1.6,
      ease: [0.6, 0.01, -0.05, 0.95],
      delay: i,
    },
  }),
};

type Image = {
  title: string;
  description: string;
  url: string;
};

const Images: Image[] = [
  {
    title: "Dashboard",
    description:
      "A comprehensive overview of the market and its climate, and indicators of stocks whose price is above the 50 & 200 SMA, which reflects positive or negative market env.",
    url: "/images/dashboard.png",
  },
  {
    title: "Market Pulse",
    description:
      "Measuring the historical market depth on a daily basis helps the trader know the positivity or negativity of the market",
    url: "/images/market-pulse.png",
  },
  {
    title: "Console",
    description:
      "Financial and technical data for each stock, with experts lists and the best stocks ranked according to relative strength",
    url: "/images/console.png",
  },
];

const Home = ({ onLangPress }: { onLangPress: () => void }) => {
  const [currentImage, setCurrentImage] = useState<Image>(Images[0]);
  const arrayOfImages = Images.map((image) => image.url);
  const { t, i18n } = useTranslation();

  return (
    <main className="w-full h-auto flex flex-col relative">
      <Navbar onLangPress={onLangPress} />
      <motion.div
        variants={ImageAnimation}
        initial="hidden"
        animate="visible"
        className="w-full md:h-[40rem] h-[20rem] flex justify-center items-center"
      >
        <ImageSlider
          urls={arrayOfImages}
          onChanges={(activeIndex) => setCurrentImage(Images[activeIndex])}
        />
      </motion.div>
      <div className="flex items-center space-y-5 flex-col w-full mt-5">
        <AnimatedText
          delay={10}
          className="md:text-4xl text-2xl md:leading-[3rem]"
        >
          {t(currentImage.title).toString()}
        </AnimatedText>

        <AnimatedText
          delay={15}
          className="text-black md:w-1/2 w-full md:text-sm text-xs mx-auto"
        >
          {t(currentImage.description).toString()}
        </AnimatedText>

        <motion.div
          variants={animation}
          initial="hidden"
          animate="visible"
          custom={{ delay: 1 }}
          className="w-full"
        >
          <Link to={ROUTES.signUp}>
            <Button className="md:w-1/3 w-full">
              <div
                className={twMerge(
                  "flex items-center justify-center",
                  `${i18n.language === "en" && "flex-row-reverse"}`
                )}
              >
                {t("Get Started").toString()}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                  />
                </svg>
              </div>
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
};

export default Home;
