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
  RightOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createUsers, getUsers, updateUser } from "../../http/api";
import { CreateUserData, FieldData, User } from "../../types";
import UsersFilter from "./UsersFilter";
import { useEffect, useMemo, useState } from "react";
import UserForm from "./form/UserForm";
import { PER_PAGE } from "../../constants/constants";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";

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
  {
    title: "Restaurant",
    dataIndex: "tenant",
    key: "tenant",
    render: (_text: string, record: User) => {
      return <div>{record.tenant?.name}</div>;
    },
  },
];

const Users = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentEditingUser, setCurrentEditingUser] = useState<User | null>(
    null
  );

  // Open drawer if currentEditingUser is not a null
  useEffect(() => {
    if (currentEditingUser) {
      setDrawerOpen(true);
      form.setFieldsValue({
        ...currentEditingUser,
        tenantId: currentEditingUser.tenant?.id,
      });
    }
  }, [currentEditingUser, form]);

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
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: async () => {
      // Filter queryParams for undefined
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const querString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();

      const res = await getUsers(querString);
      return res.data;
    },
    placeholderData: keepPreviousData, // keep previous data as placeholder and sweap when new data comes
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

  // Update user mutation
  const { mutate: updateUserMutation } = useMutation({
    mutationKey: ["updateuser"],
    mutationFn: async (data: CreateUserData) => {
      const res = await updateUser(data, currentEditingUser!.id);
      return res.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  // Handle Form Submittion
  const handleSubmit = async () => {
    // Validate the fields
    await form.validateFields();

    const isEditing = !!currentEditingUser;

    if (isEditing) {
      await updateUserMutation(form.getFieldsValue());
    } else {
      await createUserMutation(form.getFieldsValue());
    }
    form.resetFields();
    setCurrentEditingUser(null);
    setDrawerOpen(false);
  };

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
              { title: "Users" },
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

        {/* User filter  */}
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <UsersFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Add User
            </Button>
          </UsersFilter>
        </Form>

        {/* User table */}
        <Table
          columns={[
            ...columns,
            {
              title: "Actions",
              render: (_: string, record: User) => {
                return (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => {
                        setCurrentEditingUser(record);
                      }}
                    >
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
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
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
        />

        {/* Drawer */}
        <Drawer
          title={currentEditingUser ? "Edit user" : "Create User"}
          width={720}
          destroyOnClose={true}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          onClose={() => {
            form.resetFields();
            setCurrentEditingUser(null);
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
            <UserForm isEditMode={!!currentEditingUser} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
