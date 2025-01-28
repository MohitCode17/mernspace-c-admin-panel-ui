import { useQuery } from "@tanstack/react-query";
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
import { getCategories, getTenants } from "../../http/api";
import { Category, Tenant } from "../../types";

type ProductFilterProps = {
  children: React.ReactNode;
};

const ProductFilter = ({ children }: ProductFilterProps) => {
  // Get all restaurants list
  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await getTenants(`perPage=100&currentPage=1`);
      return res.data;
    },
  });

  // Get all categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories();
      return res.data;
    },
  });

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
                >
                  {categories?.map((category: Category) => (
                    <Select.Option value={category._id} key={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={"category"}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Restaurant"
                  allowClear
                >
                  {restaurants?.data.map((restaurant: Tenant) => (
                    <Select.Option value={restaurant.id} key={restaurant.id}>
                      {restaurant.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
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
