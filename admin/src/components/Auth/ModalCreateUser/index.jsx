import React, { useEffect, useCallback, useState } from "react";
import { Form, Input, Modal, Select, Button, Spin } from "antd";
import { getUserById } from "../../../services/user.js";
import { getAllRole } from "../../../services/role.js";

const ModalCreateUser = ({
  form,
  loading,
  title,
  isModalOpen,
  handleCancel,
  handleOk,
  selectedUser,
}) => {
  const [loadingData, setLoadingData] = useState(false);
  const [roleList, setRoleList] = useState([]);

  const getRole = useCallback(async () => {
    try {
      const result = await getAllRole();
      setRoleList(result.data.roles);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  }, []);

  const getUser = useCallback(async () => {
    try {
      setLoadingData(true);
      const result = await getUserById(selectedUser);
      form.setFieldsValue({
        name: result.data.user.name,
        email: result.data.user.email,
        roleId: result.data.user.roleId,
      });
      setLoadingData(false);
    } catch (error) {
      console.log(error);
      setLoadingData(false);
    }
  }, [selectedUser, form]);

  useEffect(() => {
    if (selectedUser) {
      getUser();
      getRole();
    }
  }, [selectedUser, getUser, getRole]);

  return (
    <Modal
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <div className="text-center text-xl font-bold mb-2">
        <h2>{title}</h2>
      </div>
      <Spin spinning={loadingData}>
        <Form form={form} name="Users" onFinish={handleOk}>
          <label htmlFor="name" className="block text-sm font-bold mb-1">
            User name: <span className="text-red-500">*</span>
          </label>
          <Form.Item
            name="name"
            style={{ marginBottom: 10 }}
            rules={[
              { required: true, message: "Employee name cannot be empty!" },
            ]}
          >
            <Input placeholder="User name" size="large" />
          </Form.Item>

          <label htmlFor="email" className="block text-sm font-bold mb-1">
            E-mail: <span className="text-red-500">*</span>
          </label>
          <Form.Item
            name="email"
            style={{ marginBottom: 10 }}
            rules={[
              { type: "email", message: "Invalid email format!" },
              { required: true, message: "Email cannot be empty!" },
            ]}
          >
            <Input placeholder="E-mail" size="large" />
          </Form.Item>

          <label htmlFor="roleId" className="block text-sm font-bold mb-1">
            Role: <span className="text-red-500">*</span>
          </label>
          <Form.Item
            name="roleId"
            style={{ marginBottom: 10 }}
            rules={[
              {
                required: true,
                message: "Role user cannot be empty!",
              },
            ]}
          >
            <Select placeholder="--Select role--" size="large">
              {roleList.map((roles) => (
                <Select.Option key={roles._id} value={roles.id}>
                  {roles.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {!selectedUser && (
            <>
              <label
                htmlFor="password"
                className="block text-sm font-bold mb-1"
              >
                Password: <span className="text-red-500">*</span>
              </label>
              <Form.Item
                name="password"
                style={{ marginBottom: 10 }}
                rules={[
                  { required: true, message: "Password cannot be empty!" },
                  { min: 6, message: "Password must be at least 6 characters" },
                  { type: "password" },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Password" size="large" />
              </Form.Item>
            </>
          )}

          {!selectedUser && (
            <>
              <label htmlFor="confirm" className="block text-sm font-bold mb-1">
                Confirm Password: <span className="text-red-500">*</span>
              </label>
              <Form.Item
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Passwords don't match, please check again!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords don't match, please check again!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm password" size="large" />
              </Form.Item>
            </>
          )}

          <div className="flex justify-end mt-5">
            <Button onClick={handleCancel} className="mr-2 mb-2" size="large">
              Cancel
            </Button>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="mb-2"
              size="large"
            >
              {selectedUser ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalCreateUser;
