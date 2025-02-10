import cookies from "js-cookie";
import LanguagesConfig from "./LanguagesConfig";

const getCurrentLanguage = () => {
  const currentLanguageCode = cookies.get("i18next") || "ar";
  const currentLanguage = LanguagesConfig.find(
    (l) => l.code === currentLanguageCode
  );
  return currentLanguage;
};

export default getCurrentLanguage;
