import React, { useEffect } from "react";
import { Layout } from "antd";
import { useTranslation } from "react-i18next";
import {useSelector} from "react-redux"
import getCurrentLanguage from "../utils/CurrentLanguage";

const { Footer } = Layout;

/**
 * @name: BianatFooter
 * @description: Get current language from cookie
 * @param {type}
 * @return: current language
 */
const BianatFooter = () => {
  const currentLanguage = getCurrentLanguage();
  const {currentTheme} = useSelector((state)=>state.currentTheme)

  const { t, i18n } = useTranslation();
  return ( 
     <Footer
      className={`${i18n.language === "en" ? "font-loader-en" : "font-loader"} ${currentTheme==="Dark" && "dark-skin"}`}
    >
      <p>{`${t("Copyright")} © 2021-2022 BIANAT.sa ${t(
        "All_Rights_Reserved"
      )}.`}</p>
    </Footer> 
   
  );
};

export default BianatFooter;
