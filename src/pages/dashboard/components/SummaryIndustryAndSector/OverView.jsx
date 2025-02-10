import React from "react";
import SectorsTable from "../../../../components/SectorsTable";
const data = [
  {
    key: "Rs Rating",
    value: "72",
  },
  {
    key: "Group Rank",
    value: "55",
  },
  {
    key: "Group Market Value",
    value: "$254 Bil",
  },
  {
    key: "Numbers of Stocks",
    value: "17",
  },
  {
    key: "New High Stocks",
    value: "0",
  },
  {
    key: "New Low Stocks",
    value: "0",
  },
  {
    key: "Sector",
    value: "COMPUTER",
  },
];

/**
 * @name OverView
 * @description OverView component for dashboard
 * @purpose To display over view data
 * @returns {JSX} JSX element
 */

const OverView = () => {
  return (
    <>
      <table className="table chart-table">
        <thead>
          <tr>
            <th colSpan="2">Industry Summary</th>
          </tr>
        </thead>
        <tbody>
          {data.map((e, index) => {
            return <SectorsTable key={e.key} data={e.value} />;
          })}
        </tbody>
      </table>
      <table className="table chart-table">
        <thead>
          <tr>
            <th colSpan="2">Relative Strength</th>
          </tr>
        </thead>

        <tbody>
          {data.map((e, index) => {
            return <SectorsTable key={e.key} data={e.value} />;
          })}
        </tbody>
      </table>
      <table className="table chart-table">
        <thead>
          <tr>
            <th colSpan="2">197 Ranking</th>
          </tr>
        </thead>

        <tbody>
          {data.map((e, index) => {
            return <SectorsTable key={e.key} data={e.value} />;
          })}
        </tbody>
      </table>
    </>
  );
};

export default OverView;
