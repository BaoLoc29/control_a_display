import React from "react";
import { Button, Form, Input } from "antd";

const ChangeUser = ({ form, loading, handleEditUser, handleCancel }) => {
  // Check nếu email người dùng thay đổi sẽ tự động chuyển qua change email
  return (
    <div className="info rounded-sm flex flex-col flex-1">
      <Form form={form} name="userInfo" onFinish={handleEditUser}>
        <label htmlFor="name" className="block text-base font-bold">
          User name: <span className="text-red-500">*</span>
        </label>
        <Form.Item
          name="name"
          style={{ marginTop: 10 }}
          rules={[
            {
              type: "text",
              message: "Name is not in the correct format!",
            },
            {
              required: true,
              message: "Name cannot be empty!",
            },
          ]}
        >
          <Input className="h-[2.75rem] text-base" loading={loading} />
        </Form.Item>

        <label htmlFor="email" className="block text-base font-bold">
          E-mail: <span className="text-red-500">*</span>
        </label>
        <Form.Item
          name="email"
          style={{ marginTop: 10 }}
          rules={[
            {
              type: "email",
              message: "Email is in the incorrect format!",
            },
            {
              required: true,
              message: "Email cannot be empty!",
            },
          ]}
        >
          <Input className="h-[2.75rem] text-base" loading={loading} />
        </Form.Item>

        <label htmlFor="role" className="block text-base font-bold">
          Role: <span className="text-red-500">*</span>
        </label>
        <Form.Item name="role" style={{ marginTop: 10 }}>
          <Input className="h-[2.75rem] text-base" disabled />
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

export default ChangeUser;
