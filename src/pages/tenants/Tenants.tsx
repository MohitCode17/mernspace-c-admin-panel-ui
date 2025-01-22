import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  theme,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import TenantsFilter from "./TenantsFilter";
import { useMemo, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createTenants, getTenants } from "../../http/api";
import TenantForm from "./form/TenantForm";
import { useAuthStore } from "../../store";
import { CreateTenantData, FieldData } from "../../types";
import { PER_PAGE } from "../../constants/constants";
import { debounce } from "lodash";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const Tenants = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuthStore();

  // Pagination variables
  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    perPage: PER_PAGE,
  });

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  // Get All Tenants
  const {
    data: tenants,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: async () => {
      const querString = new URLSearchParams(
        queryParams as unknown as Record<string, string>
      ).toString();

      const res = await getTenants(querString);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  // Create Tenant Mutation
  const { mutate: createTenantMutation } = useMutation({
    mutationKey: ["createtenant"],
    mutationFn: async (data: CreateTenantData) => {
      const res = await createTenants(data);
      return res.data;
    },

    onSuccess: async () => {
      // Invalidate the query, if there any caching just remove it all call users query
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
  });

  // Handle Tenant Submit
  const handleSubmit = async () => {
    await form.validateFields();
    createTenantMutation(form.getFieldsValue());

    form.resetFields();
    setDrawerOpen(false);
  };

  // Debounce the search query
  const debouncedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  // Search Tenant Functionality
  const onFilterChange = (changedFields: FieldData[]) => {
    // console.log(changedFields);
    const changedFilterFields = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    // console.log(changedFilterFields);

    // Debounce logic
    if ("q" in changedFilterFields) {
      debouncedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        currentPage: 1,
      }));
    }
  };

  // Check if user is not admin(redirect to home)
  if (user?.role !== "admin") {
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to={"/"}>Dashboard</Link> },
              { title: "Restaurants" },
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

        {/* Tenants Filter */}
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <TenantsFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Add Restaurant
            </Button>
          </TenantsFilter>
        </Form>

        {/* Tenants Table */}
        <Table
          columns={columns}
          dataSource={tenants?.data}
          rowKey={"id"}
          pagination={{
            total: tenants?.total,
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

        {/* Drawer */}
        <Drawer
          title="Create Restaurant"
          width={720}
          destroyOnClose={true}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          onClose={() => {
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
              <Button type="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form form={form} layout="vertical">
            <TenantForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
