import { Form, message, Space, Typography, Upload, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const ProductImage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploaderConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    // Prevent automatic upload
    beforeUpload: (file) => {
      // Validation logic
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";

      if (!isJpgOrPng) {
        console.log("You can only upload JPG/PNG file!");
        messageApi.error("You can only upload JPG/PNG file!");
      }

      setImageUrl(URL.createObjectURL(file));
      return false;
    },
  };

  return (
    <Form.Item
      name="image"
      rules={[
        {
          required: true,
          message: "Please upload a product image",
        },
      ]}
    >
      <Upload listType="picture-card" {...uploaderConfig}>
        {contextHolder}
        {imageUrl ? (
          <img src={imageUrl} alt="product_image" style={{ width: "100%" }} />
        ) : (
          <Space direction="vertical">
            <PlusOutlined />
            <Typography.Text>Upload</Typography.Text>
          </Space>
        )}
      </Upload>
    </Form.Item>
  );
};

export default ProductImage;
