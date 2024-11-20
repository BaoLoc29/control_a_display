import React, { useCallback, useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Pagination,
  Tag,
} from "antd";
import { TiDelete } from "react-icons/ti";
import { PlusOutlined } from "@ant-design/icons";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  createRole,
  deleteRole,
  editRole,
  getPagingRole,
  searchRole,
} from "../services/role.js";
import toast from "react-hot-toast";
import ModalCreateRole from "./Auth/ModalCreateRole/index.jsx";

const Roles = () => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDoc, setTotalDoc] = useState(0);
  const [modalCreateRole, setModalCreateRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("name");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTotalDoc, setSearchTotalDoc] = useState(0);
  const [searchPageIndex, setSearchPageIndex] = useState(1);

  const options = [
    { value: "name", label: "Role Name" },
    { value: "permissions", label: "Permissions" },
  ];

  const handleOpenEditModal = (roleId) => {
    setModalCreateRole(true);
    setSelectedRole(roleId);
  };

  const handelCloseModal = () => {
    form.resetFields();
    setModalCreateRole(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = async (roleId) => {
    try {
      setLoading(true);
      const result = await deleteRole(roleId);
      setRoles(roles.filter((role) => role._id !== roleId));
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
      width: 50,
    },
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 150,
      render: (text) => text || "Loading...",
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      width: 500,
      render: (permissions) => (
        <div className="flex flex-wrap gap-y-2">
          {Array.isArray(permissions) ? (
            permissions.map((permission) => (
              <Tag key={permission}>{permission}</Tag>
            ))
          ) : (
            <Tag>Loading...</Tag>
          )}
        </div>
      ),
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
      width: 100,
      render: (row) => {
        return (
          <div className="flex gap-2 justify-center">
            <FaEdit
              className="text-blue-500 text-2xl hover:text-blue-700 cursor-pointer"
              onClick={() => handleOpenEditModal(row._id)}
            />
            <Popconfirm
              placement="left"
              title="Delete role user"
              description="Are you sure you want to delete this role?"
              onConfirm={() => handleDeleteRole(row._id)}
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

  // getRole
  const getRoles = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getPagingRole({ pageSize, pageIndex });
      setRoles(result.data.roles);
      setTotalPages(result.data.totalPages);
      setTotalDoc(result.data.count);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [pageSize, pageIndex]);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchQuery.trim() !== "") {
        const response = await searchRole(searchQuery, selectedOption);
        setSearchResults(response.data.roles);
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
    getRoles();
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

  const handleCreateRole = async (value) => {
    try {
      setLoading(true);
      if (!selectedRole) {
        const result = await createRole(value);
        setRoles([result.data.result, ...roles]);
        toast.success(result.data.message);
      } else {
        const result = await editRole(selectedRole, value);
        setRoles(
          roles.map((role) => {
            if (role._id === selectedRole) {
              return result.data.role;
            }
            return role;
          })
        );
        toast.success(result.data.message);
        setSelectedRole(null);
      }
      setModalCreateRole(false);
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
              title: "Roles",
            },
          ]}
        />
        <div className="flex flex-col lg:flex-row w-full gap-2 lg:justify-between">
          <Space.Compact className="w-full lg:w-[32rem] relative">
            <Select
              defaultValue="Role Name"
              options={options}
              onChange={(value) => setSelectedOption(value)}
            />
            <Input
              placeholder="Search..."
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
            icon={<PlusOutlined />}
            onClick={() => setModalCreateRole(true)}
          >
            Create role
          </Button>
        </div>
      </div>
      <Table
        className="shadow-md mt-2"
        loading={loading}
        columns={columns}
        dataSource={searchResults.length > 0 ? searchResults : roles}
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
      <ModalCreateRole
        form={form}
        loading={loading}
        title={selectedRole ? "Update Role" : "Create Role"}
        isModalOpen={modalCreateRole}
        handleCancel={handelCloseModal}
        handleOk={handleCreateRole}
        selectedRole={selectedRole}
      />
    </div>
  );
};

export default Roles;
