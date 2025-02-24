import {
  Card,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTenants } from "../../../http/api";
import { Category, Tenant } from "../../../types";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import ProductImage from "./ProductImage";
import { useAuthStore } from "../../../store";

const ProductForm = ({ form }: { form: FormInstance }) => {
  const selectedCategory = Form.useWatch("categoryId");
  const { user } = useAuthStore();

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
    <Row>
      <Col span={24}>
        <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
          <Card title="Product Info" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Product name is required",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[
                    {
                      required: true,
                      message: "Product category is required",
                    },
                  ]}
                >
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
              <Col span={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Description is required",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={3}
                    maxLength={200}
                    style={{ resize: "none" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Product Image" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <ProductImage initialImage={form.getFieldValue("image")} />
              </Col>
            </Row>
          </Card>

          {user?.role !== "manager" && (
            <Card title="Tenant Info" bordered={false}>
              <Row gutter={24}>
                <Col span={24}>
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
                      {restaurants?.data.map((restaurant: Tenant) => (
                        <Select.Option
                          value={String(restaurant.id)}
                          key={restaurant.id}
                        >
                          {restaurant.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}

          {selectedCategory && <Pricing selectedCategory={selectedCategory} />}
          {selectedCategory && (
            <Attributes selectedCategory={selectedCategory} />
          )}

          <Card title="Other Properties" bordered={false}>
            <Row gutter={24}>
              <Col span={24}>
                <Space>
                  <Form.Item name="isPublish">
                    <Switch
                      defaultChecked={false}
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                    />
                  </Form.Item>
                  <Typography.Text
                    style={{ marginBottom: 20, display: "block" }}
                  >
                    Published
                  </Typography.Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductForm;
