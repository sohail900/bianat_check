import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { store } from "../app/Store";

i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    react: {
      useSuspense: false,
    },
    supportedLngs: ["ar", "en"],
    fallbackLng: "en",
    lng: localStorage.getItem("currentLanguage") || "ar",

    debug: false,
    detection: {
      order: ["path", "cookie", "htmlTag"],
      caches: ["cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
    backend: { loadPath: "/assets/locales/{{lng}}/translation.json" },
  });

export default i18next;
