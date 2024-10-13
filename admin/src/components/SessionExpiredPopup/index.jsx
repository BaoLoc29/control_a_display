import React from "react";
import { Modal, Button, Result } from "antd";

const SessionExpiredPopup = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      footer={null}
      onCancel={onClose}
      style={{ maxWidth: "70%", top: 130 }}
    >
      <Result
        className="p-2"
        status="warning"
        title="Session Expired!"
        subTitle={
          <span className="text-lg">
            Your session has expired, please login again.
          </span>
        }
        extra={
          <Button key="login" size="large" type="primary" onClick={onClose}>
            Log In Again
          </Button>
        }
      />
    </Modal>
  );
};

export default SessionExpiredPopup;
