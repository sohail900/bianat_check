import React from "react";
import { useSelector } from "react-redux";
import { Col, Form, Input, InputNumber, Radio, Row, Select } from "antd";
import { useTranslation } from "react-i18next";
import RangeInput from "./RangeInput";

/**
 * @name FilterForm
 * @description: This component is used to render a form with filters.
 * @purpose: To render a form with filters.
 * @param {Object} settings - Settings to be rendered in the form.
 * @returns {Object} JSX object.
 */

const FilterForm = ({ settings }) => {
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);

  const { Option } = Select;
  const { t, i18n } = useTranslation();

  return (
    <>
      {settings.map((filter, index) => {
        return (
          <Col className="gutter-row" span={24} key={index}>
            <Form.Item
              label={
                i18n.language === "ar" && filter.nameAr
                  ? filter.nameAr
                  : filter.name
              }
              name={filter.custom ? `custom-${index}` : filter.id}
            >
              {filter?.type === "max-min" ? (
                <RangeInput unit={filter?.unit} />
              ) : filter?.type === "yes-no" ? (
                <Radio.Group>
                  <Radio value={"Yes"}>Yes</Radio>
                  <Radio value={"No"}>No</Radio>
                </Radio.Group>
              ) : filter?.type === "checklist" ? (
                <></>
              ) : (
                <Select
                  className={`${currentTheme === "Dark" && "dark-skin"}`}
                  size="small"
                  allowClear={true}
                  placeholder={`${t(filter.name)}`}
                  style={{ width: "100%" }}
                >
                  {filter?.options.map((item, itemIndex) => (
                    <Option
                      className={`${currentTheme === "Dark" && "dark-skin"}`}
                      key={`${itemIndex}--${item.key}-${item.value}`}
                      value={item.field ? item.field : item.key}
                    >
                      {item.value}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <hr />
          </Col>
        );
      })}
    </>
  );
};

export default FilterForm;
