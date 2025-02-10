import React from "react";
import { useSelector } from "react-redux";
import { InputNumber, Input, Space } from "antd";
import filterSettings from "../features/FilterSettings/filterSettings";

const RangeInput = ({ value = {}, onChange, unit }) => {
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);

  const triggerChange = (changedValue) => {
    onChange?.({
      ...value,
      ...changedValue,
    });
  };

  return (
    <Space>
      <InputNumber
        className={`${currentTheme === "Dark" && "dark-skin"}`}
        name="min"
        type={"number"}
        placeholder="Min"
        min={0}
        max={filterSettings?.type === "%" ? 100 : 9999999999}
        size="small"
        value={value?.min}
        onChange={(value) => triggerChange({ min: value })}
      />
      <InputNumber
        className={`${currentTheme === "Dark" && "dark-skin"}`}
        name="max"
        type={"number"}
        placeholder="Max"
        min={0}
        max={filterSettings?.type === "%" ? 100 : 9999999999}
        size="small"
        value={value?.max}
        onChange={(value) => triggerChange({ max: value })}
      />
    </Space>
  );
};

export default RangeInput;
