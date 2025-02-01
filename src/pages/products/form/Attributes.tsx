import { Card, Col, Form, Radio, Row, Switch, Typography } from "antd";
import { Category } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../http/api";

type PricingProps = {
  selectedCategory: string;
};

const Attributes = ({ selectedCategory }: PricingProps) => {
  const { data: fetchedCategory } = useQuery<Category>({
    queryKey: ["category", selectedCategory],
    queryFn: async () => {
      const res = await getCategory(selectedCategory);
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min Disable multiple call(Use catching)
  });

  if (!fetchedCategory) return null;

  return (
    <Card
      title={<Typography.Text>Attributes</Typography.Text>}
      bordered={false}
    >
      {fetchedCategory.attributes.map((attribute) => {
        return (
          <div key={attribute.name}>
            {attribute.widgetType === "radio" ? (
              <Form.Item
                label={attribute.name}
                name={["attributes", attribute.name]}
                initialValue={attribute.defaultValue}
                rules={[
                  {
                    required: true,
                    message: `${attribute.name} is required`,
                  },
                ]}
              >
                <Radio.Group>
                  {attribute.availableOptins.map((option) => {
                    return (
                      <Radio.Button value={option} key={option}>
                        {option}
                      </Radio.Button>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            ) : attribute.widgetType === "switch" ? (
              <Row>
                <Col>
                  <Form.Item
                    name={["attributes", attribute.name]}
                    valuePropName="checked"
                    label={attribute.name}
                    initialValue={attribute.defaultValue === "Yes"}
                  >
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
          </div>
        );
      })}
    </Card>
  );
};

export default Attributes;
