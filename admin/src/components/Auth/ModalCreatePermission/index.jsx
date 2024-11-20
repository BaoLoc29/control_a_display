import React, { useEffect, useCallback, useState } from "react";
import { Form, Input, Modal, Button, Spin } from "antd";
import { getPermissionById } from "../../../services/permission.js";

const ModalCreatePermission = ({
  form,
  loading,
  title,
  isModalOpen,
  handleCancel,
  handleOk,
  selectedPermission,
}) => {
  const [loadingData, setLoadingData] = useState(false);

  const getPermission = useCallback(async () => {
    try {
      setLoadingData(true);
      const result = await getPermissionById(selectedPermission);
      form.setFieldsValue({
        name: result.data.permission.name,
      });
      setLoadingData(false);
    } catch (error) {
      console.log(error.message);
      setLoadingData(false);
    }
  }, [selectedPermission, form]);

  useEffect(() => {
    if (selectedPermission) getPermission();
  }, [selectedPermission, getPermission]);

  return (
    <Modal
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      maskClosable={false}
      width={600}
    >
      <div className="text-center text-xl font-bold mb-2">
        <h2>{title}</h2>
      </div>
      <Spin spinning={loadingData}>
        <Form form={form} name="Permissions" onFinish={handleOk}>
          <p>
            <span className="text-red-500 font-bold">*</span>{" "}
            <strong>Permission Naming Guide:</strong> The permission name must
            include an action and an object, separated by a space (formula:{" "}
            <strong>action + object</strong>).
          </p>
          <strong>Example:</strong>
          <ul>
            <li>
              - Action: <em>view</em>, Object: <em>user</em>.
            </li>
            <li>- Result: view-user.</li>
          </ul>
          <p>
            <span className="text-red-500 font-bold">*</span>{" "}
            <strong>Allowed actions:</strong> view, create, edit, delete.
          </p>
          <p>
            <span className="text-red-500 font-bold">* Note:</span> If the
            object has Vietnamese characters and more than one word, the system
            will automatically convert to unsigned form and the space will be
            replaced with a sign (<strong>-</strong>).
          </p>
          <strong>Example:</strong>
          <ul>
            <li>
              - Object: <em>view bài viết</em>.
            </li>
            <li>
              - Result: <strong>view-bai-viet</strong>.
            </li>
          </ul>
          <label htmlFor="name" className="block text-sm font-bold my-2">
            <span className="text-red-500 font-bold">*</span> Permission name:
          </label>
          <Form.Item
            name="name"
            style={{ marginBottom: 10 }}
            rules={[
              { required: true, message: "Permission name cannot be empty!" },
            ]}
          >
            <Input placeholder="Permission name" size="large" />
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
              {selectedPermission ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};
export default ModalCreatePermission;
