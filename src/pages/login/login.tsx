import {
  Card,
  Layout,
  Space,
  Button,
  Checkbox,
  Form,
  Input,
  Flex,
  Alert,
} from "antd";
import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../../components/icons/Logo";
import { useMutation } from "@tanstack/react-query";
import { Credentials } from "../../types";
import { login } from "../../http/api";

const LoginPage = () => {
  const loginUser = async (credentials: Credentials) => {
    // server login for login user
    const { data } = await login(credentials);
    return data;
  };

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      console.log("Login successful");
    },
  });

  return (
    <>
      <Layout
        style={{ height: "100vh", display: "grid", placeItems: "center" }}
      >
        <Space direction="vertical" align="center" size={"large"}>
          <Layout.Content>
            <Logo />
          </Layout.Content>
          <Card
            bordered={false}
            style={{ width: 300 }}
            title={
              <Space
                style={{
                  width: "100%",
                  fontSize: 16,
                  justifyContent: "center",
                }}
              >
                <LockFilled />
                Sign in
              </Space>
            }
          >
            <Form
              initialValues={{ remember: true }}
              onFinish={(values) => {
                mutate({ email: values.username, password: values.password });
              }}
            >
              {isError && (
                <Alert
                  style={{ marginBottom: 24 }}
                  type="error"
                  message={error.message}
                />
              )}
              <Form.Item
                name={"username"}
                rules={[
                  { required: true, message: "Please input your Username!" },
                  { type: "email", message: "Email is not valid!" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>

              <Form.Item
                name={"password"}
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item>
                <Flex justify="space-between" align="center">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <a href="">Forgot password</a>
                </Flex>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={isPending}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </>
  );
};

export default LoginPage;
