import React, { useEffect, useContext, useState } from "react";
import Menubar from "../../.././MultilevelDropdown/index";
import { KuzzleContext } from "../../../App";
const MultilevelDropdown = ({ setChoice, setIsModalVisible }) => {
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const menuItems = [
    {
      value: "Exports",
      items: [{ value: "Excel" }, { value: "CSV" }],
      items: [{ value: "CSV" }],
    },
    { value: "Column Selection" },
    { value: "Save Layout" },
  ];

  const animation = ["slideIn", "slideOut"];

  return (
    <div className="multilevel-menu">
      <Menubar
        data={menuItems}
        animation={animation}
        onClick={(e) => {
          setChoice(e.value);

          if (e.value === "Column Selection") {
            setIsModalVisible(true);
          }
        }}
      />
    </div>
  );
};

export default MultilevelDropdown;
