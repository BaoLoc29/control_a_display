import React from "react";
import { Link } from "react-router-dom";
import { Button, Input, Form } from "antd";
import { FiLogIn } from "react-icons/fi";

const Login = () => {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8"
      style={{
        backgroundImage:
          "url('https://st3.depositphotos.com/7138812/36699/v/600/depositphotos_366993736-stock-video-abstract-white-modern-shape-line.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 1,
      }}
    >
      <div className="border border-gray-300 p-4 rounded-lg shadow-lg py-10 w-full max-w-md bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login
          </h2>
        </div>

        <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form
            className="space-y-4 md:space-y-6"
            name="login"
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              label={<span className="font-bold">E-mail</span>}
              name="email"
              className="block w-full sm:text-sm sm:leading-6"
              size="large"
              rules={[
                {
                  required: true,
                  message: "Email người dùng là bắt buộc!",
                },
                {
                  min: 6,
                  message: "Email người dùng phải từ 6 kí tự trở lên!",
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
                  message: "Mật khẩu là bắt buộc!",
                },
                {
                  min: 6,
                  message: "Mật khẩu phải từ 6 kí tự trở lên!",
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
                    Nhớ tôi
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
              // loading={loading}
              icon={<FiLogIn fontSize={20} />}
              type="primary"
              htmlType="submit"
              className="flex items-center justify-center w-full h-[3rem] bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded-lg"
            >
              Đăng nhập
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
