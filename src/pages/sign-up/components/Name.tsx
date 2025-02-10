import { FadeInFromDown, cn } from "@shared/lib/utils";
import TextBox from "@shared/ui/TextBox";
import Button from "@shared/ui/Button";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  defaultValue: string;
  onFinish: (name: string) => void;
}

const Name = ({ onFinish, defaultValue }: Props) => {
  const [name, setName] = useState(defaultValue);
  const { t, i18n } = useTranslation();

  return (
    <motion.form
      onSubmit={(e) => {
        e.preventDefault();
        onFinish(name);
      }}
      variants={FadeInFromDown}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      custom={{ delay: 0, y: 50 }}
      className="space-y-5"
    >
      <h1 className="text-3xl">{t("Full Name").toString()}</h1>
      <TextBox
        autoFocus
        className="w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("Full Name").toString()}
      />

      <Button type="submit" disabled={name.length <= 0} className="w-full">
        {t("Next").toString()}
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
    </motion.form>
  );
};
export default Name;
