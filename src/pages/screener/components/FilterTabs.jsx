import React from "react";
import { Form, Row } from "antd";
import FilterSaveAndReset from "./FilterSaveAndReset";
import FilterForm from "../../../components/FilterForm";
import { ScreenerContext } from "../Screener";
/**
 * @name FilterTabs
 * @description This component is used to display the filters in the screener.
 * @purpose This component is used to display the filters in the screener.
 * @param {fuction} handleFieldsChange - This function is used to handle the fields change.
 * @param {object} settings - This object is used to get the filters.
 * @param {string} filterId - This string is used to get the filter id.
 * @returns {JSX.Element} - The component.
 */

const FilterTabs = ({ filterId, handleFieldsChange, settings }) => {
  const [form] = Form.useForm();

  return (
    <ScreenerContext.Consumer>
      {({ filter }) => {
        return (
          <Form
            form={form}
            name={filterId}
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            autoComplete="false"
            initialValues={filter}
            onFieldsChange={handleFieldsChange}
          >
            <Row gutter={[0, 0]}>
              {filterId !== "all" ? (
                <FilterForm settings={settings[filterId].filters} />
              ) : (
                <FilterForm
                  settings={settings.all.filters.reduce((prev, curr) => {
                    prev.push(...settings[curr].filters);
                    return prev;
                  }, [])}
                />
              )}
            </Row>
            <Row>
              <FilterSaveAndReset form={form} />
            </Row>
          </Form>
        );
      }}
    </ScreenerContext.Consumer>
  );
};

export default FilterTabs;
