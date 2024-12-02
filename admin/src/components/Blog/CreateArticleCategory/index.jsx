import React, { useCallback, useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { Button, Form, Image, Input, Select } from "antd";
import { getAllMenu } from "../../../services/menu";
import { createArticleCategory } from "../../../services/articleCategory";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateArticleCategory = () => {
  const [form] = Form.useForm();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const navigate = useNavigate();

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setFieldsValue({ thumbnail: reader.result });
        setThumbnail(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCategory = async (values) => {
    try {
      setLoading(true);
      if (!thumbnail) {
        toast.error("Thumbnail image is required!");
        return;
      }
      const data = new FormData();
      data.append("name", values.name);
      data.append("slug", values.slug);
      data.append("seo_title", values.seo_title);
      data.append("seo_keywords", values.seo_keywords);
      data.append("seo_description", values.seo_description);
      data.append("thumbnail", thumbnail);
      data.append("menuId", values.menuId);

      const result = await createArticleCategory(data);
      toast.success(result.data.message);
      navigate("/article-category");
      form.resetFields();
      setThumbnail(null);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const getMenu = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllMenu();
      setMenus(result.data.menus);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getMenu();
  }, [getMenu]);

  return (
    <div>
      <div className="flex w-[29rem] items-center gap-2">
        <h1 className="font-bold text-neutral-600 text-xl">Article Category</h1>
        <MdArrowForwardIos />
        <h1 className="text-neutral-600 text-xl">Create Article Category</h1>
      </div>
      <Form
        form={form}
        name="ArticleCategoryForm1"
        layout="vertical"
        onFinish={handleCreateCategory}
      >
        <div className="flex flex-col lg:flex-row w-full gap-5 lg:justify-between mt-4">
          <div className="bg-white w-full rounded-md shadow-md min-h-min">
            <div className="m-5">
              <label className="block text-sm text-neutral-600 font-bold mb-2">
                Name: <span className="text-red-500">*</span>
              </label>
              <Form.Item
                name="name"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "Article category name cannot be empty!",
                  },
                ]}
              >
                <Input placeholder="Article category name" size="large" />
              </Form.Item>
            </div>

            <div className="m-5">
              <label className="block text-sm text-neutral-600 font-bold mb-2">
                Slug: <span className="text-red-500">*</span>
              </label>
              <Form.Item
                name="slug"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "Article category slug cannot be empty!",
                  },
                ]}
              >
                <Input placeholder="Article category slug" size="large" />
              </Form.Item>
            </div>

            <div className="m-5">
              <label className="block text-sm text-neutral-600 font-bold mb-2">
                Menu: <span className="text-red-500">*</span>
              </label>
              <Form.Item
                name="menuId"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "Menu ID cannot be empty!",
                  },
                ]}
              >
                {/* <Input placeholder="Menu" size="large" /> */}
                <Select placeholder="Menu article category" size="large">
                  {menus.map((menuId) => (
                    <Select.Option key={menuId._id} value={menuId.id}>
                      {menuId.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="m-5">
              <label className="block text-sm text-neutral-600 font-bold mb-2">
                SEO Keywords: <span className="text-red-500">*</span>
              </label>
              <Form.Item
                name="seo_keywords"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "SEO Keywords cannot be empty!",
                  },
                ]}
              >
                <Input
                  placeholder="Article category SEO Keywords"
                  size="large"
                />
              </Form.Item>
            </div>

            <div className="m-5">
              <label className="block text-sm text-neutral-600 font-bold mb-2">
                SEO Title: <span className="text-red-500">*</span>
              </label>
              <Form.Item
                name="seo_title"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "SEO Title cannot be empty!",
                  },
                ]}
              >
                <Input placeholder="Article category SEO Title" size="large" />
              </Form.Item>
            </div>

            <div className="m-5 pb-1">
              <label className="block text-sm text-neutral-600 font-bold mb-2">
                SEO Description: <span className="text-red-500">*</span>
              </label>
              <Form.Item
                name="seo_description"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "SEO Description cannot be empty!",
                  },
                  {
                    min: 50,
                    message:
                      "SEO Description must be at least 50 characters long!",
                  },
                  {
                    max: 160,
                    message:
                      "SEO Description must be at most 160 characters long!",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="Article category SEO Description"
                  size="large"
                  rows={3}
                  showCount
                  maxLength={160}
                  minLength={50}
                />
              </Form.Item>
            </div>
          </div>

          <div className="bg-white lg:w-[40rem] rounded-lg shadow-md h-[25rem] flex flex-col justify-between p-5">
            <label className="block text-sm text-neutral-600 font-bold mb-2">
              Upload Thumbnail Image: <span className="text-red-500">*</span>
            </label>
            <Form.Item
              name="thumbnail"
              rules={[
                { required: true, message: "Thumbnail image is required!" },
              ]}
            >
              <Input
                type="file"
                accept="image/*"
                size="large"
                className="mb-4"
                onChange={handleThumbnailChange}
                onBlur={() => form.validateFields(["thumbnail"])}
              />
              <div className="flex justify-center items-center rounded-lg h-[13rem]">
                {form.getFieldValue("thumbnail") ? (
                  <Image
                    style={{
                      width: "380px",
                      height: "210px",
                      objectFit: "cover",
                    }}
                    src={form.getFieldValue("thumbnail")}
                    alt="Uploaded Thumbnail"
                  />
                ) : (
                  <img
                    src="https://placehold.co/600x400"
                    alt="placeholder"
                    style={{
                      width: "380px",
                      height: "210px",
                      objectFit: "cover",
                    }}
                    className="rounded-lg"
                  />
                )}
              </div>
            </Form.Item>
            <Button
              loading={loading}
              type="primary"
              onClick={() => form.submit()}
              className="w-full"
              size="large"
            >
              Create Category
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateArticleCategory;
