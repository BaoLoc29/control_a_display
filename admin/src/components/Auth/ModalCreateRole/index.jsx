import React, { useEffect, useCallback, useState } from "react";
import { Form, Input, Modal, Button, Spin, Select } from "antd";
import { getRoleById } from "../../../services/role.js";
import { getAllPermission } from "../../../services/permission.js";

const ModalCreateRole = ({
  form,
  loading,
  title,
  isModalOpen,
  handleCancel,
  handleOk,
  selectedRole,
}) => {
  const [loadingData, setLoadingData] = useState(false);
  const [permissionList, setPermissionList] = useState([]);

  const getRole = useCallback(async () => {
    try {
      setLoadingData(true);
      const result = await getRoleById(selectedRole);
      form.setFieldsValue({
        name: result.data.role.name,
        permissionIds: result.data.role.permissionIds,
      });
      setLoadingData(false);
    } catch (error) {
      console.log(error);
      setLoadingData(false);
    }
  }, [selectedRole, form]);

  const getPermissions = useCallback(async () => {
    try {
      const result = await getAllPermission();
      setPermissionList(result.data.permissions);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  }, []);

  useEffect(() => {
    if (selectedRole) {
      getPermissions();
      getRole();
    }
  }, [selectedRole, getRole, getPermissions]);

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
        <Form form={form} name="Roles" onFinish={handleOk}>
          <label htmlFor="name" className="block text-sm font-bold mb-1">
            Role Name: <span className="text-red-500">*</span>
          </label>
          <Form.Item
            name="name"
            style={{ marginBottom: 10 }}
            rules={[{ required: true, message: "Role name cannot be empty!" }]}
          >
            <Input placeholder="Role name" size="large" />
          </Form.Item>

          <label
            htmlFor="permissionIds"
            className="block text-sm font-bold mb-1"
          >
            Permissions: <span className="text-red-500">*</span>
          </label>
          <Form.Item
            name="permissionIds"
            style={{ marginBottom: 10 }}
            rules={[
              { required: true, message: "Permissions cannot be empty!" },
            ]}
          >
            <Select
              mode="multiple"
              size="large"
              style={{
                width: "100%",
              }}
              placeholder="Select permissions"
              onChange={(value) =>
                form.setFieldsValue({ permissionIds: value })
              }
            >
              {permissionList.map((permissions) => (
                <Select.Option key={permissions._id} value={permissions._id}>
                  {permissions.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

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
              {selectedRole ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalCreateRole;
