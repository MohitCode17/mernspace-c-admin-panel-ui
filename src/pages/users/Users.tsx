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
import { Link } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createUsers, getUsers } from "../../http/api";
import { CreateUserData, FieldData, User } from "../../types";
import UsersFilter from "./UsersFilter";
import { useMemo, useState } from "react";
import UserForm from "./form/UserForm";
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

  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

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

  // Handle Form Submittion
  const handleSubmit = async () => {
    // Validate the fields
    await form.validateFields();
    // Call create user mutation
    await createUserMutation(form.getFieldsValue());
    form.resetFields();
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
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
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
