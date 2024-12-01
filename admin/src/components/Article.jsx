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
  deleteArticle,
  getArticle,
  searchArticle,
} from "../services/article.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Article = () => {
  const [articles, setArticles] = useState([]);
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

  const handleOpenEdit = (articleId) => {
    navigate(`/article/edit/${articleId}`);
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "justify",
      width: 300,
      render: (text) => text || "Loading...",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      align: "center",
      render: (text) => text || "Loading...",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (status ? "Active" : "Inactive"),
    },
    {
      title: "Popular",
      dataIndex: "popular",
      key: "popular",
      align: "center",
      render: (popular) => (popular ? "Active" : "Inactive"),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      align: "center",
      render: (author) => (author ? author.name : "Loading..."),
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => text || "Loading...",
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      render: (text) => text || "Loading...",
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
              placement="left"
              title="Delete article  "
              description="Are you sure you want to delete article  ?"
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

  const getArticles = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getArticle({ pageSize, pageIndex });
      setArticles(result.data.articles);
      setTotalPages(result.data.totalPages);
      setTotalDoc(result.data.count);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [pageSize, pageIndex]);

  useEffect(() => {
    getArticles();
  }, [getArticles]);

  const handlePaginationChange = (pageIndex, pageSize) => {
    if (searchQuery.trim() === "") {
      setPageSize(pageSize);
      setPageIndex(pageIndex);
      getArticles();
    } else {
      setSearchPageIndex(pageIndex);
      handleSearch(pageSize);
      console.log(totalPages);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await deleteArticle(id);
      setArticles(articles.filter((item) => item._id !== id));
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchQuery.trim() !== "") {
        const response = await searchArticle(searchQuery);
        setSearchResults(response.data.articles);
        setSearchTotalDoc(response.data.count);
        setSearchPageIndex(1);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchPageIndex(1);
    getArticles();
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
              title: "Article",
            },
          ]}
        />
        <div className="flex flex-col lg:flex-row w-full gap-2 lg:justify-between">
          <Input
            placeholder="Search..."
            size="large"
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
            size="large"
            icon={<PlusOutlined />}
            onClick={() => {
              navigate("/article/create");
            }}
          >
            Create new
          </Button>
        </div>
      </div>
      <Table
        className="shadow-md mt-2 overflow-x-auto"
        loading={loading}
        columns={columns}
        dataSource={searchResults.length > 0 ? searchResults : articles}
        pagination={false}
        scroll={{ x: "max-content" }}
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

export default Article;
