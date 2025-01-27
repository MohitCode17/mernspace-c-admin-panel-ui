import { Breadcrumb, Button, Flex, Form, Space } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductFilter from "./ProductFilter";

const Products = () => {
  const [filterForm] = Form.useForm();

  return (
    <>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to={"/"}>Dashboard</Link> },
              { title: "Products" },
            ]}
          />
        </Flex>

        {/* Product filter  */}
        <Form form={filterForm}>
          <ProductFilter>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Product
            </Button>
          </ProductFilter>
        </Form>
      </Space>
    </>
  );
};

export default Products;
