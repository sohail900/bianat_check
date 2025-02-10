import React from "react";
import BianatTable from "../../../components/BianatTable";
import { numFormatter } from "../../../utils/ReuseableFunctions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateStock } from "../../../features/Stock/stockSlice";
import { ScreenerContext } from "../Screener";
/**
 * @name TechnicalTable
 * @description This component is used to display the performers in the screener.
 * @purpose This component is used to display the performers in the screener.
 * @returns {JSX.Element} - The component.
 */

const TechnicalTable = () => {
  const dispatch = useDispatch();
  const columns = [
    {
      title: "Ticker",
      dataIndex: "code",
      key: "code",
      render: (text) => (
        <Link onClick={() => dispatch(updateStock(text))} to={`/dashboard`}>
          <strong>{text}</strong>
        </Link>
      ),
    },
    {
      title: "EMA30",
      dataIndex: "ema30",
      key: "ema30",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "EMA100",
      dataIndex: "ema100",
      key: "ema100",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "EMA200",
      dataIndex: "ema200",
      key: "ema200",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "SMA50",
      dataIndex: "sma50",
      key: "sma50",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "SMA100",
      dataIndex: "sma100",
      key: "sma100",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "SMA200",
      dataIndex: "sma200",
      key: "sma200",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "Week High 52",
      dataIndex: "weekHigh52",
      key: "WeekHigh52",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "Week Low 52",
      dataIndex: "weekLow52",
      key: "weekLow52",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
  ];
  return (
    <ScreenerContext.Consumer>
      {({ data }) => <BianatTable data={data} columns={columns} />}
    </ScreenerContext.Consumer>
  );
};

export default TechnicalTable;
