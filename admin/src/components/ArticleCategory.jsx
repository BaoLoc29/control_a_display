import React, { useCallback, useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Input,
  Popconfirm,
  Table,
  Image,
  Pagination,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  deleteArticleCategory,
  getArticleCategory,
  searchArticleCategory,
} from "../services/articleCategory.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ArticleCategory = () => {
  const [articleCategories, setArticleCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDoc, setTotalDoc] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTotalDoc, setSearchTotalDoc] = useState(0);
  const [searchPageIndex, setSearchPageIndex] = useState(1);
  const navigate = useNavigate();

  const handleOpenEdit = (id) => {
    navigate(`/article-category/edit/${id}`);
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (pageIndex - 1) * pageSize + index + 1,
      align: "center",
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      align: "center",
      render: (thumbnail) => <Image src={thumbnail} style={{ width: 50 }} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      align: "center",
    },
    {
      title: "SEO_Description",
      dataIndex: "seo_description",
      key: "seo_description",
      width: 200,
      align: "center",
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: 100,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      width: 100,
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (row) => {
        return (
          <div className="flex gap-2 justify-center">
            <FaEdit
              onClick={() => handleOpenEdit(row._id)}
              className="text-blue-500 text-2xl hover:text-blue-700 cursor-pointer"
            />
            <Popconfirm
              title="Delete article category"
              description="Are you sure you want to delete article category?"
              okText="Ok"
              cancelText="Cancel"
              style={{ cursor: "pointer" }}
              onConfirm={() => handleDelete(row._id)}
            >
              <MdDelete className="text-red-500 text-2xl hover:text-red-700 cursor-pointer" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  // getRole
  const getArticleCategories = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getArticleCategory({ pageSize, pageIndex });
      setArticleCategories(result.data.articleCategories);
      setTotalPages(result.data.totalPages);
      setTotalDoc(result.data.count);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [pageSize, pageIndex]);

  useEffect(() => {
    getArticleCategories();
  }, [getArticleCategories]);

  const handlePaginationChange = (pageIndex, pageSize) => {
    if (searchQuery.trim() === "") {
      setPageSize(pageSize);
      setPageIndex(pageIndex);
      getArticleCategories();
    } else {
      setSearchPageIndex(pageIndex);
      handleSearch(pageSize);
      console.log(totalPages);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await deleteArticleCategory(id);
      if (result.data.success) {
        setArticleCategories(
          articleCategories.filter((item) => item._id !== id)
        );
        toast.success("Article category deleted successfully!");
      } else {
        toast.error("Error deleting category.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchQuery.trim() !== "") {
        const response = await searchArticleCategory(searchQuery);
        const searchResults = response.data.articleCategories;
        setSearchResults(searchResults);
        setSearchTotalDoc(response.data.count);
        setSearchPageIndex(1);
      }
    } catch (error) {
      toast.error("Article category not found!");
    } finally {
      setLoading(false);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchPageIndex(1); // Reset search page index
    getArticleCategories();
  };

  return (
    <div>
      <div className="flex justify-between items-center pb-4 pt-0">
        <Breadcrumb
          className="text-sm hidden lg:block w-[30rem]"
          items={[
            {
              title: "Home",
            },
            {
              title: "Blogs",
            },
            {
              title: "Article Category",
            },
          ]}
        />
        <div className="flex flex-col lg:flex-row w-full gap-2 lg:justify-between">
          <Input
            placeholder="Search..."
            className="w-full lg:w-1/2"
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);

              if (value === "") {
                handleClearSearch();
              }
            }}
            onPressEnter={handleSearch}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              navigate("/article-category/create");
            }}
          >
            Create Category
          </Button>
        </div>
      </div>
      <Table
        className="shadow-md mt-2"
        loading={loading}
        columns={columns}
        dataSource={
          searchResults.length > 0 ? searchResults : articleCategories
        }
        pagination={false}
        scroll={{ x: 1000 }}
      />
      <Pagination
        className="mt-5 pb-5 float-right"
        defaultCurrent={1}
        current={searchQuery.trim() === "" ? pageIndex : searchPageIndex}
        total={searchQuery.trim() === "" ? totalDoc : searchTotalDoc}
        pageSize={pageSize}
        showSizeChanger
        onChange={handlePaginationChange}
      />
    </div>
  );
};

export default ArticleCategory;
