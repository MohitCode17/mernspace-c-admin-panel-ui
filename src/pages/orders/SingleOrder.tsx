import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Flex,
  List,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeStatus, getSingleOrder } from "../../http/api";
import { capitalize } from "../products/helpers";
import { colorMapping } from "../../constants/constants";
import { Order, OrderStatus } from "../../types";

const orderStatusOptions = [
  {
    value: "received",
    label: "Received",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "prepared",
    label: "Prepared",
  },
  {
    value: "out_for_delivery",
    label: "Out For Delivery",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
];

const SingleOrder = () => {
  const { orderId } = useParams();
  const queryClient = useQueryClient();

  // FETCH SINGLE ORDER DETAIL
  const { data: order } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        fields:
          "cart,address,paymentMode,tenantId,total,comment,orderStatus,paymentStatus,createdAt",
      }).toString();
      return getSingleOrder(orderId as string, queryString).then(
        (res) => res.data
      );
    },
  });

  // CHANGE STATUS MUTATION
  const { mutate } = useMutation({
    mutationKey: ["order", orderId],
    mutationFn: async (status: OrderStatus) => {
      return changeStatus(orderId as string, { status }).then(
        (res) => res.data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });

  if (!order) {
    return null;
  }

  const handleStatusChange = (status: OrderStatus) => {
    mutate(status);
  };

  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/"}>Dashboard</Link> },
            { title: <Link to={"/orders"}>Orders</Link> },
            { title: `Orders #${order._id}` },
          ]}
        />

        <Space>
          <Typography.Text>Change Order Status</Typography.Text>
          <Select
            defaultValue={order.orderStatus}
            style={{
              width: 150,
            }}
            onChange={handleStatusChange}
            options={orderStatusOptions}
          />
        </Space>
      </Flex>

      <Row gutter={24}>
        <Col span={14}>
          <Card
            title="Order Details"
            extra={
              <Tag color={colorMapping[order.orderStatus]}>
                {capitalize(order.orderStatus)}
              </Tag>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={order.cart}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.image} />}
                    title={item.name}
                    description={item.chosenConfiguration.selectedToppings[0]
                      // TODO: IMPORTANT: check why there is a nested array in selected toppings
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      .map((topping) => topping.name)
                      .join(", ")}
                  />

                  <Space size={"large"}>
                    <Typography.Text>
                      {Object.values(
                        item.chosenConfiguration.priceConfiguration
                      ).join(", ")}
                    </Typography.Text>

                    <Typography.Text>
                      {item.qty} Item{item.qty > 1 ? "s" : ""}
                    </Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Customer Details">
            <Space direction="vertical">
              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Name</Typography.Text>
                <Typography.Text>
                  {order.customerId.firstName + " " + order.customerId.lastName}
                </Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Address</Typography.Text>
                <Typography.Text>{order.address}</Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">
                  Payment Method
                </Typography.Text>
                <Typography.Text>
                  {order.paymentMode.toUpperCase()}
                </Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">
                  Payment Status
                </Typography.Text>
                <Typography.Text>
                  {capitalize(order.paymentStatus)}
                </Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Order Amount</Typography.Text>
                <Typography.Text>₹{order.total}</Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Order Time</Typography.Text>
                <Typography.Text>
                  {new Date(order.createdAt).toLocaleString()}
                </Typography.Text>
              </Flex>

              {order.comment && (
                <Flex style={{ flexDirection: "column" }}>
                  <Typography.Text type="secondary">Comment</Typography.Text>
                  <Typography.Text>{order.comment}</Typography.Text>
                </Flex>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default SingleOrder;
