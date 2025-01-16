import { Breadcrumb, Button, Drawer, Space, Table, theme } from "antd";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { User } from "../../types";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
import UserForm from "./form/UserForm";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
];

const Users = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  // Get users
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getUsers();
      return res.data;
    },
  });

  return (
    <>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/"}>Dashboard</Link> },
            { title: "Users" },
          ]}
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}

        {/* User filter  */}
        <UsersFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(filterName, filterValue);
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add User
          </Button>
        </UsersFilter>
        {/* User table */}
        <Table columns={columns} dataSource={users} rowKey={"id"} />

        {/* Drawer */}
        <Drawer
          title="Create User"
          width={720}
          destroyOnClose={true}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          extra={
            <Space>
              <Button>Cancel</Button>
              <Button type="primary">Submit</Button>
            </Space>
          }
        >
          <UserForm />
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
