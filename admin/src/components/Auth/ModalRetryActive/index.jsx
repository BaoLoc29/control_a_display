import { Button, Form, Input, Modal, Steps } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { checkCode, retryActive } from "../../../services/user";

const ModalRetryActive = ({ isModalOpen, setIsModalOpen, userEmail }) => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [userId, setUserId] = useState("");
  const [errorCodId, setErrorCodeId] = useState("");

  useEffect(() => {
    if (userEmail) {
      form.setFieldValue("email", userEmail);
    }
  }, [userEmail, form]);

  const onFinishStep0 = async () => {
    try {
      const result = await retryActive({ email: form.getFieldValue("email") });
      setUserId(result?.data?._id);
      setCurrent(1);
      toast.success(result?.data?.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const onFinishStep1 = async (data) => {
    try {
      const result = await checkCode({ ...data, _id: userId });
      console.log(result.data);
      setCurrent(2);
      toast.success(result?.data?.message);
    } catch (error) {
      setErrorCodeId(error.response?.data?.message);
      toast.error(error.response?.data?.message);
    }
  };

  const handleRetryEmail = () => {
    setErrorCodeId("");
    setCurrent(0);
  };
  return (
    <Modal
      title="Is active account user!"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
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
        className="mb-4"
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
              <Input disabled value={userEmail} />
            </Form.Item>
            <Form.Item>
              <div className="flex gap-2 justify-end">
                <Button onClick={() => setIsModalOpen(false)}>Cancle</Button>
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
            <p>Please enter the verification code.</p>
          </div>
          <Form
            name="verify2"
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
            <Form.Item>
              <div className="flex gap-2 justify-end">
                {errorCodId && (
                  <div className="flex gap-2 items-center">
                    <p className="text-red-500">{errorCodId}</p>
                    <Button onClick={handleRetryEmail}>Resend Email</Button>
                  </div>
                )}
                <Button type="primary" htmlType="submit">
                  Activate
                </Button>
              </div>
            </Form.Item>
          </Form>
        </>
      )}

      {current === 2 && (
        <div style={{ margin: "20px 0" }}>
          <div className="flex gap-2 items-center">
            Your account has been successfully activated!
            <Button type="primary" onClick={() => setIsModalOpen(false)}>
              Login again
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalRetryActive;
