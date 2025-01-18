import { Card, Col, Form, Input, Row, Select, Space } from "antd";

const UserForm = () => {
  return (
    <Form>
      <Row>
        <Col span={24}>
          <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
            <Card title="Basic info" bordered={false}>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    label="First name"
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: "First name is required",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Last name"
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Last name is required",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Email is required",
                      },
                      {
                        type: "email",
                        message: "Email is not a valid.",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Security info" bordered={false}>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    label="Passoword"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Password required",
                      },
                      {
                        len: 8,
                        message:
                          "Password length must have 8 or more characters.",
                      },
                    ]}
                  >
                    <Input type="password" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Role" bordered={false}>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                      {
                        required: true,
                        message: "Role is required",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select role"
                      allowClear
                      options={[
                        { value: "admin", label: "Admin" },
                        { value: "manager", label: "Manager" },
                        { value: "customer", label: "Customer" },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Restaurant"
                    name="tenantId"
                    rules={[
                      {
                        required: true,
                        message: "Restaurant is required",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select restaurant"
                      allowClear
                    >
                      <Select.Option value="restaurant1">
                        Restaurant 1
                      </Select.Option>
                      <Select.Option value="restaurant2">
                        Restaurant 2
                      </Select.Option>
                      <Select.Option value="restaurant3">
                        Restaurant 3
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default UserForm;
