import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Card, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { getPerformerData } from "../../../../../services/apis";
import { useDispatch } from "react-redux";
import { updateStock } from "../../../../../features/Stock/stockSlice";
import {
  fixValue,
  caretComponent,
  successOrDanger,
} from "../../../../../utils/ReuseableFunctions";
const MarketSmithStock = ({index}) => {
  const [performerData, setPerformerData] = useState();
  const [currentLanguage, setCurrentLanguage] = useState();
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);
  useEffect(() => {
    const abortController = new AbortController();
    const getPerformer = async () => {
      try {
        const result = await getPerformerData(i18n.language, 10,index);
        setPerformerData(result);
      } catch (err) {
        console.log(err);
      }
    };
    getPerformer();

    return () => {
      abortController.abort();
    };
  }, [i18n.language]);
  const faAngle = () => {
    return `fa-solid ${
      currentLanguage === "en" ? "fa-angle-right" : "fa-angle-left"
    }`;
  };
  const CompanyInformation = ({ data }) => {
    const {
      current_s_change,
      current_s_price,
      price_change_percentage,
      stock_code,
      stock_name,
      timestamp,
    } = data;

    return (
      <tr key={stock_code}>
        <th scope="row">
        <Link
            onClick={() => {dispatch(updateStock(stock_code))
              window.open(
                "/console",
                "window",
                "toolbar=no, menubar=no, resizable=yes"
              );
            }}
            to="#"
          >
            {stock_code}
          </Link></th>
        <th>  <Link
            onClick={() => {dispatch(updateStock(stock_code))
              window.open(
                "/console",
                "window",
                "toolbar=no, menubar=no, resizable=yes"
              );
            }}
            to="#"
          >{t(stock_name)}
          </Link></th>
        {/* <td>{timestamp}</td> */}
        <td>{fixValue(current_s_price)}</td>
        <td className={`${successOrDanger(current_s_change)}`}>
          {caretComponent(current_s_change)}
          &nbsp;
          {fixValue(current_s_change)}
        </td>
        <td className={`${successOrDanger(price_change_percentage)}`}>
          {caretComponent(price_change_percentage)}
          &nbsp;
          {fixValue(price_change_percentage)}
        </td>
        <td className="text-center">
          <Link
            onClick={() => dispatch(updateStock(stock_code))}
            to="#"
          >
            
            <i onClick={() => {
                window.open(
                  "/console",
                  "window",
                  "toolbar=no, menubar=no, resizable=yes"
                );
              }} className={faAngle()}></i>
          </Link>
        </td>
      </tr>
    );
  };

  return (
      <Col span={24}>
          <div className="max-height-table">
              <table className="table table-info">
                  <thead>
                      <tr>
                          <th scope="col">{`${t('comapany_ticker')}`}</th>

                          <th scope="col">{`${t('company_name')}`}</th>
                          {/* <th scope="col">{`${t("EPS_Due_Date")}`}</th> */}
                          <th scope="col">{`${t('Current_S_Price')}`}</th>
                          <th scope="col">{`${t('Current_S_Change')}`}</th>
                          <th scope="col">{`${t('Price_%_Change')}`}</th>
                          <th scope="col"></th>
                      </tr>
                  </thead>
                  <tbody>
                      {performerData ? (
                          performerData.map((data, index) => (
                              <CompanyInformation key={index} data={data} />
                          ))
                      ) : (
                          <Spin />
                      )}
                  </tbody>
              </table>
          </div>
      </Col>
  )
};

export default MarketSmithStock;