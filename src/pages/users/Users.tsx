import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUsers, getUsers } from "../../http/api";
import { CreateUserData, User } from "../../types";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
import UserForm from "./form/UserForm";
import { PER_PAGE } from "../../constants/constants";

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
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Pagination logic
  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    perPage: PER_PAGE,
  });

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
    queryKey: ["users", queryParams],
    queryFn: async () => {
      const querString = new URLSearchParams(
        queryParams as unknown as Record<string, string>
      ).toString();

      const res = await getUsers(querString);
      return res.data;
    },
  });

  // Create user mutation
  const { mutate: createUserMutation } = useMutation({
    mutationKey: ["createuser"],
    mutationFn: async (data: CreateUserData) => {
      const res = await createUsers(data);
      return res.data;
    },
    onSuccess: async () => {
      // Invalidate the query, if there any caching just remove it all call users query
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  // Handle Form Submittion
  const handleSubmit = async () => {
    // Validate the fields
    await form.validateFields();
    // Call create user mutation
    await createUserMutation(form.getFieldsValue());
    form.resetFields();
    setDrawerOpen(false);
  };

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
        <Table
          columns={columns}
          dataSource={users?.data}
          rowKey={"id"}
          pagination={{
            total: users?.total,
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
          }}
        />

        {/* Drawer */}
        <Drawer
          title="Create User"
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
              <Button type="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form form={form} layout="vertical">
            <UserForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
