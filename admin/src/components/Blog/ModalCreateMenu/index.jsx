import React, { useEffect, useCallback, useState } from "react";
import { Form, Input, Modal, Button, Spin, Select } from "antd";
import { getMenuById } from "../../../services/menu.js";

const ModalCreateMenu = ({
  form,
  loading,
  title,
  isModalOpen,
  handleCancel,
  handleOk,
  selectedMenu,
}) => {
  const [loadingData, setLoadingData] = useState(false);

  const getMenu = useCallback(async () => {
    try {
      setLoadingData(true);
      const result = await getMenuById(selectedMenu);
      form.setFieldsValue({
        title: result.data.menu.title,
        slug: result.data.menu.slug,
        description: result.data.menu.description,
        type: result.data.menu.type,
      });

      setLoadingData(false);
    } catch (error) {
      console.log(error.message);
      setLoadingData(false);
    }
  }, [selectedMenu, form]);

  useEffect(() => {
    if (selectedMenu) getMenu();
  }, [selectedMenu, getMenu]);

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
        <Form form={form} name="Menus" onFinish={handleOk}>
          <label htmlFor="title" className="block text-sm font-bold mb-1">
            Title: <span className="text-red-500">*</span>
          </label>
          <Form.Item
            name="title"
            style={{ marginBottom: 10 }}
            rules={[{ required: true, message: "Title cannot be empty!" }]}
          >
            <Input placeholder="Title" size="large" />
          </Form.Item>

          <label htmlFor="slug" className="block text-sm font-bold mb-1">
            Slug: <span className="text-red-500">*</span>
          </label>
          <Form.Item
            name="slug"
            style={{ marginBottom: 10 }}
            rules={[{ required: true, message: "Slug cannot be empty!" }]}
          >
            <Input placeholder="Slug" size="large" />
          </Form.Item>

          <label htmlFor="description" className="block text-sm font-bold mb-1">
            Description: <span className="text-red-500">*</span>
          </label>
          <Form.Item
            name="description"
            style={{ marginBottom: 10 }}
            rules={[
              {
                required: true,
                message: "Description cannot be empty!",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Description"
              size="large"
              rows={3}
              showCount
              maxLength={300}
              minLength={50}
            />
          </Form.Item>

          <label htmlFor="type" className="block text-sm font-bold mb-1">
            Types: <span className="text-red-500">*</span>
          </label>
          <Form.Item
            name="type"
            style={{ marginBottom: 10 }}
            rules={[
              {
                required: true,
                message: "Type cannot be empty!",
              },
            ]}
          >
            <Select placeholder="Type" size="large">
              <Select.Option value="Link">Link</Select.Option>
              <Select.Option value="SubMenu">SubMenu</Select.Option>
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
              {selectedMenu ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};
export default ModalCreateMenu;
