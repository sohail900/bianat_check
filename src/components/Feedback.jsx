import React, { useState, useContext } from "react";
import { Rate, Modal, Input, Radio, message } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { KuzzleContext } from "../App";

const Feedback = ({ setShowFeedback, showFeedback }) => {
  const [rating, setRating] = useState();
    const auth = useSelector((state) => state.auth)
  const [feedbackText, setFeedbackText] = useState("");
  const { t, i18n } = useTranslation();
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const { TextArea } = Input;
  const [reason, setReason] = useState("Bug");
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const handleOk = () => {
    setShowFeedback(false);
  };

  const saveFeedback = async () => {
    try {
      const response = await kuzzle.document.create("bianat", "feedback", {
        rating,
        feedbackText,
        reason,
        email: auth?.user?.email,
        resolved: false,
      });
      if (response._id) {
        message.success("feedback sent");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setShowFeedback(false);
  };

  const setFeedback = (feedback) => {
    setFeedbackText(feedback.target.value);
  };

  const addReason = ({ target: { value } }) => {
    setReason(value);
  };
  return (
    <Modal
      className={`feedback ${currentTheme === "Dark" && "dark-skin"} ${
        i18n.language === "en" ? "font-loader-en" : "font-loader"
      }`}
      visible={showFeedback}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <div className="feedback-form">
        <div className="feedback-section">
          <h3>{t("feedback.Send us your feedback!")}</h3>
          <p>
            {t("feedback.Do you have a suggestion or found some bug?")}
            <span className="d-block">
              {t("feedback.let us know in the field below")}
            </span>
          </p>
        </div>

        <div className="experience">
          <p>{t("feedback.How was your experience?")}</p>
          <span>
            <Rate onChange={(e) => setRating(e)} value={rating} />
          </span>
        </div>
        <TextArea
          className={`${currentTheme === "Dark" && "dark-skin"}`}
          placeholder={t("feedback.Describe your experience here")}
          rows={4}
          onChange={setFeedback}
        />
        <div
          className={`radio-section ${currentTheme === "Dark" && "text-light"}`}
        >
          <Radio.Group onChange={addReason} value={reason}>
            <Radio value={"Bug"}>{t("feedback.Bug")}</Radio>
            <Radio value={"Suggetion"}>{t("feedback.Suggetion")}</Radio>
            <Radio value={"Others"}>{t("feedback.Others")}</Radio>
          </Radio.Group>
        </div>
        <div>
          <button
            className="ant-btn ant-btn-primary feedback-btn"
            onClick={saveFeedback}
          >
            {t("feedback.Send Feedback")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Feedback;
