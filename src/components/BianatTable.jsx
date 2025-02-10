import React from "react";
import { Table } from "antd";

/**
 * @name BianatTable
 * @description: This component is used to render a table with pagination.
 * @purpose: To render a table with pagination.
 * @param {Object} data - Data to be rendered in the table.
 * @param {Object} columns - Columns to be rendered in the table.
 * @param {Number} currentIndex - Current index of the table.
 * @returns {Object} JSX object.
 */

const BianatTable = ({ data, columns, currentIndex }) => {
  const rowKey = "code";

  const currentPage = () => {
    if (currentIndex % 20 === 0) {
      return currentIndex / 20;
    }
    return Math.floor(currentIndex / 20) + 1;
  };
  const currentp = currentPage();

  return (
    <Table
      pagination={{ pageSize: 20 }}
      style={{ minHeight: "700px" }}
      className="tbl_pagination"
      // scroll={{ x: "calc(700px + 50%)", y: 240 }}
      dataSource={data}
      columns={columns}
      size="small"
    />
  );
};

export default BianatTable;
