import { Button, Form, Input, Modal, Steps } from "antd";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { forgotPassword, retryPassword } from "../../../services/user";

const ModalForgotPassword = ({ isModalPassword, setModalPassword }) => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [userEmail, setUserEmail] = useState("");

  const onFinishStep0 = async (value) => {
    try {
      const result = await retryPassword(value);
      setCurrent(1);
      setUserEmail(result.data.email);
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const onFinishStep1 = async (data) => {
    try {
      const result = await forgotPassword({ ...data, email: userEmail });
      setCurrent(2);
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const resetModal = () => {
    setCurrent(0);
    setUserEmail("");
    form.resetFields();
    setModalPassword(false);
  };

  const handleRetryEmail = () => {
    setUserEmail("");
    setCurrent(0);
    form.resetFields();
  };

  return (
    <Modal
      title="Change password user!"
      open={isModalPassword}
      onOk={resetModal}
      onCancel={resetModal}
      maskClosable={false}
      footer={null}
      className="max-w-lg mx-auto px-4 lg:top-28 top-40"
    >
      <Steps
        current={current}
        items={[
          {
            title: "Login",
            icon: <UserOutlined />,
          },
          {
            title: "Verification",
            icon: <SolutionOutlined />,
          },
          {
            title: "Done",
            icon: <SmileOutlined />,
          },
        ]}
      />
      {current === 0 && (
        <>
          <div style={{ margin: "20px 0" }}>
            <p>You need to activate your account by verifying your email!</p>
          </div>
          <Form
            name="verify"
            onFinish={onFinishStep0}
            autoComplete="off"
            layout="vertical"
            form={form}
          >
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item>
              <div className="flex gap-2 justify-end">
                <Button onClick={() => setModalPassword(false)}>Cancle</Button>
                <Button type="primary" htmlType="submit">
                  Resend
                </Button>
              </div>
            </Form.Item>
          </Form>
        </>
      )}

      {current === 1 && (
        <>
          <div style={{ margin: "20px 0" }}>
            <p>Please reset the password!</p>
          </div>

          <Form
            name="change-pass-2"
            onFinish={onFinishStep1}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Code"
              name="codeId"
              rules={[
                {
                  required: true,
                  message: "Please input your code!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="New password"
              name="password"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
                {
                  min: 6,
                  message: "The password must contain at least 6 characters!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Confirm password"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please input confirm password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The passwords do not match. Please check again!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <div className="flex gap-2 justify-end">
                <Button onClick={handleRetryEmail}>Resend Email</Button>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </div>
            </Form.Item>
          </Form>
        </>
      )}

      {current === 2 && (
        <div style={{ margin: "20px 0" }}>
          <div className="flex gap-2 items-center">
            Password changed successfully!
            <Button type="primary" onClick={resetModal}>
              Login again
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalForgotPassword;
