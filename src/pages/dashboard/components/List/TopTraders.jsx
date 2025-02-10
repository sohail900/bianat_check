import React from "react";
import { useTranslation } from "react-i18next";
import { List } from "antd";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  updateScreener,
  updateScreenerName,
} from "../../../../features/Screener/screenerSlice";
import topTraders from "../../../../assets/topTraders.json";

const TopTraders = ({ setTrader }) => {
  const { t, i18n } = useTranslation();
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);
  const dispatch = useDispatch();
  const actionName = (action) => {
    return i18n.language === "en" ? action.nameen : action.namear;
  };

  const updateListAction = (action) => {
    setTrader(action.key);
    dispatch(updateScreener(action));
    dispatch(updateScreenerName(actionName(action)));
  };

  return (
    <div
      className={`action-list ${
        i18n.language === "en" ? "font-loader-en" : "font-loader"
      } ${currentTheme === "Dark" && "dark-skin"}`}
    >
      <h3>{t("dashboard.guru_list.title")}</h3>
      <div className="list">
        <List
          dataSource={topTraders.data}
          renderItem={(item) => (
            <List.Item
              onClick={() => {
                updateListAction(item);
              }}
            >
              {actionName(item)}
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default TopTraders;
