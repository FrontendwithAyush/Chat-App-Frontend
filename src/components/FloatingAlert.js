// components/FloatingAlert.js
import React, { useEffect } from "react";

const FloatingAlert = ({ show, type = "success", message, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // auto-dismiss after 2s
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`alert alert-${type} position-absolute top-0 start-50 translate-middle-x mt-3 shadow`}
      role="alert"
      style={{ zIndex: 9999, minWidth: "300px", maxWidth: "90%" }}
    >
      {message}
    </div>
  );
};

export default FloatingAlert;
