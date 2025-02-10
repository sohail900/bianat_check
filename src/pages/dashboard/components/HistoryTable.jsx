import React, { useEffect, useState, useContext } from "react";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  getYearlyData,
  getHistoryDataForFundamentals,
  getYearlyEPSRating,
} from "../../../services/apis";
import authApi from "./../../../services/authApi";
import { fixValue } from "./../../../utils/ReuseableFunctions";
import SubscriptionGaurd from "../../../hoc/SubscriptionGaurd";
import {
  quarterDiff,
  successOrDanger,
} from "../../../utils/ReuseableFunctions";

/**
 * @name HistoryTable
 * @description History table component for dashboard
 * @purpose To display history table data
 * @param {interval} interval - interval of data to be fetched
 * @returns {JSX} JSX elements
 */

const HistoryTable = ({ interval }) => {
  const [historyData, setHistoryData] = useState(undefined);
  const { subscriptionDetails } = useSelector((state) => state.auth);
  const currentStock = useSelector((state) => state.currentStock.currentStock);
  const [yearlyData, setYearlyData] = useState();
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const [EPSRating, setEPSRating] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHistoryDataForFundamentals(currentStock);
        setHistoryData(data);
      } catch (error) {
        setHistoryData(undefined);
      }
    };

    fetchData();
  }, [currentStock]);

  const handleEpsRating = (year) => {
    if (EPSRating && EPSRating[year] !== undefined) {
      return fixValue(EPSRating[year]);
    }
    return "N/A";
  };

  useEffect(() => {
    const fetchYearlyEPSRating = async () => {
      try {
        const data = await getYearlyEPSRating(currentStock);
        setEPSRating(data.epsRating);
      } catch (err) {
        console.log(err);
      }
    };

    fetchYearlyEPSRating();
  }, [currentStock]);

  useEffect(() => {
    const getYearlyStockData = async () => {
      try {
        const result = await getYearlyData(currentStock);
        const yearlyData = result.reduce((accu, curr) => {
          accu[curr.year] = curr;
          return accu;
        }, {});

        const years = new Set([
          ...Object.keys(yearlyData),
          ...Object.keys(EPSRating),
        ]);

        const finalData = [...years]
          .map((year) => {
            return {
              eps: EPSRating[year] || "N/A",
              year: year,
              high: yearlyData[year]?.high || 0,
              low: yearlyData[year]?.low || 0,
            };
          })
          .sort((a, b) => {
            return a.year - b.year;
          });
        setYearlyData(finalData);
      } catch (err) {
        console.log(err);
      }
    };

    getYearlyStockData();
  }, [EPSRating]);

  const { t, i18n } = useTranslation();

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };
  const handleYOFYChange = (year)=>{
    let currentYear = handleEpsRating(year);
    let previousYear = handleEpsRating(year-1);
    if(currentYear === "N/A")
      currentYear = 0;
    if(previousYear === "N/A")
      previousYear = 0; 

    if(currentYear === 0 || previousYear === 0)
      return quarterDiff(0, 0);
    return parseInt(quarterDiff( previousYear,currentYear));

  }

  return (
      <>
          <div
              className={`history-detail-table floating-legends ${
                  i18n.language === 'en' ? 'font-loader-en' : 'font-loader'
              }`}
              id="historical"
          >
              <table className="table chart-table">
                  <thead>
                      <tr>
                          <th className="br-1 text-center">{`${t('Year')}`}</th>
                          <th className="br-1 text-center"> {t('EPS SR')}</th>
                          <th colSpan="2" className="text-center">
                              {`${t('Price')} (${t('Sr')})`}
                          </th>
                      </tr>
                      <tr>
                          <th className="br-1 text-center">{t('Dec')}</th>
                          <th className="text-center">{`${t('% YoY')}`}</th>
                          <th className="br-1 text-center">{`(${t('Sr')})`}</th>
                          <th>{`${t('High')}`}</th>
                          <th
                              className={`${
                                  i18n.language === 'en'
                                      ? 'text-end'
                                      : 'text-start'
                              }`}
                          >{`${t('Low')}`}</th>
                      </tr>
                  </thead>
                  {
                      <SubscriptionGaurd
                          id="leftblur"
                          page="dashboard"
                          specific_width="191%"
                      >
                          <tbody>
                              {yearlyData &&
                                  yearlyData.map((item, index) => {
                                      if (
                                          index === yearlyData.length - 1 ||
                                          index === yearlyData.length - 2
                                      )
                                          return
                                      return (
                                          <tr key={`${index}-history`}>
                                              <td>{item.year}</td>
                                              <td
                                                  className={`text-center ${successOrDanger(
                                                      handleYOFYChange(
                                                          item?.year
                                                      )
                                                  )}`}
                                              >
                                                  {handleYOFYChange(
                                                      item?.year
                                                  ) === 'NaN'
                                                      ? 'N/A'
                                                      : handleYOFYChange(
                                                            item?.year
                                                        ) + ' %'}
                                              </td>
                                              <td className="text-center">
                                                  {handleEpsRating(item.year)}
                                              </td>
                                              <td>{parseInt(item.high)}</td>
                                              <td
                                                  className={`${
                                                      i18n.language === 'en'
                                                          ? 'text-end'
                                                          : 'text-start'
                                                  }`}
                                              >
                                                  {parseInt(item.low)}
                                              </td>
                                          </tr>
                                      )
                                  })}
                          </tbody>
                      </SubscriptionGaurd>
                  }
                  <tbody>
                      {yearlyData &&
                          yearlyData.map((item, index) => {
                              if (
                                  index === yearlyData.length - 1 ||
                                  index === yearlyData.length - 2
                              )
                                  return (
                                      <tr key={`${index}-history`}>
                                          <td>{item.year}</td>
                                          <td
                                              className={`text-center ${successOrDanger(
                                                  handleYOFYChange(item?.year)
                                              )}`}
                                          >
                                              {handleYOFYChange(item?.year) ===
                                              'NaN'
                                                  ? 'N/A'
                                                  : handleYOFYChange(
                                                        item?.year
                                                    ) + ' %'}
                                          </td>
                                          <td className="text-center">
                                              {handleEpsRating(item.year)}
                                          </td>
                                          <td>{parseInt(item.high)}</td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {parseInt(item.low)}
                                          </td>
                                      </tr>
                                  )
                          })}
                  </tbody>
              </table>

              {historyData &&
                  !isEmpty(historyData) &&
                  historyData?.type === 'Stock' && (
                      <Row
                          gutter={0}
                          className={`${currentTheme === 'Dark' && 'bg-color'}`}
                      >
                          <Col span={24}>
                              <table className="table chart-table">
                                  <tbody>
                                      <tr>
                                          <td colSpan="3">{t('EPSRating')}</td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.epsRating}
                                          </td>
                                      </tr>
                                      <tr>
                                          <td colSpan="3">
                                              {t('Sales Rating')}
                                          </td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.salesRating}
                                          </td>
                                      </tr>
                                      <tr>
                                          <td colSpan="3">
                                              {t('MarginRating')}
                                          </td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.marginRating}
                                          </td>
                                      </tr>
                                      <tr>
                                          <td colSpan="3">{t('CompRating')}</td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.compRating}
                                          </td>
                                      </tr>
                                      <tr>
                                          <td colSpan="3">
                                              {t('EPSGrowthRate')}
                                          </td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.epsGrowthRate
                                                  ? `${historyData?.epsGrowthRate} %`
                                                  : 'N/A'}
                                          </td>
                                      </tr>
                                      <tr>
                                          <td colSpan="3">
                                              {t('EarningsStability')}
                                          </td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.earningsStability
                                                  ? historyData?.earningsStability
                                                  : 'N/A'}
                                          </td>
                                      </tr>
                                      <tr>
                                          <td colSpan="3">
                                              {t('ud_vol_ratio')}
                                          </td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.ud_vol_ratio}
                                          </td>
                                      </tr>
                                      <tr>
                                          <td colSpan="3">{t('BookValue')}</td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {`${t('x')} ${
                                                  historyData?.bookValue
                                              }`}
                                          </td>
                                      </tr>

                                      <tr>
                                          <td colSpan="3">
                                              {t('DividendYield')}
                                          </td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {`${historyData?.dividendYield} %`}
                                          </td>
                                      </tr>

                                      <tr>
                                          <td colSpan="3">{t('EPSSARTTM')}</td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.epsSARTTM}{' '}
                                              {`${t('Sr')}`}
                                          </td>
                                      </tr>

                                      <tr>
                                          <td colSpan="3">{t('PriceBook')}</td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.priceBook}
                                          </td>
                                      </tr>

                                      <tr>
                                          <td colSpan="3">
                                              {t('ReturnOnAverageEquityPerTTM')}
                                          </td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {
                                                  historyData?.returnOnAverageEquityPerTTM
                                              }
                                          </td>
                                      </tr>
                                      <tr>
                                          <td colSpan="3">{t('Debt')}</td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.debt
                                                  ? `${parseInt(
                                                        historyData?.debt
                                                    )} %`
                                                  : 0}
                                          </td>
                                      </tr>
                                      <tr>
                                          <td colSpan="3">{t('Alpha')}</td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.alpha}
                                          </td>
                                      </tr>
                                      <tr>
                                          <td colSpan="3">{t('Beta')}</td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.beta}
                                          </td>
                                      </tr>
                                      <tr>
                                          <td colSpan="3">{t('Cashflow')}</td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.cashflow}
                                          </td>
                                      </tr>
                                      <tr>
                                          <td colSpan="3">{t('P_E')}</td>
                                          <td
                                              className={`${
                                                  i18n.language === 'en'
                                                      ? 'text-end'
                                                      : 'text-start'
                                              }`}
                                          >
                                              {historyData?.p_e}
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </Col>
                      </Row>
                  )}
              {/* {(interval === "1W" || interval === "1M") && (
          <Quarterly currentStock={currentStock} />
        )} */}
              {historyData?.type && historyData?.type === 'Index' && (
                  <Row
                      gutter={0}
                      className={`${currentTheme === 'Dark' && 'bg-color'}`}
                  >
                      <Col span={24}>
                          <table className="table chart-table">
                              <tbody>
                                  <tr>
                                      <td colSpan="3">{t('UD Ratio')}</td>
                                      <td
                                          className={`${
                                              i18n.language === 'en'
                                                  ? 'text-end'
                                                  : 'text-start'
                                          }`}
                                      >
                                          {historyData?.ud_vol_ratio}
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </Col>
                  </Row>
              )}
          </div>
      </>
  )
};

export default HistoryTable;
