import React, { useContext } from "react";
import { Form, Col, Button, Space } from "antd";
import { ScreenerContext } from "../Screener";

/**
 * @name FilterSaveAndReset
 * @description This component is used to display the save and reset button.
 * @purpose This component is used to display the save and reset button.
 * @param {object} form - This object is used to get the form.
 * @returns
 */

const FilterSaveAndReset = ({ form }) => {
  const { updateFilters, showModal, filter } = useContext(ScreenerContext);

  return (
    <Col span={24} className="mt-1">
      <Form.Item wrapperCol={{ span: 24 }}>
        <Space style={{ justifyContent: "end", width: "100%" }}>
          <Button
            type="primary"
            size="small"
            onClick={async () => {
              if (Object.keys(filter).length > 0) {
                await updateFilters({});
                form.resetFields();
              }
            }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              showModal();
            }}
          >
            Save
          </Button>
        </Space>
      </Form.Item>
    </Col>
  );
};

export default FilterSaveAndReset;
