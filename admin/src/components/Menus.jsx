import React, { useCallback, useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Input,
  Popconfirm,
  Table,
  Pagination,
  Form,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  createMenu,
  deleteMenu,
  editMenu,
  getPagingMenu,
  searchMenu,
} from "../services/menu.js";
import toast from "react-hot-toast";
import ModalCreateMenu from "./Blog/ModalCreateMenu/index.jsx";

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDoc, setTotalDoc] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTotalDoc, setSearchTotalDoc] = useState(0);
  const [searchPageIndex, setSearchPageIndex] = useState(1);
  const [modalCreateMenu, setModalCreateMenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [form] = Form.useForm();

  const handleOpenEditModal = (menuId) => {
    setModalCreateMenu(true);
    setSelectedMenu(menuId);
  };

  const handelCloseModal = () => {
    form.resetFields();
    setModalCreateMenu(false);
    setSelectedMenu(null);
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (pageIndex - 1) * pageSize + index + 1,
      align: "center",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
      align: "center",
      render: (text) => text || "Loading...",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (text) => text || "Loading...",
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: 100,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => text || "Loading...",
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      width: 100,
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
              onClick={() => handleOpenEditModal(row._id)}
              className="text-blue-500 text-2xl hover:text-blue-700 cursor-pointer"
            />
            <Popconfirm
              placement="left"
              title="Delete menu"
              description="Are you sure you want to delete this menu?"
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

  const getMenus = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getPagingMenu({ pageSize, pageIndex });
      setMenus(result.data.menus);
      setTotalPages(result.data.totalPages);
      setTotalDoc(result.data.count);
    } catch (error) {
      console.error("Failed to retrieve menu data.", error);
    } finally {
      setLoading(false);
    }
  }, [pageSize, pageIndex]);

  useEffect(() => {
    getMenus();
  }, [getMenus]);

  const handlePaginationChange = (pageIndex, pageSize) => {
    if (searchQuery.trim() === "") {
      setPageSize(pageSize);
      setPageIndex(pageIndex);
      getMenus();
    } else {
      setSearchPageIndex(pageIndex);
      handleSearch(pageSize);
      console.log(totalPages);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await deleteMenu(id);
      setMenus(menus.filter((item) => item._id !== id));
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenu = async (value) => {
    try {
      setLoading(true);
      const { confirm, ...dataToSend } = value;
      if (!selectedMenu) {
        const result = await createMenu(dataToSend);
        setMenus([result.data.result, ...menus]);
        toast.success(result.data.message);
      } else {
        const result = await editMenu(selectedMenu, value);
        setMenus(
          menus.map((menu) => {
            if (menu._id === selectedMenu) {
              return result.data.menu;
            }
            return menu;
          })
        );
        toast.success(result.data.message);
        setSelectedMenu(null);
      }
      setModalCreateMenu(false);
      handleClearSearch();
      form.resetFields();
    } catch (error) {
      toast.error(
        selectedMenu ? error.response.data.message : error.response.data.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchQuery.trim() !== "") {
        const response = await searchMenu(searchQuery);
        setSearchResults(response.data.menus);
        setSearchTotalDoc(response.data.count);
        setSearchPageIndex(1);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchPageIndex(1);
    getMenus();
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
              title: "Menu",
            },
          ]}
        />
        <div className="flex flex-col lg:flex-row w-full gap-2 lg:justify-between">
          <Input
            placeholder="Search..."
            className="w-full lg:w-1/2"
            size="large"
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
            onClick={() => setModalCreateMenu(true)}
          >
            Create new
          </Button>
        </div>
      </div>
      <Table
        className="shadow-md mt-2"
        loading={loading}
        columns={columns}
        dataSource={searchResults.length > 0 ? searchResults : menus}
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
      <ModalCreateMenu
        form={form}
        loading={loading}
        title={selectedMenu ? "Update menu" : "Create menu"}
        isModalOpen={modalCreateMenu}
        handleCancel={handelCloseModal}
        handleOk={handleCreateMenu}
        selectedMenu={selectedMenu}
      />
    </div>
  );
};

export default Menus;
