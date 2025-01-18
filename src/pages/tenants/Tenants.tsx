import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import TenantsFilter from "./TenantsFilter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";
import TenantForm from "./form/TenantForm";

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
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const {
    token: { colorBgLayout },
  } = theme.useToken();

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
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary">Submit</Button>
            </Space>
          }
        >
          <Form>
            <TenantForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
