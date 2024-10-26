import React, { useState, useEffect, useRef } from "react";
import { FaLock } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { getUserProfile, editUser, changePassword } from "../services/user";
import { Breadcrumb, Form, Input } from "antd";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState("info");
  const [userProfile, setUserProfile] = useState({});
  const initialValuesRef = useRef(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const handleButtonClick = (button) => {
    setActiveButton(button === "info" ? "info" : "password");
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await getUserProfile();
        setUserProfile(result.data.user);
        form.setFieldsValue({
          name: result.data.user.name,
          email: result.data.user.email,
          role: result.data.user.role,
        });
        if (!initialValuesRef.current) {
          initialValuesRef.current = result.data.user;
        }
      } catch (error) {
        console.error("User is not found", error);
      }
    };

    getUser();
  }, [form]);

  // edit user
  const handleEditUser = async (values) => {
    try {
      setLoading(true);
      const result = await editUser(userProfile._id, values);
      if (result.data.success) {
        setUserProfile(result.data.user);
        toast.success("User information updated successfully.");
        window.location.reload();
      } else if (result.data.message) {
        toast.error(result.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user information!");
    } finally {
      setLoading(false);
    }
  };

  // change password
  const handleChangePassword = async (oldPassword, newPassword) => {
    try {
      setLoading(true);
      const result = await changePassword(
        userProfile._id,
        oldPassword,
        newPassword
      );
      if (result.data.success) {
        setUserProfile(result.data.user);
        toast.success("Change password successful!");
        navigate("/");
      } else {
        const errorMessage = result.data.error || "Change password faild!";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Change password faild!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Breadcrumb
        className="mb-5"
        items={[
          {
            title: "Home",
          },
          {
            title: "User",
          },
          {
            title: "Profile",
          },
        ]}
      />
      <div className="flex flex-col md:flex-row gap-3 w-full">
        {/* Sidebar con */}
        <div className="w-full md:w-1/4 lg:w-1/5 h-auto md:h-[22rem] rounded-sm flex flex-col">
          <div className="space-y-4">
            <button
              className={`flex items-center gap-2 pl-3 w-full h-[2.5rem] text-white text-base md:text-lg ${
                activeButton === "info"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-500 hover:bg-gray-600"
              }`}
              onClick={() => handleButtonClick("info")}
            >
              <IoSettings />
              Sửa thông tin nhân viên
            </button>
            <button
              className={`flex items-center gap-2 pl-3 w-full h-[2.5rem] text-white text-base md:text-lg ${
                activeButton === "password"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-500 hover:bg-gray-600"
              }`}
              onClick={() => handleButtonClick("password")}
            >
              <FaLock />
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* Thanh phân tách dọc */}
        <div className="hidden md:block w-[1px] bg-gray-300"></div>

        {/* Edit User */}
        <div
          className={`info rounded-sm flex flex-col flex-1 ${
            activeButton === "info" ? "" : "hidden"
          }`}
        >
          <Form form={form} name="userInfo" onFinish={handleEditUser}>
            <label htmlFor="name" className="block text-base font-bold">
              Full name: <span className="text-red-500">*</span>
            </label>
            <Form.Item
              name="name"
              style={{ marginTop: 10 }}
              rules={[
                {
                  type: "text",
                  message: "Họ và tên không đúng định dạng!",
                },
                {
                  required: true,
                  message: "Họ và tên không được để trống!",
                },
              ]}
            >
              <Input className="h-[2.75rem] text-base" loading={loading} />
            </Form.Item>

            <label htmlFor="email" className="block text-base font-bold">
              E-mail: <span className="text-red-500">*</span>
            </label>
            <Form.Item
              name="email"
              style={{ marginTop: 10 }}
              rules={[
                {
                  type: "email",
                  message: "Email không đúng định dạng!",
                },
                {
                  required: true,
                  message: "Email không được để trống!",
                },
              ]}
            >
              <Input className="h-[2.75rem] text-base" loading={loading} />
            </Form.Item>

            <label htmlFor="role" className="block text-base font-bold">
              Role: <span className="text-red-500">*</span>
            </label>
            <Form.Item name="role" style={{ marginTop: 10 }}>
              <Input className="h-[2.75rem] text-base" disabled />
            </Form.Item>

            <div className="w-1/3 flex justify-between">
              <button
                loading={loading}
                htmlType="submit"
                className="w-full md:w-[15rem] h-[2.75rem] bg-green-500 hover:bg-green-600 text-white text-base font-bold rounded-sm"
              >
                Lưu thay đổi
              </button>
            </div>
          </Form>
        </div>

        {/* Change password */}
        <div
          className={`password rounded-sm flex flex-col flex-1 ${
            activeButton === "password" ? "" : "hidden"
          }`}
        >
          <Form onFinish={handleChangePassword}>
            <label htmlFor="address" className="block text-base font-bold">
              Mật khẩu cũ: <span className="text-red-500">*</span>
            </label>
            <Form.Item
              name="oldPassword"
              style={{ marginTop: 10 }}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu trước đây!",
                },
                {
                  min: 6,
                  message: "Mật khẩu phải chứa ít nhất 6 ký tự!",
                },
              ]}
            >
              <Input.Password
                className="h-[2.75rem] text-base"
                loading={loading}
              />
            </Form.Item>

            <label htmlFor="address" className="block text-base font-bold">
              Mật khẩu mới: <span className="text-red-500">*</span>
            </label>
            <Form.Item
              name="newPassword"
              style={{ marginTop: 10 }}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Mật khẩu mới không được để trống!",
                },
                {
                  min: 6,
                  message: "Mật khẩu phải chứa ít nhất 6 ký tự!",
                },
              ]}
            >
              <Input.Password
                className="h-[2.75rem] text-base"
                loading={loading}
              />
            </Form.Item>

            <label htmlFor="address" className="block text-base font-bold">
              Nhập lại mật khẩu mới: <span className="text-red-500">*</span>
            </label>
            <Form.Item
              name="confirmPassword"
              style={{ marginTop: 10 }}
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                {
                  min: 6,
                  message: "Mật khẩu phải chứa ít nhất 6 ký tự!",
                },
                {
                  required: true,
                  message: "Trường này không được để trống!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu không khớp. Vui lòng kiểm tra lại!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                className="h-[2.75rem] text-base"
                loading={loading}
              />
            </Form.Item>
            <div className="w-1/3 flex justify-between">
              <button
                loading={loading}
                htmlType="submit"
                className="w-full md:w-[15rem] h-[2.75rem] bg-green-500 hover:bg-green-600 text-white text-base font-bold rounded-sm"
              >
                Lưu thay đổi
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
