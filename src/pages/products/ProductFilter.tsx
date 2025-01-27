import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";

type ProductFilterProps = {
  children: React.ReactNode;
};

const ProductFilter = ({ children }: ProductFilterProps) => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={20}>
            <Col span={6}>
              <Form.Item name={"q"}>
                <Input.Search placeholder="Search product" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={"category"}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select category"
                  allowClear
                  options={[
                    { value: "pizza", label: "Pizza" },
                    { value: "beverages", label: "Beverages" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="Restaurant"
                allowClear
                options={[
                  { value: "dominos", label: "Dominos" },
                  { value: "zaika", label: "Zaika-e Delhi" },
                  {
                    value: "cafe-corner",
                    label: "The Cafe Corner",
                  },
                ]}
              />
            </Col>
            <Col span={6}>
              <Space>
                <Switch defaultChecked />
                <Typography.Text>Show only published</Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductFilter;
