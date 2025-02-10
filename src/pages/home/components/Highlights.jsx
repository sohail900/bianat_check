import React, { useState, useEffect, useContext } from "react";
import Marquee from "react-fast-marquee";
import { Spin } from "antd";
import esb from "elastic-builder";
import { useTranslation } from "react-i18next";
import { KuzzleContext } from "../../../App";
import MarqueeComponent from "./Marquee";

const HighLights = () => {
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const { kuzzleSocket: kuzzleS } = useContext(KuzzleContext);
  const [roomId, setRoomId] = useState();
  const [performerData, setPerformerData] = useState();
  const [currentLanguage, setCurrentLanguage] = useState();
  const { i18n, t } = useTranslation();

  let obj = {};

  const getData = async () => {
    try {
      let id = await kuzzleS.realtime.subscribe(
        "bianat",
        "indicators",
        {
          // equals: {
          //   code: `${item.code}`,
          // },
        },
        (notification) => {
          if (notification.type !== "document") return;
          if (notification.action !== "update") return;
          let tempData = JSON.parse(JSON.stringify(notification.result));
          setPerformerData({
            ...performerData,
            [tempData._source.code]: tempData._source,
          });
        }
      );

      setRoomId(id);
    } catch (err) {
      console.log(err);
    }
  };
  const unsubscribe = async () => {
    try {
      if (kuzzleS.connected) {
        await kuzzleS.realtime.unsubscribe(roomId);
      }
    } catch (e) {
      console.log("Error in unsubscribing", roomId);
    }
  };

  // useEffect(() => {
  //   getData();
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);


////polling

const useInterval = (callback, delay) => {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const getPerformers =async () => {
  try {
    setCurrentLanguage(i18n.language);

    const data = await kuzzle.document.search(
      "bianat",
      "indicators",
      esb
        .requestBodySearch()
        .query(
          esb
            .boolQuery()
            .must([
              esb.existsQuery("code"),
              esb.existsQuery("name"),
              esb.existsQuery("change"),
              esb.existsQuery("change_p"),
              esb.existsQuery("close"),
            ])
        )
        .source(["code", "name", "change", "change_p", "close"]),
      { size: 1000 }
    );
    data.hits.map((item) => (obj[item._source.code] = item._source));
    setPerformerData(obj);
  } catch (err) {
    console.log(err);
  }
}


useInterval(getPerformers, 5 * 60 * 1000);


  useEffect(() => {
    document.getElementById("marquee").dir = "ltr";
    getPerformers();
  }, [i18n.language]);

  return (
    <>
      <div id="marquee">
        {performerData ? (
          <Marquee pauseOnHover gradient={false} direction={"left"}>
            <ul
              className={`ticker-list ${
                i18n.language === "en" ? "font-loader-en" : "font-loader"
              }`}
            >
              {performerData &&
                Object.keys(performerData).map((item, index) => {
                  return (
                    <MarqueeComponent
                      index={index}
                      item={performerData[item]}
                      currentLanguage={currentLanguage}
                      t={t}
                      key={index}
                    />
                  );
                })}
            </ul>
          </Marquee>
        ) : (
          <Spin style={{ margin: "auto" }} />
        )}
      </div>
    </>
  );
};

export default HighLights;
