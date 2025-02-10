import React, { useState, useEffect } from "react";
import { Input, Modal, Radio, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { KuzzleContext } from "../../../../App";

const MarketSnapShowModal = ({ visible, setVisible, setSnapshot,marketSnapData,trading,currentOutlook,
  currentOutlookEn,
  currentOutlookAr,
  tradingen,
  tradingar,
  setCurrentOutlookEn,
  setCurrentOutlookAr,
  setTradingen,
  setTradingar,setTrading,
  setCurrentOutlook}) => {
  
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const [t] = useTranslation();
  const { TextArea } = Input;

  const saveData = async () => {
    try {
      const response = await kuzzle.document.upsert(
        "bianat",
        "snapshot",
        "admin",

        {
          currentOutlook: {
            currentOutlooken:currentOutlookEn,
            currentOutlookar:currentOutlookAr,
            marketPre: currentOutlook,
          },
          tradingEnv: {
            tradingen:tradingen,
            tradingar:tradingar,
            colorValue: trading,
          },
        }
      );
      setSnapshot(response._id);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeColor = (e) => {
    setTrading(e.target.value);
  };
  const onChange = (e) => {
    setCurrentOutlook(e.target.value);
  };

  const handleOk = () => {
    saveData();
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title="Market Snapshot"
      className={` ${currentTheme === "Dark" && "dark-skin"}`}
      visible={visible}
      width={800}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row>
        <Col xs={{ span: 24 }} lg={{ span: 7 }}>
          <label>Current Outlook :</label>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 14 }}>
          <div>
            <TextArea
              className="mb-5"
              placeholder="English"
              value={currentOutlookEn}
              rows={2}
              onChange={(e) => {
                setCurrentOutlookEn(e.target.value);
              }}
            />
            <TextArea
              placeholder="Arabic"
              value={currentOutlookAr}
              rows={2}
              onChange={(e) => {
                setCurrentOutlookAr(e.target.value);
              }}
            />
          </div>
        </Col>

        <Col span={24}>
          <div className="mt-10 mb-10 radio-choice">
            <Radio.Group onChange={onChange} value={currentOutlook}>
              <Radio value="Sideways_Market">{t("Sideways Market")}</Radio>
              <Radio value="Confirmed_Uptrend">{t("Confirmed Uptrend")}</Radio>
              <Radio value="Market_in_Correction">
                {t("Market in Correction")}
              </Radio>
            </Radio.Group>
          </div>
        </Col>
      </Row>

      <Row>
        <Col span={7}>
          <label>Trading Environment:</label>
        </Col>

        <Col span={14}>
          <div>
            <TextArea
              rows={2}
              className="mb-5"
              placeholder="English"
              value={tradingen}
              onChange={(e) => {
                setTradingen(e.target.value);
              }}
            />
            <TextArea
              rows={2}
              placeholder="Arabic"
              value={tradingar}
              onChange={(e) => setTradingar(e.target.value)}
            />
          </div>
        </Col>

        <Col span={24}>
          <div className="mt-10 mb-10">
            <Radio.Group onChange={onChangeColor} value={trading}>
              <Radio value="Red">{t("Red")}</Radio>
              <Radio value="Orange">{t("Orange")}</Radio>
              <Radio value="Green">{t("Green")}</Radio>
            </Radio.Group>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default MarketSnapShowModal;
