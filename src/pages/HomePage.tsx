import {
  Button,
  Card,
  Col,
  List,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { useAuthStore } from "../store";
import { BarChartIcon } from "../components/icons/BarChart";
import { ComponentType } from "react";
import Icon from "@ant-design/icons";
import BasketIcon from "../components/icons/BasketIcon";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const list = [
  {
    OrderSummary: "Peperoni, Margarita ...",
    address: "Bandra, Mumbai",
    amount: 1200,
    status: "preparing",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
];

interface CardTitleProps {
  title: string;
  PrefixIcon: ComponentType<unknown>;
}

const CardTitle = ({ title, PrefixIcon }: CardTitleProps) => {
  return (
    <Space>
      <Icon component={PrefixIcon} />
      {title}
    </Space>
  );
};

const HomePage = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <Title level={3}>Welcome, {user?.firstName} 😄</Title>
      {/* Cards (Grid) */}
      <Row gutter={16} style={{ marginTop: "44px" }}>
        <Col span={12}>
          <Row gutter={[16, 16]}>
            {/* Top two cards */}
            <Col span={12}>
              <Card bordered={false}>
                <Statistic title="Total orders" value={84} />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Total sale"
                  value={108500}
                  precision={2}
                  prefix="₹"
                />
              </Card>
            </Col>
            {/* Bottom card */}
            <Col span={24}>
              <Card
                title={<CardTitle title="Sales" PrefixIcon={BarChartIcon} />}
                bordered={false}
              ></Card>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Card
            bordered={false}
            title={<CardTitle title="Recent orders" PrefixIcon={BasketIcon} />}
          >
            <List
              className="demo-loadmore-list"
              loading={false}
              itemLayout="horizontal"
              loadMore={true}
              dataSource={list}
              renderItem={(item) => (
                <List.Item>
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                      title={
                        <a href="https://ant.design">{item.OrderSummary}</a>
                      }
                      description={item.address}
                    />
                    <Row style={{ flex: 1 }} justify="space-between">
                      <Col>
                        <Text strong>₹{item.amount}</Text>
                      </Col>
                      <Col>
                        <Tag color="volcano">{item.status}</Tag>
                      </Col>
                    </Row>
                  </Skeleton>
                </List.Item>
              )}
            />
            <div style={{ marginTop: 20 }}>
              <Button type="link">
                <Link to="/orders">See all orders</Link>
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
