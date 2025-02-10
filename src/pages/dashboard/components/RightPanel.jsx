import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import OwnerFund from "./IndustryAndSector";
import Technical from "./Technical/Technical";
import Growth from "./Growth/Growth";
import Shariah from "./Shariah/shariah";
import Dividends from "./Dividends/Dividends";
import SubscriptionGaurd from "../../../hoc/SubscriptionGaurd";

/**
 * @name RightPanel
 * @description Right Panel Component
 * @param {function} handleRightPanel
 * @param {boolean} showRightPanel
 * @returns {JSX} JSX elements
 */

const RightPanel = ({
  handleRightPanel,
  showRightPanel,
  handleShowScreener,
}) => {
  const { i18n, t } = useTranslation();
  const [panel, setPanel] = useState("");

  const handlePanel = (value) => {
    if (panel === "") {
      handleRightPanel(!showRightPanel);
      setPanel(value);
    } else if (value === panel) {
      handleRightPanel(!showRightPanel);
      setPanel("");
    } else {
      setPanel(value);
    }
  };

  useEffect(() => {
    if (showRightPanel && panel === "") {
      handleRightPanel(false);
    }

    
    },[showRightPanel])


  return (
      <div
          className={`right-panel ${showRightPanel ? 'is-open' : 'is-close'} ${
              i18n.language === 'en' ? 'font-loader-en' : 'font-loader'
          }`}
          id="right-panel"
      >
          <div className="tab-box">
              <div
                  className={`tabs-nav-v ${
                      i18n.language === 'ar' && 'arabic-style-tabs'
                  }`}
              >
                  <a
                      href="#"
                      onClick={() => {
                          handlePanel('industry')
                      }}
                  >
                      {t('Industry & Sector')}
                  </a>
                  <a
                      href="#"
                      onClick={() => {
                          handlePanel('Checklist')
                      }}
                  >
                      {t('dashboard.right_panel.checklist')}
                  </a>
                  <a
                      href="#"
                      onClick={() => {
                          handlePanel('technical')
                      }}
                  >
                      {t('Technical')}
                  </a>
                  <a
                      href="#"
                      onClick={() => {
                          handlePanel('shariah')
                      }}
                  >
                      {t('dashboard.right_panel.Shariah')}
                  </a>
                  <a
                      href="#"
                      onClick={() => {
                          handlePanel('dividends')
                      }}
                  >
                      {t('dashboard.right_panel.Dividends')}
                  </a>
              </div>
              <div
                  className={`tabs-content-v  ${
                      i18n.language === 'ar' && 'arabic-style-tabs'
                  }`}
                  id="inner-panel"
              >
                  <div className="tabs-content tabs-content-v content-2 active">
                      {panel === 'industry' && (
                          <SubscriptionGaurd page="dashboard" id="industry">
                              <OwnerFund
                                  handleShowScreener={handleShowScreener}
                              />
                          </SubscriptionGaurd>
                      )}
                  </div>
                  <div className="tabs-content tabs-content-v content-2 active">
                      {panel === 'Checklist' && (
                          <SubscriptionGaurd page="dashboard" id="checklist">
                              <Growth />
                          </SubscriptionGaurd>
                      )}
                  </div>
                  <div className="tabs-content content-1 active">
                      {panel === 'technical' && (
                          <SubscriptionGaurd page="dashboard" id="technical">
                              <Technical />
                          </SubscriptionGaurd>
                      )}
                  </div>
                  <div className="tabs-content content-2 active">
                      {panel === 'shariah' && <Shariah />}
                  </div>
                  <div className="tabs-content content-3 active">
                      {panel === 'dividends' && <Dividends />}
                  </div>
              </div>
          </div>
      </div>
  )
};

export default RightPanel;
