import React, { useEffect, useContext, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Row, Col, Card, Button } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import VideoLinkAdd from "./VideoLinkUpdate/VideoLinkAddModal";
import { KuzzleContext } from "../../../App";

const VideoPlay = () => {
  const { t, i18n } = useTranslation();
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const [visible, setVisible] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await kuzzle.document.search(
          "bianat",
          "stock-video-link",
          {}
        );
        setVideoLink(response.hits[0]._source);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [currentLink]);

  return (
    <>
      
        <Card
          className="info-card  videoCard"
          title={`${t("Weekly review")}`}
        >
          {auth && auth.user?.roles.includes("admin") && (
            <Button
              className="edit-btn"
              icon={<EditOutlined />}
              onClick={() => {
                setVisible(!visible);
              }}
            />
          )}
          <div className="data-list">
          <iframe
          className="video-width"
                  src={`https://www.youtube.com/embed/${videoLink.videoId}`}
                  frameborder="0"
                  allowfullscreen
                ></iframe>
          </div>
        </Card>
    
      <VideoLinkAdd
        visible={visible}
        setVisible={setVisible}
        setCurrentLink={setCurrentLink}
      />
    </>
  );
};

export default VideoPlay;
