import React, { useState } from "react";
import { Modal } from "antd";

const MobileScreenNotAvailable = ({ isModalVisible, setIsModalVisible }) => {
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Basic Modal"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>
        Bianat is not compatible with smart device and will be available soon
      </p>
    </Modal>
  );
};

export default MobileScreenNotAvailable;
