import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductFilter from "./ProductFilter";
import { FieldData, Product } from "../../types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PER_PAGE } from "../../constants/constants";
import { createProduct, getProducts } from "../../http/api";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import ProductForm from "./form/ProductForm";
import { makeFormData } from "./helpers";

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
  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  // Pagination logic
  const [queryParams, setQueryParams] = useState({
    limit: PER_PAGE,
    page: 1,
    tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
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

  // Create user mutation
  const { mutate: productMutation, isPending: createProductLoading } =
    useMutation({
      mutationKey: ["product"],
      mutationFn: async (data: FormData) => {
        const res = await createProduct(data);
        return res.data;
      },
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        form.resetFields();
        setDrawerOpen(false);
        return;
      },
    });

  // Debounce the search query
  const debouncedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  // Handle Filter Change
  const onFilterChange = (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    // Debounce logic
    if ("q" in changedFilterFields) {
      debouncedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        page: 1,
      }));
    }
  };

  // Handle Form submit
  const handleSubmit = async () => {
    await form.validateFields();

    const priceConfiguration = form.getFieldValue("priceConfiguration");
    const pricing = Object.entries(priceConfiguration).reduce(
      (acc, [key, value]) => {
        const parsedKey = JSON.parse(key);

        return {
          ...acc,
          [parsedKey.configurationKey]: {
            priceType: parsedKey.priceType,
            availableOptions: value,
          },
        };
      },
      {}
    );

    const categoryId = JSON.parse(form.getFieldValue("categoryId"))._id;

    const attributes = Object.entries(form.getFieldValue("attributes")).map(
      ([key, value]) => {
        return {
          name: key,
          value: value,
        };
      }
    );

    const postData = {
      ...form.getFieldsValue(),
      tenantId:
        user!.role === "manager"
          ? user?.tenant?.id
          : form.getFieldValue("tenantId"),
      isPublish: form.getFieldValue("isPublish") ? true : false,
      categoryId,
      priceConfiguration: pricing,
      attributes,
    };

    const formData = makeFormData(postData);
    await productMutation(formData);
  };

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
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <ProductFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
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
            pageSize: queryParams.limit,
            current: queryParams.page,
            onChange: (page) => {
              setQueryParams((prev) => {
                return {
                  ...prev,
                  page: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
        />

        {/* Drawer */}
        <Drawer
          title={"Add Product"}
          width={720}
          destroyOnClose={true}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          onClose={() => {
            form.resetFields();
            setDrawerOpen(false);
          }}
          open={drawerOpen}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                loading={createProductLoading}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Space>
          }
        >
          <Form form={form} layout="vertical">
            <ProductForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Products;
