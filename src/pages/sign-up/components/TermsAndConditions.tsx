import { FadeInFromDown, cn } from "@shared/lib/utils";
import Button from "@shared/ui/Button";
import { motion } from "framer-motion";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Props {
  defaultValue: boolean;
  onFinish: () => void;
}

const TermsAndConditions = ({ onFinish, defaultValue }: Props) => {
  const { t, i18n } = useTranslation();

  const [checked, setChecked] = useState(defaultValue);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const enterFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Enter") {
      if (ref.current?.checked) {
        onFinish();
      } else {
        setError(true);
      }
    }
  }, []);

  const onButtonPress = () => {
    if (ref.current?.checked) {
      onFinish();
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", enterFunction, false);

    return () => {
      document.removeEventListener("keydown", enterFunction, false);
    };
  }, []);

  return (
    <motion.div
      variants={FadeInFromDown}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      custom={{ delay: 0, y: 50 }}
      className="space-y-5"
    >
      <h1 className="text-4xl">{t("Hey").toString()} 👋</h1>
      <h2 className="text-2xl ">{t("Welcome to Bianat").toString()}</h2>
      <p className="text-black/60">
        {t(
          "Let's get to know you in order to be able to make the right decision"
        ).toString()}
      </p>
      <div className="flex items-center">
        <input
          checked={checked}
          ref={ref}
          onChange={() => {
            setError(false);
            setChecked(!checked);
          }}
          type="checkbox"
          className={cn("w-4 h-4 ml-2", {
            ["ml-2"]: i18n.language === "ar",
            ["mr-2"]: i18n.language === "en",
          })}
        />
        <div>
          <span className={error ? "text-red-500" : ""}>
            {t("I agree with")}
          </span>
          <span className="text-blue-600">
            <Link to="/acceptable"> {t("Usage policy")}</Link>
          </span>
          <span> {t("And").toString()}</span>
          <span className="text-blue-600">
            <Link to="/privacy"> {t("Privacy Policy")}</Link>
          </span>
        </div>
      </div>
      <Button disabled={!checked} onClick={onButtonPress} className="w-full">
        {t("Let's go").toString()}
      </Button>
      <div className="items-center w-full justify-center hidden md:flex text-black/40">
        <p className={i18n.language === "en" ? "text-xs mr-2" : "text-xs ml-5"}>
          {t("Or_Press_Enter").toString()}
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn("h-5 w-5", {
            ["rotate-180"]: i18n.language === "ar",
            ["-rotate-180 -scale-x-[1]"]: i18n.language === "en",
          })}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 9h8a5 5 0 1 1 5 5v7" />
          <path d="M7 5l-4 4l4 4" />
        </svg>
      </div>
    </motion.div>
  );
};

export default TermsAndConditions;
