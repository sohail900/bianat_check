import React from "react";
import { Link } from "react-router-dom";
import { Space } from "antd";
import { fixValue, caretComponent } from "../../../utils/ReuseableFunctions";
import { useDispatch } from "react-redux";
import { updateStock } from "../../../features/Stock/stockSlice";
const MarqueeComponent = ({ item, index, currentLanguage, t }) => {
  const {
    code: stock_code,
    name: stock_name,
    change: current_s_change,
    close: current_s_price,
    change_p: price_change_percentage,
  } = item;
  const dispatch = useDispatch();
  return (
    <li key={index}>
      <div className="stock-line">
        <Space direction="horizontal">
          {/* <h5>{stock_code}</h5> */}

          <span
          className="highlight-stock"
                      onClick={() => {dispatch(updateStock(stock_code))

              window.open(
                "/console",
                "window",
                "width=1600, height=1000",
                "toolbar=no, menubar=no, resizable=yes"
              )
            }
          }
          >
            <h5>
              {currentLanguage && currentLanguage === "en"
                ? t(stock_name)
                : t(stock_name)}
            </h5>
          </span>
        </Space>

        <span
          className={`num ${
            current_s_change > 0 ? "text-success" : "text-dangers"
          }`}
        >
          {fixValue(current_s_change)}
          &nbsp;
          {caretComponent(current_s_change)}
        </span>
        <span className="value text-blue">
          {current_s_price && current_s_price.toFixed(2)}
        </span>
        <span
          className={`num ${
            price_change_percentage > 0 ? "text-success" : "text-dangers"
          }`}
        >
          ({fixValue(price_change_percentage)}%)
        </span>
      </div>
    </li>
  );
};

export default MarqueeComponent;
