import React, { useEffect, useContext, useState } from "react";
import { useSelector } from "react-redux";
import PercentageChangeTable from "./components/PercentageChangeTable";
import RelativeStrengthRating from "./components/RelativeStrengthRating";
import RelativeStrengthChange from "./components/RelativeStrengthChange";
import { KuzzleContext } from "../../../../App";
import * as esb from "elastic-builder";

const Technical = () => {
  const { kuzzleSocket: kuzzle } = useContext(KuzzleContext);
  const currentStock = useSelector((state) => state.currentStock.currentStock);
  const realTimeData = useSelector((state) => state.realTime.realTimeData);
  const [data, setData] = useState();

  useEffect(() => {
    if (realTimeData) {
      setData(realTimeData._source);
    }
  }, [realTimeData]);

  const getTechnicalData = async () => {
    let stock = await kuzzle.document.search(
      "bianat",
      "indicators",
      esb
        .requestBodySearch()
        .query(esb.matchQuery("code", currentStock))
        .sort(esb.sort("change_p"))
        .source({
          includes: ["relativeStrength", "weekHigh52", "change_timeData"],
        })
    );

    setData(stock.hits[0]._source);
  };

  useEffect(() => {
    getTechnicalData();
  }, [currentStock]);

  return (
    <div>
      <PercentageChangeTable data={data} />
      <RelativeStrengthRating data={data} />
      <RelativeStrengthChange data={data} />
    </div>
  );
};

export default Technical;
