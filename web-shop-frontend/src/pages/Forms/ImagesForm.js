import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Upload } from "antd";


const ImagesForm = ({ onFinish }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleSubmit = (values) => {
    onFinish({ ...values, images: selectedImages });
  };

  const handleChange = ({fileList: newFileList}) => {
    setSelectedImages(newFileList);
  };
  return (
    <Form
      onFinish={handleSubmit}
      style={{
        maxWidth: 600,
      }}
      autoComplete="off"
    >
      <br />
      <Upload
        name={"file"}
        accept=".png,.jpeg,.jpg"
        className="m-2 custom-upload"
        beforeUpload={() => false}
        listType="picture-card"
        fileList={selectedImages}
        onChange={handleChange}
        maxCount={10}
      >
        <button type="button">
          <PlusOutlined />
          <div>
            Upload
          </div>
        </button>
      </Upload>
      <Form.Item>
        <Form.Item wrapperCol={{ offset: 18, span: 14 }}>
          <Button disabled={!selectedImages} type="primary" htmlType="submit">
            Continue
          </Button>
        </Form.Item>
      </Form.Item>
    </Form>
  );
};
export default ImagesForm;
