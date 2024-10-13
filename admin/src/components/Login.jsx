import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Form } from "antd";
import { FiLogIn } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { login as loginAction } from "../feature/user/userSlice";
import { login } from "../services/user";
import { toast } from "react-hot-toast";

import {
  saveTokenToLocalStorage,
  saveUserToLocalStorage,
} from "../utils/localstorage";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  console.log(user);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const result = await login(values);
      if (result.data.success) {
        dispatch(loginAction({ user: result.data.user }));
        saveTokenToLocalStorage(result.data.accessToken);
        saveUserToLocalStorage(result.data.user);
        toast.success("Login successful!");
        navigate("/");
      } else {
        const errorMessage = result.data.error || "Login failed";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Login failed:", errorInfo);
  };
  // sm (Small): Kích thước màn hình nhỏ, thường là điện thoại di động. (>= 640px)
  // md (Medium): Kích thước màn hình trung bình, như máy tính bảng. (>= 768px)
  // lg (Large): Kích thước màn hình lớn, như laptop nhỏ hoặc máy tính bảng cỡ lớn. (>= 1024px)
  return (
    <div
      // Khi màn hình laptop thì center
      // Khi màn hình điện thoại thì start
      className="flex min-h-screen justify-center items-start lg:px-8 sm:items-center px-4 py-8 sm:px-6"
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
              onFinishFailed={onFinishFailed}
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
                <Link
                  to="#"
                  className="text-sm font-medium text-black hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </Link>
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
    </div>
  );
};

export default Login;
