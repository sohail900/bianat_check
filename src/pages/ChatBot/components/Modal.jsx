// src/components/Modal.js

import React from "react";

const Modal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-8 rounded shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl font-semibold">
            &times;
          </button>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-4">Modal Title</h2>
          <p className="mb-4">This is a responsive modal using Tailwind CSS.</p>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
