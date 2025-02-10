import React from "react";
/**
 * @name SectorsTable
 * @description: This component is used to render a table with sectors.
 * @purpose: To render a table with sectors.
 * @param {value} head - Headers of the table.
 * @param {value} value - Values of the table.
 * @returns {Object} JSX object.
 * @example <SectorsTable head={["Sector", "Value"]} value={[["sector", "value"]]} />
 */
const SectorsTable = ({ head, value }) => {
  return (
    <tr>
      <td>{head}</td>
      <td>{value}</td>
    </tr>
  );
};

export default SectorsTable;
