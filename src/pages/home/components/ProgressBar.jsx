import React, { useContext, useEffect, useState } from "react";
import { Progress, Space } from "antd";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import authApi from "./../../../services/authApi";
import { updateScreener,updateScreenerName} from "../../../features/Screener/screenerSlice";
const ProgressBar = ({ label1, label2, stockName, sma, middleLabel, specificStock }) => {
  const [advancing, setAdvancing] = useState(0);
  const [declining, setDeclining] = useState(0);
  const [unchanged, setUnchanged] = useState(0);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const getSMAUpsAndDowns = async (sma, stockName) => {
    try {
      const response = await authApi.get(
        `/fundamentals/sma-above-below-close/${sma}/${stockName}`
      );

      if (response.status === 200) {
        setAdvancing(response.data.above);
        setDeclining(response.data.below);
        setTotal(
            response.data.above + response.data.below + response.data.unchanged
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTasiUpsAndDowns = async (stockName) => {
    try {
      const response = await authApi.get(
        `fundamentals/ups-and-downs/${stockName}`
      );
      if (response.status === 200) {
        setAdvancing(response.data.up);
        setDeclining(response.data.down);
        setTotal(response.data.total);
        setUnchanged(response.data.unchanged);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStockHighAndLow = async (stockName) => {
    try {
      const response = await authApi.get(
        `/fundamentals/new-high-and-new-low/${stockName}`
      );
      if (response.status === 200) {
        setAdvancing(response.data.high_count);
        setDeclining(response.data.low_count);
        setTotal(

            response.data.high_count +
              response.data.low_count +
              response.data.unchanged
          
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
   
    if (
      stockName != undefined &&
      sma == undefined &&
      !(specificStock.includes("high") ||specificStock.includes("low"))
    ) {
      getTasiUpsAndDowns(stockName);
    } else if (specificStock.includes("high") && specificStock.includes("low")) {
      if (stockName.includes("TASI")) {
        getStockHighAndLow("TASI");
      } else if (stockName.includes("NOMU")) {
        getStockHighAndLow("NOMU");
      }
    } else {
      getSMAUpsAndDowns(sma, stockName);
    }
  }, [stockName, sma,specificStock]);

  const calculateAdvancingPercentage = () => {
    let result = parseInt((advancing / total) * 100);

    return isNaN(result) ? 0 : result;
  };

  const calculateDecliningPercentage = () => {
    let result = parseInt((declining / (advancing + declining)) * 100);
    return isNaN(result) ? 0 : result;
  };

  const calculateSuccessPercentage = () => {
    let result = (advancing / total) * 100;
    return isNaN(result) ? 0 : result;
  };

  const calculatePercentage = (a, b) => {
    let result = parseInt((a / (a + b)) * 100);
    return isNaN(result) ? 0 : result;
  };

  const calculatePercentageForTopProgress = () => {
    let result =
      ((advancing + (total - (advancing + declining))) / total) * 100;
    return isNaN(result) ? 0 : result;
  };


  const changeScreener = (label,stock) => {
    if(label.includes("sma"))
      return
    let item;
    let screenerName =`${label} ${stock}`;

    switch (label) {
  
      case "Advancing":
      case "Declining":
        item=`${label.toLowerCase()}-${stock}`;
        break;
      case "same":
        item = `no_change-${stock}`;
        break;
      case "New High":
        item = `new_high-${stock}`;
        break;
      case "New Low":
        item = `new_low-${stock}`;
        break;
      case "Above":
      case "Below":
        if(middleLabel.includes("50sma")){
          item = `${label.toLowerCase()}_50sma-${stock}`;
         screenerName =`${label} 50sma ${stock}`;
        }
        else if(middleLabel.includes("200sma")){
          item = `${label.toLowerCase()}_200sma-${stock}`;
          screenerName =`${label} 200sma ${stock}`;
        }
        break;
      default:
        break;
    }
dispatch(updateScreenerName(screenerName));
window.open(
  `/console?action=${item}`,
  "window",
  "toolbar=no, menubar=no, resizable=yes"
);

  }


  return (
    <div className="progress-bar" style={{ direction: "ltr" }}>
      <Space>
        <span className="highlight-stock" onClick={()=>{changeScreener(label1,stockName)}}>{`${advancing ? `${advancing}` : 0} ${t(label1)}`}</span>
        <span className="highlight-stock" onClick={()=>{changeScreener(middleLabel,stockName)}}>
          {middleLabel && label1.includes("Advancing")
            ? `${unchanged} ${t("same")}`
            : middleLabel
            ? t(middleLabel)
            : ""}
        </span>
        <span className="highlight-stock" onClick={()=>{changeScreener(label2,stockName)}}>{`${declining ? `${declining}` : 0} ${t(label2)}`}</span>
      </Space>
      <Space>
        <span className="advancing">
          {label1 === "Advancing"
            ? calculateAdvancingPercentage()
            : calculatePercentage(advancing, declining)}
          %
        </span>
        <span className="declining">
          {label1 === "Advancing"
            ? calculateDecliningPercentage()
            : calculatePercentage(declining, advancing)}
          %
        </span>
      </Space>
      {label1 === "Advancing" ? (
        <Progress
          className="pg-bar"
          percent={calculatePercentageForTopProgress()}
          success={{
            percent: calculateSuccessPercentage(),
            strokeColor: "#16AE63",
          }}
          strokeColor="grey"
          trailColor="#ef5350" //red
          height={10}
          showInfo={false}
        />
      ) : (
        <Progress
          strokeColor={{
            "0%": "#108ee9",
            "100%": "red",
          }}
          height={10}
          percent={100}
          success={{
            percent: calculatePercentage(advancing, declining),
          }}
          showInfo={false}
        />
      )}
    </div>
  );
};

export default ProgressBar;
