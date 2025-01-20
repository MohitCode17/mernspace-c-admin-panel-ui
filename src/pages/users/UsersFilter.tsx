import { Card, Col, Form, Input, Row, Select } from "antd";
import React from "react";

type UserFilterProps = {
  children: React.ReactNode;
};

const UsersFilter = ({ children }: UserFilterProps) => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item name={"q"}>
                <Input.Search placeholder="Search" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={"role"}>
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
            {/* TODO: TO BE IMPLEMENTED THIS FEATURE SOON */}
            {/* <Col span={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Status"
                allowClear
                options={[
                  { value: "ban", label: "Ban" },
                  { value: "active", label: "Active" },
                ]}
              />
            </Col> */}
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default UsersFilter;
