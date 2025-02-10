import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { updateStock } from "../../../features/Stock/stockSlice";
/**
 * @name PerformerTable
 * @description This component is used to display the performers in the screener.
 * @param {Object} props - The props passed to the component.
 * @returns {JSX.Element} - The component.
 */
import {
  fixValue,
  caretComponent,
  successOrDanger,
} from "../../../utils/ReuseableFunctions";
import { ScreenerContext } from "../Screener";
import BianatTable from "../../../components/BianatTable";

const PerformerTable = () => {
  const { t } = useTranslation();
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{t(text)}</strong>,
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Last",
      dataIndex: "close",
      key: "close",
      render: (text) => <span className="text-blue">{fixValue(text)}</span>,
    },
    {
      title: "CHG%",
      dataIndex: "change_p",
      key: "change_p",
      render: (text) => (
        <span className={`${successOrDanger(text)}`}>
          {caretComponent(text)}
          &nbsp;
          {fixValue(text)}
        </span>
      ),
    },
    {
      title: "CHG",
      dataIndex: "change",
      key: "change",
      render: (text) => (
        <span className={`${successOrDanger(text)}`}>
          {caretComponent(text)}
          &nbsp;
          {fixValue(text)}
        </span>
      ),
    },
    //,
    // {
    //   title: "Technical Rating",
    //   dataIndex: "technicalrating",
    //   key: "technicalrating",
    // },
  ];

  return (
    <ScreenerContext.Consumer>
      {({ data }) => <BianatTable data={data} columns={columns} />}
    </ScreenerContext.Consumer>
  );
};

export default PerformerTable;
