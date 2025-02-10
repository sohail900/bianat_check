import React from "react";
import { Select } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const BottomPanelDropDown = ({ setValue, placeholder,options}) => {
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);
  const { t, i18n } = useTranslation();

 

  return (
    <Select
      className={`${currentTheme === "Dark" && "dark-skin"} ${
        i18n.language === "en" ? "font-loader-en" : "font-loader"
      }`}
      style={{ width: 130 }}
      size="small"
      onChange={(e) => {
        setValue(e);
      }}
      placeholder={t(placeholder)}
    >
      {options.map((option) => {
        option.key
        return (
          <Select.Option
            value={option.key}
            key={option.key}
            className={`${currentTheme === "Dark" && "dark-skin"}  ${
              i18n.language === "en" ? "font-loader-en" : "font-loader"
            }`}
          >
            {t(`dashboard.${option.value}`)}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default BottomPanelDropDown;
