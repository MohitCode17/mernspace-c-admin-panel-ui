import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import { Tenant } from "../../../types";

const UserForm = ({ isEditMode = false }: { isEditMode: boolean }) => {
  const selectedRole = Form.useWatch("role");

  // Get all restaurants (Tenants)
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await getTenants();
      return res.data;
    },
  });

  return (
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

          {!isEditMode && (
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
                        min: 8,
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
          )}

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
                    ]}
                  />
                </Form.Item>
              </Col>

              {selectedRole === "manager" && (
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
                      {tenants?.map((tenant: Tenant) => (
                        <Select.Option value={tenant.id} key={tenant.id}>
                          {tenant.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default UserForm;
