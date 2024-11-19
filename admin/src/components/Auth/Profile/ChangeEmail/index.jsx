import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";

const ChangeEmail = ({
  handleCancel,
  loading,
  handleChangeEmail,
  oldEmail,
  newEmail,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      oldEmail: oldEmail,
      newEmail: newEmail,
    });
  }, [oldEmail, newEmail, form]);

  return (
    <div className="email rounded-sm flex flex-col flex-1">
      <Form onFinish={handleChangeEmail} form={form}>
        <label htmlFor="oldEmail" className="block text-base font-bold">
          Old email: <span className="text-red-500">*</span>
        </label>
        <Form.Item
          name="oldEmail"
          style={{ marginTop: 10 }}
          rules={[
            {
              type: "email",
              message: "The old email is in an incorrect format!",
            },
            {
              required: true,
              message: "The old email cannot be empty!",
            },
          ]}
        >
          <Input className="h-[2.75rem] text-base" />
        </Form.Item>

        <label htmlFor="newEmail" className="block text-base font-bold">
          New email: <span className="text-red-500">*</span>
        </label>
        <Form.Item
          name="newEmail"
          style={{ marginTop: 10 }}
          rules={[
            {
              type: "email",
              message: "The new email is in an incorrect format!",
            },
            {
              required: true,
              message: "The new email cannot be empty!",
            },
          ]}
        >
          <Input className="h-[2.75rem] text-base" />
        </Form.Item>

        <label htmlFor="codeId" className="block text-base font-bold">
          Verification Code: <span className="text-red-500">*</span>
        </label>
        <Form.Item
          name="codeId"
          style={{ marginTop: 10 }}
          rules={[
            {
              required: true,
              message: "Verification Code cannot be empty!",
            },
          ]}
        >
          <Input className="h-[2.75rem] text-base" />
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

export default ChangeEmail;
