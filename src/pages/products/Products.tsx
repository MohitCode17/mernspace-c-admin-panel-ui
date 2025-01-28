import {
  Breadcrumb,
  Button,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductFilter from "./ProductFilter";
import { Product } from "../../types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PER_PAGE } from "../../constants/constants";
import { getProducts } from "../../http/api";

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_: string, record: Product) => {
      return (
        <div>
          <Space>
            <Image width={60} src={record.image} />
            <Typography.Text>{record.name}</Typography.Text>
          </Space>
        </div>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (text: string) => (
      <Typography.Text ellipsis={{ tooltip: text }} style={{ maxWidth: 300 }}>
        {text}
      </Typography.Text>
    ),
  },
  {
    title: "Status",
    dataIndex: "isPublish",
    key: "isPublish",
    render: (_: boolean, record: Product) => {
      return (
        <div>
          {record.isPublish ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="red">Draft</Tag>
          )}
        </div>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <Typography.Text>
          {new Date(text).toLocaleDateString()}{" "}
          {new Date(text).toLocaleTimeString()}
        </Typography.Text>
      );
    },
  },
];

const Products = () => {
  const [filterForm] = Form.useForm();

  // Pagination logic
  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    perPage: PER_PAGE,
  });

  // Get Products
  const {
    data: products,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: async () => {
      // Filter queryParams for falsy values, undefined, 0, null, etc.
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const querString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();

      const res = await getProducts(querString);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

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
          {isFetching && (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 24,
                  }}
                  spin
                />
              }
            />
          )}
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>

        {/* Product filter  */}
        <Form form={filterForm}>
          <ProductFilter>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Product
            </Button>
          </ProductFilter>
        </Form>

        {/* Product table */}
        <Table
          columns={[
            ...columns,
            {
              title: "Actions",
              render: () => {
                return (
                  <Space>
                    <Button type="link" onClick={() => {}}>
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={products?.data}
          rowKey={"_id"}
          pagination={{
            total: products?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              setQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
        />
      </Space>
    </>
  );
};

export default Products;
