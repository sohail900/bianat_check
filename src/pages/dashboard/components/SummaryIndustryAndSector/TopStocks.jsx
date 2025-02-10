import React from "react";

/**
 * @name TopStocks
 * @description TopStocks component for dashboard
 * @purpose To display top stocks
 * @returns {JSX} JSX element
 */

const TopStocks = () => {
  const data = [
    {
      symbol: "CSCO",
      name: "Cisco Systems, Inc.",
      Rs: 95,
      EPS: 92,
    },
    {
      symbol: "ANET",
      name: "Arista Networks, Inc.",
      Rs: 95,
      EPS: 92,
    },
    {
      symbol: "JNPR",
      name: "Juniper Networks, Inc.",
      Rs: 95,
      EPS: 92,
    },
    {
      symbol: "IOT",
      name: "Intel Corporation",
      Rs: 95,
      EPS: 92,
    },
  ];
  const offHigh = [
    {
      symbol: "CSCO",
      name: "Cisco Systems, Inc.",
      high: -6.5,
    },
    {
      symbol: "ANET",
      name: "Arista Networks, Inc.",
      high: -6.5,
    },
    {
      symbol: "JNPR",
      name: "Juniper Networks, Inc.",
      high: -6.5,
    },
  ];
  return (
    <>
      <table className="table chart-table">
        <thead>
          <tr>
            <th colSpan="3">Top Rs + EPS Stocks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Symbol</th>
            <th>Company</th>
            <th>% Off High</th>
          </tr>
          {data.map((e, index) => {
            return (
              <tr key={index}>
                <td>{e.symbol}</td>
                <td>{e.name}</td>
                <td>{e.Rs}</td>
                <td>{e.EPS}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <table className="table chart-table">
        <thead>
          <tr>
            <th colSpan="3">Top Rs + EPS Stocks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Symbol</th>
            <th>Company</th>
            <th>% Off High</th>
          </tr>
          {offHigh.map((e, index) => {
            return (
              <tr key={index}>
                <td>{e.symbol}</td>
                <td>{e.name}</td>
                <td>{e.high}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TopStocks;
