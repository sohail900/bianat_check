import React, { useState, useEffect } from "react";
import { Input, Modal, Radio, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { KuzzleContext } from "../../../../App";

const VideoLinkAdd = ({ visible, setVisible, setCurrentLink }) => {
  const [videoLink, setVideoLink] = useState("");
  const [videoId, setVideoId] = useState(null);
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const { currentTheme } = useSelector((state) => state.currentTheme);

  const [t] = useTranslation();
  const { TextArea } = Input;

  const saveData = async () => {
    var regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = videoLink.match(regExp);
    if (match && match[2].length == 11) {
      setVideoId(match[2]);
    }

    try {
      const response = await kuzzle.document.upsert(
        "bianat",
        "stock-video-link",
        "VideoLink",
        {
          videoLink,
          videoId: match[2],
        }
      );

      setCurrentLink(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (e) => {
    setVideoLink(e.target.value);
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
      title={t("Weekly review")}
      className={` ${currentTheme === "Dark" && "dark-skin"}`}
      visible={visible}
      width={800}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row>
        <Col span={7}>
          <label>Add Link :</label>
        </Col>

        <Col span={14}>
          <div>
            <TextArea
              className="mb-5"
              placeholder="English"
              rows={2}
              onChange={(e) => {
                onChange(e);
              }}
            />
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default VideoLinkAdd;
