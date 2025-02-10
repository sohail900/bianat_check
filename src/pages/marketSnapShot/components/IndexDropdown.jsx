import React from "react";
import { Select } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const IndexDropdown = ({ setValue }) => {
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);
  const { t, i18n } = useTranslation();

  const options = [
    {
      key: "NOMU",
      value: "NOMU",
    },
    {
      key: "TASI",
      value: "TASI",
    },
  ];

  return (
    <Select
      className={`${currentTheme === "Dark" && "dark-skin"} ${
        i18n.language === "en" ? "font-loader-en" : "font-loader"
      } select-dropdown`}
      style={{ width: 130 }}
      size="small"
      defaultValue={options[1].value}
      onChange={(e) => {
        setValue(e);
      }}
      // placeholder={t(placeholder)}
    >
      {options.map((option) => {
        return (
          <Select.Option
            value={option.key}
            key={option.key}
            className={`${currentTheme === "Dark" && "dark-skin"}  ${
              i18n.language === "en" ? "font-loader-en" : "font-loader"
            }`}
          >
            {t(option.value)}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default IndexDropdown;
