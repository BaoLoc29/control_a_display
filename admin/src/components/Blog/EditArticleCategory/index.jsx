import React, { useCallback, useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { Button, Form, Image, Input, Select, Spin } from "antd";
import { getAllMenu } from "../../../services/menu";
import {
  editArticleCategory,
  getArticleCategoryById,
} from "../../../services/articleCategory";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditArticleCategory = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState([]);
  const { articleCategoryId } = useParams();
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  const getArticleCategory = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getArticleCategoryById(articleCategoryId);
      form.setFieldsValue({
        name: result.data.articleCategory.name,
        slug: result.data.articleCategory.slug,
        seo_keywords: result.data.articleCategory.seo_keywords,
        seo_title: result.data.articleCategory.seo_title,
        seo_description: result.data.articleCategory.seo_description,
        menuId: result.data.articleCategory.menuId,
      });
      if (result.data.articleCategory.thumbnail) {
        setThumbnailUrl(result.data.articleCategory.thumbnail);
        form.setFieldsValue({
          thumbnail: result.data.articleCategory.thumbnail,
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }, [articleCategoryId, form]);

  useEffect(() => {
    if (articleCategoryId) getArticleCategory();
  }, [articleCategoryId, getArticleCategory]);

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setFieldsValue({ thumbnail: reader.result });
        setThumbnail(file);
        setThumbnailUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditCategory = async (values) => {
    const data = new FormData();
    data.append("name", values.name);
    data.append("slug", values.slug);
    data.append("seo_keywords", values.seo_keywords);
    data.append("seo_title", values.seo_title);
    data.append("seo_description", values.seo_description);
    data.append("menuId", values.menuId);
    data.append("thumbnail", thumbnail);
    try {
      setLoading(true);
      const result = await editArticleCategory(articleCategoryId, data);
      toast.success(result.data.message);
      navigate("/article-category");
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
        <h1 className="text-neutral-600 text-xl">Update Article Category</h1>
      </div>
      <Spin spinning={loading}>
        <Form
          form={form}
          name="ArticleCategory"
          layout="vertical"
          onFinish={handleEditCategory}
        >
          <div className="flex flex-col lg:flex-row w-full gap-5 lg:justify-between mt-4">
            <div className="bg-white w-full rounded-md shadow-md min-h-min">
              <div className="m-5">
                <label className="block text-sm text-neutral-600 font-bold mb-2">
                  Name: <span className="text-red-500">*</span>
                </label>
                <Form.Item
                  name="name"
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
                  <Input
                    placeholder="Article category SEO Title"
                    size="large"
                  />
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
                      message: "seo_description cannot be empty!",
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Article category SEO Description"
                    size="large"
                    rows={3}
                    showCount
                    maxLength={160}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="bg-white lg:w-[40rem] rounded-lg shadow-md h-[25rem] flex flex-col justify-between p-5">
              <Form.Item name="thumbnail">
                <label className="block text-sm text-neutral-600 font-bold mb-2">
                  Upload Thumbnail Image:{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  size="large"
                  className="mb-4"
                  onChange={handleThumbnailChange}
                />
                <div className="flex justify-center items-center rounded-lg h-[13rem]">
                  {thumbnailUrl ? (
                    <Image
                      style={{
                        width: "380px",
                        height: "210px",
                        objectFit: "cover",
                      }}
                      src={thumbnailUrl}
                      alt="Uploaded Thumbnail"
                    />
                  ) : (
                    <img
                      src="https://placehold.co/840x310"
                      alt="placeholder"
                      style={{
                        width: "380px",
                        height: "210px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              </Form.Item>

              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
                onClick={() => form.submit()}
              >
                Update Category
              </Button>
            </div>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default EditArticleCategory;
