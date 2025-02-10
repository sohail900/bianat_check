import Modal from "@shared/ui/Modal";
import React from "react";
import { useDispatch } from "react-redux";
import cookies from "js-cookie";
import { changeLanguage } from "../../../features/Language/languageSlice";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const Languages = [
  {
    name: "English",
    flag: "🇺🇸",
    code: "en",
  },
  {
    name: "Arabic",
    flag: "🇸🇦",
    code: "ar",
  },
];

interface LanguageModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const LanguageModal = ({ isOpen, closeModal }: LanguageModalProps) => {
  const ltr = document.body.dir === "ltr";

  // const { currentLanguage } = i18next;

  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();

  const handleLanguageChange = (code: string) => {
    console.log(code)
    if (i18n.language === code) return closeModal();

    cookies.set("i18next", code);
    dispatch(changeLanguage(code));
    i18next.changeLanguage(code);
    window.location.reload();
  };
  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      children={
        <div className="space-y-2">
          {Languages.map((lang, index) => (
            <div
              onClick={() => handleLanguageChange(lang.code)}
              className={`hover:bg-blue-100 transition-all cursor-pointer rounded-md p-2 flex`}
              key={index}
            >
              <h1 className={`text-lg ${ltr ? "mr-2" : "ml-2"}`}>
                {lang.flag}
              </h1>
              <h1 className="text-lg">{t(lang.name).toString()}</h1>
            </div>
          ))}
        </div>
      }
    />
  );
};

export default LanguageModal;
