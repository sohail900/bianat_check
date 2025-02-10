import React from "react";

/**
 * @name StocksInGroup
 * @description StocksInGroup component for dashboard
 * @purpose To display stocks in group
 * @returns {JSX} JSX element
 */

const StocksInGroup = () => {
  const data = [
    {
      symbol: "CSCO",
      name: "Cisco Systems, Inc.",
      mktCap: "1.2B",
    },
    {
      symbol: "ANET",
      name: "Arista Networks, Inc.",
      mktCap: "1.2B",
    },
    {
      symbol: "JNPR",
      name: "Juniper Networks, Inc.",
      mktCap: "1.2B",
    },
    {
      symbol: "IOT",
      name: "Intel Corporation",
      mktCap: "1.2B",
    },
  ];

  return (
    <table className="table chart-table">
      <thead>
        <tr>
          <th colSpan="3">Computer-Networking</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Symbol</th>
          <th>Company</th>
          <th>Mkt Cap(mil)</th>
        </tr>
        {data.map((e, index) => {
          return (
            <tr key={index}>
              <td>{e.symbol}</td>
              <td>{e.name}</td>
              <td>{e.mktCap}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StocksInGroup;
