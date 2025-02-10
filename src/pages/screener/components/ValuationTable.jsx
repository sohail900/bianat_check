import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import BianatTable from "../../../components/BianatTable";
import { numFormatter } from "../../../utils/ReuseableFunctions";
import { updateStock } from "../../../features/Stock/stockSlice";
import { ScreenerContext } from "../Screener";

/**
 * @name TechnicalTable
 * @description This component is used to display the performers in the screener.
 * @purpose This component is used to display the performers in the screener.
 * @returns {JSX.Element} - The component.
 */

const ValuationTable = () => {
  const { data: kuzzleData } = useContext(ScreenerContext);
  const dispatch = useDispatch();
  const newData = [];
  const keys = new Set();

  kuzzleData.forEach((element) => {
    if (element.quarterlyIncomeStatement) {
      newData.push(
        element.quarterlyIncomeStatement
          .slice(0, 6)
          .reduce((previousValue, currentValue) => {
            keys.add(currentValue.date);
            previousValue.code = element.code;
            previousValue[currentValue.date] = currentValue.sales;
            return previousValue;
          }, {})
      );
    }
  });

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
      title: "2021-03-31",
      dataIndex: "2021-03-31",
      key: "2021-03-31",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "2021-06-30",
      dataIndex: "2021-06-30",
      key: "2021-06-30",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "2021-09-30",
      dataIndex: "2021-09-30",
      key: "2021-09-30",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "2020-06-30",
      dataIndex: "2020-06-30",
      key: "2020-06-30",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "2020-09-30",
      dataIndex: "2020-09-30",
      key: "2020-09-30",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
    {
      title: "2020-12-31",
      dataIndex: "2020-12-31",
      key: "2020-12-31",
      render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
    },
  ];

  return <BianatTable data={newData} columns={columns} />;
};

export default ValuationTable;
