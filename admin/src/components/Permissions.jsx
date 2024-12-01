import React, { useCallback, useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Popconfirm,
  Table,
  Pagination,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  createPermission,
  deletePermission,
  editPermission,
  getPagingPermission,
  searchPermission,
} from "../services/permission.js";
import toast from "react-hot-toast";
import ModalCreatePermission from "./Auth/ModalCreatePermission/index.jsx";

const Permissions = () => {
  const [form] = Form.useForm();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDoc, setTotalDoc] = useState(0);
  const [modalPermission, setModalPermission] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTotalDoc, setSearchTotalDoc] = useState(0);
  const [searchPageIndex, setSearchPageIndex] = useState(1);

  const handleOpenEditModal = (id) => {
    setModalPermission(true);
    setSelectedPermission(id);
  };

  const handelCloseModal = () => {
    form.resetFields();
    setModalPermission(false);
    setSelectedPermission(null);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await deletePermission(id);
      setPermissions(permissions.filter((permission) => permission._id !== id));
      toast.success(result.data.message);
      handleClearSearch();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (pageIndex - 1) * pageSize + index + 1,
      align: "center",
    },
    {
      title: "Permission name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text) => text || "Loading...",
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
              className="text-blue-500 text-2xl hover:text-blue-700 cursor-pointer"
              onClick={() => handleOpenEditModal(row._id)}
            />
            <Popconfirm
              placement="left"
              title="Delete permission!"
              description="Are you sure you want to delete this permission?"
              onConfirm={() => handleDelete(row._id)}
              okText="Ok"
              cancelText="Cancel"
              style={{ cursor: "pointer" }}
            >
              <MdDelete className="text-red-500 text-2xl hover:text-red-700 cursor-pointer" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  // getPermission
  const getPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getPagingPermission({ pageSize, pageIndex });
      setPermissions(result.data.permission);
      setTotalPages(result.data.totalPages);
      setTotalDoc(result.data.count);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [pageSize, pageIndex]);

  useEffect(() => {
    getPermissions();
  }, [getPermissions]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchQuery.trim() !== "") {
        const response = await searchPermission(searchQuery);
        setSearchResults(response.data.permission);
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
    getPermissions();
  };

  const handlePaginationChange = (pageIndex, pageSize) => {
    if (searchQuery.trim() === "") {
      setPageSize(pageSize);
      setPageIndex(pageIndex);
    } else {
      setSearchPageIndex(pageIndex);
      handleSearch(pageSize);
      console.log(totalPages);
    }
  };

  const handleCreate = async (values) => {
    try {
      setLoading(true);
      if (!selectedPermission) {
        const result = await createPermission(values);
        setPermissions([result.data.result, ...permissions]);
        toast.success(result.data.message);
      } else {
        const result = await editPermission(selectedPermission, values);
        setPermissions(
          permissions.map((permission) => {
            if (permission._id === selectedPermission) {
              return result.data.permission;
            }
            return permission;
          })
        );
        toast.success(result.data.message);
        setSelectedPermission(null);
      }
      setModalPermission(false);
      handleClearSearch();
      form.resetFields();
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      setLoading(false);
    }
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
              title: "Auth",
            },
            {
              title: "Permissions",
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
            onClick={() => setModalPermission(true)}
          >
            Create new
          </Button>
        </div>
      </div>
      <Table
        className="shadow-md mt-2"
        loading={loading}
        columns={columns}
        dataSource={searchResults.length > 0 ? searchResults : permissions}
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
      <ModalCreatePermission
        form={form}
        loading={loading}
        title={selectedPermission ? "Update permission" : "Create permission"}
        isModalOpen={modalPermission}
        handleCancel={handelCloseModal}
        handleOk={handleCreate}
        selectedPermission={selectedPermission}
      />
    </div>
  );
};

export default Permissions;
