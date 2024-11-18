import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Form } from "antd";
import { FiLogIn } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../feature/user/userSlice";
import { login } from "../services/user";
import { toast } from "react-hot-toast";

import {
  saveTokenToLocalStorage,
  saveUserToLocalStorage,
} from "../utils/localstorage";
import ModalRetryActive from "./Auth/ModalRetryActive";
import ModalForgotPassword from "./Auth/ModalForgotPassword";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPassword, setModalPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(values);
      const { isActive, accessToken, user, email, message } = result.data;

      if (isActive === false) {
        console.log(result.data.isActive);
        setUserEmail(email);
        setIsModalOpen(true);
      } else {
        dispatch(loginAction({ user }));
        saveTokenToLocalStorage(accessToken);
        saveUserToLocalStorage(user);
        toast.success(message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPass = async () => {
    setModalPassword(true);
  };

  // sm (Small): Kích thước màn hình nhỏ, thường là điện thoại di động. (>= 640px)
  // md (Medium): Kích thước màn hình trung bình, như máy tính bảng. (>= 768px)
  // lg (Large): Kích thước màn hình lớn, như laptop nhỏ hoặc máy tính bảng cỡ lớn. (>= 1024px)
  return (
    <div
      // Khi màn hình laptop thì center
      // Khi màn hình điện thoại thì start
      className="flex min-h-screen justify-center items-center lg:px-8 px-4 py-8 sm:px-6"
      style={{
        backgroundImage:
          "url('https://st3.depositphotos.com/7138812/36699/v/600/depositphotos_366993736-stock-video-abstract-white-modern-shape-line.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="border border-gray-300 p-5 rounded-lg shadow-lg w-full max-w-md bg-white sm:w-full">
        <div className="border border-neutral-300 w-full rounded-lg p-5">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="text-center text-3xl font-bold font-mono tracking-tight text-gray-900">
              Login
            </h2>
          </div>

          <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
            <Form
              className="space-y-4 md:space-y-6"
              name="login"
              layout="vertical"
              initialValues={{}}
              onFinish={onFinish}
            >
              <Form.Item
                label={<span className="font-bold">E-mail</span>}
                name="email"
                className="block w-full sm:text-sm sm:leading-6"
                size="large"
                rules={[
                  {
                    required: true,
                    message: "User email is required!",
                  },
                  {
                    min: 6,
                    message: "User email must be at least 6 characters long!",
                  },
                ]}
              >
                <Input
                  placeholder="E-mail Address"
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-white border-gray-600 text-black"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold">Password</span>}
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Password is required!",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter Password"
                  className="border border-gray-30 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 bg-white border-gray-600 text-black"
                />
              </Form.Item>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="cursor-pointer w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="cursor-pointer text-gray-500"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <div
                  onClick={handleForgotPass}
                  className="cursor-pointer hover:text-blue-500 text-sm font-medium hover:underline"
                >
                  Forgot password?
                </div>
              </div>

              <Button
                loading={loading}
                icon={<FiLogIn fontSize={20} />}
                type="primary"
                htmlType="submit"
                className="flex items-center justify-center w-full h-[3rem] bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded-lg"
              >
                Login
              </Button>
            </Form>
          </div>
        </div>
      </div>
      <ModalRetryActive
        loading={loading}
        title={"Retry active email"}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        userEmail={userEmail}
      />
      <ModalForgotPassword
        loading={loading}
        title={"Forgot password"}
        isModalPassword={isModalPassword}
        setModalPassword={setModalPassword}
      />
    </div>
  );
};

export default Login;
