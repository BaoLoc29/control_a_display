import React, { useCallback, useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { Button, Form, Image, Input, Select, Switch } from "antd";
import { getAllArticleCategory } from "../../../services/articleCategory.js";
import { createArticle } from "../../../services/article.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CustomEditor from "../../CustomEditor/index.jsx";

const CreateArticle = () => {
  const [form] = Form.useForm();
  const [articleCategories, setArticleCategories] = useState([]);
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

  const getCategory = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllArticleCategory();
      setArticleCategories(result.data.articleCategories);
    } catch (error) {
      toast.error(error.response?.data?.message || "Get category faild!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  const handleCreate = async (values) => {
    try {
      setLoading(true);
      const {
        title,
        slug,
        summary,
        seo_keywords,
        seo_title,
        seo_description,
        description,
        articleCategoryId,
        status,
        popular,
      } = values;

      const data = new FormData();
      data.append("thumbnail", thumbnail);
      data.append("title", title);
      data.append("slug", slug);
      data.append("summary", summary);
      data.append("seo_keywords", seo_keywords);
      data.append("seo_title", seo_title);
      data.append("seo_description", seo_description);
      data.append("description", description);
      data.append("articleCategoryId", articleCategoryId);
      data.append("status", status ? true : false);
      data.append("popular", popular ? true : false);

      const result = await createArticle(data);
      toast.success(result.data.message);
      navigate("/article");
      form.resetFields();
      setThumbnail(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex w-[29rem] items-center gap-2">
        <h1 className="font-bold text-neutral-600 text-xl">Article</h1>
        <MdArrowForwardIos />
        <h1 className="text-neutral-600 text-xl">Create article</h1>
      </div>
      <Form
        form={form}
        name="Article Form1"
        layout="vertical"
        onFinish={handleCreate}
      >
        <div className="flex flex-col lg:flex-row w-full gap-5 lg:justify-between mt-4">
          <div className="bg-white w-full rounded-md shadow-md min-h-min">
            <div className="m-5">
              <label className="block text-sm text-neutral-600 font-bold mb-2">
                Title: <span className="text-red-500">*</span>
              </label>
              <Form.Item
                name="title"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "Article title cannot be empty!",
                  },
                ]}
              >
                <Input size="large" />
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
                    message: "Slug cannot be empty!",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
            </div>

            <div className="m-5">
              <label className="block text-sm text-neutral-600 font-bold mb-2">
                Summary: <span className="text-red-500">*</span>
              </label>
              <Form.Item
                name="summary"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "Summary cannot be empty!",
                  },
                ]}
              >
                <Input.TextArea size="large" rows={4} />
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
                    message: "SEO keywords cannot be empty!",
                  },
                ]}
              >
                <Input size="large" />
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
                    message: "SEO title cannot be empty!",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
            </div>

            <div className="m-5">
              <label className="block text-sm text-neutral-600 font-bold mb-2">
                SEO Description: <span className="text-red-500">*</span>
              </label>
              <Form.Item name="seo_description" style={{ marginBottom: 10 }}>
                <CustomEditor
                  value={form.getFieldValue("seo_description")}
                  onChange={(content) =>
                    form.setFieldsValue({ seo_description: content })
                  }
                  height={300}
                />
              </Form.Item>
            </div>

            <div className="m-5">
              <label className="block text-sm text-neutral-600 font-bold mb-2">
                Description: <span className="text-red-500">*</span>
              </label>
              <Form.Item name="description" style={{ marginBottom: 10 }}>
                <CustomEditor
                  value={form.getFieldValue("description")}
                  onChange={(content) =>
                    form.setFieldsValue({ description: content })
                  }
                  height={600}
                />
              </Form.Item>
            </div>
          </div>

          <div className="bg-white lg:w-[40rem] rounded-lg shadow-md h-full flex flex-col justify-between p-5">
            <Form form={form} layout="vertical" onFinish={handleCreate}>
              <div>
                <label className="block text-sm text-neutral-600 font-bold mb-2">
                  Upload Thumbnail Image:{" "}
                  <span className="text-red-500">*</span>
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
                  <div className="flex justify-center items-center rounded-lg">
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
              </div>

              <div>
                <label className="block text-sm text-neutral-600 font-bold mb-2">
                  Article category: <span className="text-red-500">*</span>
                </label>
                <Form.Item
                  name="articleCategoryId"
                  rules={[
                    {
                      required: true,
                      message: "Category cannot be empty!",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    options={articleCategories.map((cat) => ({
                      label: cat.name,
                      value: cat._id,
                    }))}
                  />
                </Form.Item>
              </div>

              <div>
                <label className="block text-sm text-neutral-600 font-bold mb-2">
                  Status:
                </label>
                <Form.Item
                  name="status"
                  initialValue={false}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </div>

              <div>
                <label className="block text-sm text-neutral-600 font-bold mb-2">
                  Popular:
                </label>
                <Form.Item
                  name="popular"
                  initialValue={false}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </div>
            </Form>
            <Button
              loading={loading}
              type="primary"
              onClick={() => form.submit()}
              className="w-full"
              size="large"
            >
              Create
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateArticle;
