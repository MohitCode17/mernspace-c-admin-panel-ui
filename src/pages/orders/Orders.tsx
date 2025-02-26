import { Breadcrumb, Flex, message, Space, Table, Tag, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Order, OrderEvents, PaymentMode, PaymentStatus } from "../../types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders } from "../../http/api";
import { colorMapping } from "../../constants/constants";
import { capitalize } from "lodash";
import { useEffect } from "react";
import socket from "../../lib/socket";
import { useAuthStore } from "../../store";

const columns = [
  {
    title: "Order ID",
    dataIndex: "_id",
    key: "_id",
    render: (_: string, record: Order) => {
      return <Typography.Text>{record._id}</Typography.Text>;
    },
  },
  {
    title: "Customer",
    dataIndex: "customerId",
    key: "customerId._id",
    render: (_: string, record: Order) => (
      <Typography.Text>
        {record.customerId.firstName + " " + record.customerId.lastName}
      </Typography.Text>
    ),
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (_: string, record: Order) => (
      <Typography.Text>{record.address}</Typography.Text>
    ),
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
    render: (_: string, record: Order) => (
      <Typography.Text>{record?.comment}</Typography.Text>
    ),
  },
  {
    title: "Payment Mode",
    dataIndex: "paymentMode",
    key: "paymentMode",
    render: (_: string, record: Order) => (
      <Typography.Text>{capitalize(record.paymentMode)}</Typography.Text>
    ),
  },
  {
    title: "Status",
    dataIndex: "orderStatus",
    key: "orderStatus",
    render: (_: boolean, record: Order) => {
      return (
        <>
          <Tag color={colorMapping[record.orderStatus]}>
            {capitalize(record.orderStatus)}
          </Tag>
        </>
      );
    },
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (text: string) => {
      return <Typography.Text>₹{text}</Typography.Text>;
    },
  },
  {
    title: "CreatedAt",
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
  {
    title: "Actions",
    render: (_: string, record: Order) => {
      return <Link to={`/orders/${record._id}`}>Details</Link>;
    },
  },
];

// TODO: MAKE THIS LOGIC DYNAMIC(IF MANAGER OPEN THEIR ACCOUNT STILL WE PASS TENANT_ID = 1 DEFAULT)
const TENANT_ID = 1;

const Orders = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (user?.tenant) {
      socket.on("order-update", (data) => {
        if (
          (data.event_type === OrderEvents.ORDER_CREATE &&
            data.data.paymentMode === PaymentMode.CASH) ||
          (data.event_type === OrderEvents.PAYMENT_STATUS_UPDATE &&
            data.data.paymentStatus === PaymentStatus.PAID &&
            data.data.paymentMode === PaymentMode.CARD)
        ) {
          queryClient.setQueryData(["orders"], (old: Order[]) => [
            data.data,
            ...old,
          ]);
          messageApi.open({
            type: "success",
            content: "New Order Received.",
          });
        }
      });

      socket.on("join", (data) => {
        console.log("User joined in: ", data.roomId);
      });

      socket.emit("join", {
        tenantId: user.tenant.id,
      });
    }

    // Unsubscribe an event
    return () => {
      socket.off("join");
      socket.off("order-update");
    };
  }, []);

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      // TODO: ID ADMIN USER THEN MAKE SURE TO SEND TENANDiD OR TENAND ID FROM SELECTED FILTER
      const queryString = new URLSearchParams({
        tenantId: String(TENANT_ID),
      }).toString();

      const res = await getOrders(queryString);
      return res.data;
    },
  });

  console.log(orders);

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to={"/"}>Dashboard</Link> },
              { title: "Orders" },
            ]}
          />
        </Flex>
        {/* TODO: IMPLEMENT PAGINATION:- USE SERVER SIDE PAGINATION LOGIC IN BILLING SERVICE */}
        <Table columns={columns} dataSource={orders} rowKey={"_id"} />
      </Space>
    </>
  );
};

export default Orders;
