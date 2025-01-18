import { Card, Col, Input, Row } from "antd";
import React from "react";

type TenantFilterProps = {
  children: React.ReactNode;
};

const TenantsFilter = ({ children }: TenantFilterProps) => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={12}>
          <Input.Search placeholder="Search" allowClear />
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default TenantsFilter;
