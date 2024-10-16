import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  Pagination,
  Form,
  Button,
  Popconfirm,
  Space,
  Select,
  Input,
  Breadcrumb,
} from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import ModalCreatUser from "./ModalCreateUser/index.jsx";
import {
  getPagingUser,
  createUser,
  deleteUser,
  editUser,
  searchUser,
} from "../services/user.js";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDoc, setTotalDoc] = useState(0);
  const [modalCreateUser, setModalCreateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("e_code");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTotalDoc, setSearchTotalDoc] = useState(0);
  const [searchPageIndex, setSearchPageIndex] = useState(1);

  const handleOpenEditModal = (userId) => {
    setModalCreateUser(true);
    setSelectedUser(userId);
  };

  const handelCloseModal = () => {
    form.resetFields();
    setModalCreateUser(false);
    setSelectedUser(null);
  };

  const options = [
    { value: "name", label: "Name" },
    { value: "email", label: "E-mail" },
  ];

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (pageIndex - 1) * pageSize + index + 1,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
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
              title="Delete employee account"
              description="Are you sure you want to delete this account?"
              onConfirm={() => handleDeleteUser(row._id)}
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

  const [form] = Form.useForm();

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getPagingUser({ pageSize, pageIndex });
      setUsers(result.data.users);
      setTotalPages(result.data.totalPages);
      setTotalDoc(result.data.count);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [pageSize, pageIndex]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleCreateUser = async (value) => {
    try {
      setLoading(true);
      const { confirm, ...dataToSend } = value;
      if (!selectedUser) {
        const result = await createUser(dataToSend);
        if (result.data.success) {
          setUsers([result.data.result, ...users]);
          toast.success("Created user successfully!");
        } else {
          const errorMessage = result.data.error || "Created user faild!";
          toast.error(errorMessage);
        }
      } else {
        const result = await editUser(selectedUser, value);
        if (result.data.success) {
          setUsers(
            users.map((user) => {
              if (user._id === selectedUser) {
                return result.data.user;
              }
              return user;
            })
          );
          toast.success("Updated user successfully!");
          setSelectedUser(null);
        } else {
          const errorMessage = result.data.error || "Updated user failed!";
          toast.error(errorMessage);
        }
      }
      setModalCreateUser(false);
      handleClearSearch();
      form.resetFields();
    } catch (error) {
      console.log(error);
      toast.error(
        selectedUser ? "Updated user failed!" : "Created user faild!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      await deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("Deleted user successfully!");
      handleClearSearch();
    } catch (error) {
      console.log(error);
      toast.error("Deleted user faild!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchQuery.trim() !== "") {
        const response = await searchUser(
          searchQuery,
          selectedOption,
          searchPageIndex,
          pageSize
        );
        const searchResults = response.data.users;
        setSearchResults(searchResults);
        setSearchTotalDoc(response.data.count);
        setSearchPageIndex(1);
      }
    } catch (error) {
      toast.error("User isn't found!");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    getUsers();
  };

  const handlePaginationChange = (pageIndex, pageSize) => {
    if (searchQuery.trim() === "") {
      setPageSize(pageSize);
      setPageIndex(pageIndex);
    } else {
      setPageSize(pageSize);
      setSearchPageIndex(pageIndex);
      handleSearch();
      console.log(totalPages);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex justify-between items-center px-2 pb-4 pr-4 pl-4 pt-0">
        <Breadcrumb
          className="text-sm"
          items={[
            {
              title: "Home",
            },
            {
              title: "Auth",
            },
            {
              title: "Users",
            },
          ]}
        />
        <Space.Compact className="w-[32rem] relative">
          <Select
            size="large"
            defaultValue="e_code"
            options={options}
            className="w-[10rem]"
            onChange={(value) => setSelectedOption(value)}
          />
          <Input
            size="large"
            placeholder="Nhập từ khóa tìm kiếm ...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={handleSearch}
          />
          {searchQuery && (
            <TiDelete
              className="text-gray-400 text-xl absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer z-10"
              onClick={handleClearSearch}
            />
          )}
        </Space.Compact>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setModalCreateUser(true)}
        >
          Create user
        </Button>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={searchResults.length > 0 ? searchResults : users}
        pagination={false}
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
      <ModalCreatUser
        form={form}
        loading={loading}
        title={selectedUser ? "Update user" : "Create user"}
        isModalOpen={modalCreateUser}
        handleCancel={handelCloseModal}
        handleOk={handleCreateUser}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default Users;
