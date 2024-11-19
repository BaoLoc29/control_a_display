import React from "react";
import { Button, Form, Input } from "antd";

const ChangePassword = ({ loading, handleChangePassword, handleCancel }) => {
  return (
    <div className="password rounded-sm flex flex-col flex-1">
      <Form onFinish={handleChangePassword}>
        <label htmlFor="address" className="block text-base font-bold">
          Old password: <span className="text-red-500">*</span>
        </label>
        <Form.Item
          name="oldPassword"
          style={{ marginTop: 10 }}
          rules={[
            {
              required: true,
              message: "Please enter the previous password!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters long!",
            },
          ]}
        >
          <Input.Password className="h-[2.75rem] text-base" loading={loading} />
        </Form.Item>

        <label htmlFor="address" className="block text-base font-bold">
          New password: <span className="text-red-500">*</span>
        </label>
        <Form.Item
          name="newPassword"
          style={{ marginTop: 10 }}
          hasFeedback
          rules={[
            {
              required: true,
              message: "New password cannot be empty!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters long!",
            },
          ]}
        >
          <Input.Password className="h-[2.75rem] text-base" loading={loading} />
        </Form.Item>

        <label htmlFor="address" className="block text-base font-bold">
          Confirm new password: <span className="text-red-500">*</span>
        </label>
        <Form.Item
          name="confirmPassword"
          style={{ marginTop: 10 }}
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            {
              min: 6,
              message: "Password must be at least 6 characters long!",
            },
            {
              required: true,
              message: "This field cannot be empty!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Passwords do not match. Please check again!")
                );
              },
            }),
          ]}
        >
          <Input.Password className="h-[2.75rem] text-base" loading={loading} />
        </Form.Item>
        <div className=" flex gap-2">
          <Button
            loading={loading}
            htmlType="submit"
            type="primary"
            size="large"
            className="w-[10rem]"
          >
            Update
          </Button>
          <Button
            color="default"
            size="large"
            variant="filled"
            className="w-[7rem]"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ChangePassword;
