import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, Form } from "antd";
import { toast } from "react-hot-toast";
import {
  getUserProfile,
  editUser,
  changePassword,
  changeEmail,
} from "../services/user.js";
import Sidebar from "./Auth/Profile/SideBar/index";
import ChangeEmail from "./Auth/Profile/ChangeEmail/index";
import ChangePassword from "./Auth/Profile/ChangePassword/index";
import ChangeUser from "./Auth/Profile/ChangeUser/index";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState("info");
  const [userProfile, setUserProfile] = useState({});
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  // Hàm getUser
  const getUser = useCallback(async () => {
    try {
      const result = await getUserProfile();
      setUserProfile(result.data.user);
      setOldEmail(result.data.user.email);
      form.setFieldsValue({
        name: result.data.user.name,
        email: result.data.user.email,
        roleId: result.data.user.roleId,
      });
    } catch (error) {
      console.error("User is not found", error);
    }
  }, [form]);

  // Gọi getUser khi component mount
  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleEditUser = async (values) => {
    try {
      setLoading(true);
      const result = await editUser(userProfile._id, values);
      setUserProfile(result.data.user);
      toast.success(result.data.message);
      navigate("/my-profile");
      if (values.email !== oldEmail) {
        setNewEmail(values.email);
        setActiveButton("email");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (oldPassword, newPassword) => {
    try {
      setLoading(true);
      const result = await changePassword(
        userProfile._id,
        oldPassword,
        newPassword
      );
      setUserProfile(result.data.user);
      toast.success(result.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async (values) => {
    try {
      setLoading(true);
      const result = await changeEmail(values);
      setUserProfile(result.data.user);
      toast.success(result.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleCancel = () => {
    getUser();
  };
  return (
    <div className="bg-white p-4 h-[37rem] shadow-md rounded-lg">
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
        <Sidebar
          activeButton={activeButton}
          handleButtonClick={handleButtonClick}
        />

        <div className="hidden md:block w-[1px] bg-gray-300"></div>

        <div className="w-full md:w-3/4 lg:w-4/5">
          {activeButton === "info" && (
            <ChangeUser
              form={form}
              loading={loading}
              handleCancel={handleCancel}
              handleEditUser={handleEditUser}
            />
          )}
          {activeButton === "password" && (
            <ChangePassword
              loading={loading}
              handleCancel={handleCancel}
              handleChangePassword={handleChangePassword}
            />
          )}
          {activeButton === "email" && (
            <ChangeEmail
              loading={loading}
              handleCancel={handleCancel}
              handleChangeEmail={handleChangeEmail}
              oldEmail={oldEmail}
              newEmail={newEmail}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
