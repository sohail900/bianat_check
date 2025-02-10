import React from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import BianatTable from "../../../components/BianatTable";
import { numFormatter } from "../../../utils/ReuseableFunctions";
import { updateStock } from "../../../features/Stock/stockSlice";
import { ScreenerContext } from "../Screener";

/**
 * @name FinancialTable
 * @description This component is used to display the performers in the screener.
 * @purpose This component is used to display the performers in the screener.
 * @returns {JSX.Element} - The component.
 */
const FinancialTable = () => {
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
      title: "Enter Price Value Ebitda",
      dataIndex: "enterpriseValueEbitda",
      key: "enterpriseValueEbitda",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "Shares Float",
      dataIndex: "sharesFloat",
      key: "sharesFloat",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "Market Capitalization",
      dataIndex: "marketCapitalization",
      key: "marketCapitalization",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "Market Capitalization Mln",
      dataIndex: "marketCapitalizationMln",
      key: "marketCapitalizationMln",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "Operating Margin TTM",
      dataIndex: "operatingMarginTTM",
      key: "operatingMarginTTM",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "Price Book MRQ",
      dataIndex: "priceBookMRQ",
      key: "priceBookMRQ",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
  ];
  return (
    <ScreenerContext.Consumer>
      {({ data }) => <BianatTable data={data} columns={columns} />}
    </ScreenerContext.Consumer>
  );
};

export default FinancialTable;
