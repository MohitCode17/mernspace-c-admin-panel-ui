import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import TenantsFilter from "./TenantsFilter";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenants, getTenants } from "../../http/api";
import TenantForm from "./form/TenantForm";
import { useAuthStore } from "../../store";
import { CreateTenantData } from "../../types";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuthStore();

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  // Get All Tenants
  const {
    data: tenants,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await getTenants();
      return res.data;
    },
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

  // Check if user is not admin(redirect to home)
  if (user?.role !== "admin") {
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/"}>Dashboard</Link> },
            { title: "Restaurants" },
          ]}
        />

        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}

        {/* Tenants Filter */}
        <TenantsFilter>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add Restaurant
          </Button>
        </TenantsFilter>

        {/* Tenants Table */}
        <Table columns={columns} dataSource={tenants} rowKey={"id"} />

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
