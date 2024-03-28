import { Button, Form, Input, Modal, Select, Upload } from "antd";
import React, { useState } from "react";
import { errorLength, invalidEmail, isRequired } from "../../constant/constants";
import { adminRegister } from "../../redux-store/userSlice";
import { useDispatch } from "react-redux";
import { uploadImage } from "../../services/auth.service";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddUser = ({ show, onClose }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState("");
  const [images, setImages] = useState([]);

  // State za Role i Status
  const [role, setRole] = useState(2);
  const [status, setStatus] = useState(0);

  const handleChangeImage = ({ fileList: newFileList }) => {
    setImages(newFileList);
    setAvatar(newFileList[0]);
  };

  const handleFormSubmit = async (values) => {
    setIsDisabled(true);
    let formData;
    let uid;
    if (avatar) {
      formData = new FormData();
      formData.append("file", avatar.originFileObj);
      uid = avatar.uid;
    }
    const registerReq = {
      firstname: values.firstname,
      lastname: values.lastname,
      city: values.city,
      username: values.username,
      password: values.password,
      email: values.email,
      avatar: avatar ? uid : null,
      role: role,
      status: status
    };
    await dispatch(adminRegister({ value: registerReq }));
    if (avatar) {
      uploadImage(formData, uid);
    }
    setTimeout(() => {
      setIsDisabled(false);
      onClose();
    }, 1000);
  };


  return (
    <>
      <Modal
        style={{ top: 20 }}
        maskClosable={false}
        title={<div style={{ textAlign: "center", fontSize: "20px" }}>Add user</div>}
        footer={[]}
        open={show}
        onCancel={onClose}
      >
        <br />
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          onFinish={handleFormSubmit}
          style={{ maxWidth: 600, overflowY: "auto", height: 400 }}
          onClick={(event) => event.stopPropagation()}
          initialValues={{
            remember: true
          }}
        >
          <Form.Item label="Firstname" name="firstname"
                     rules={[{ required: true, message: "Firstname" + isRequired }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Lastname" name="lastname" rules={[{ required: true, message: "Lastname" + isRequired }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Username" name="username" rules={[{ required: true, message: "Username" + isRequired }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"

            rules={[
              {
                required: true,
                message: "Password" + isRequired

              },
              {
                min: 8,
                message: errorLength
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Email" + isRequired }, {
            type: "email",
            message: invalidEmail
          }]}>
            <Input />
          </Form.Item>
          <Form.Item label="City" name="city" rules={[{ required: true, message: "City" + isRequired }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Select onChange={(value) => setRole(value)} defaultValue={2}>
              <Option value={0}>Admin</Option>
              <Option value={1}>Support</Option>
              <Option value={2}>Ordinary</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select onChange={(value) => setStatus(value)} defaultValue={0}>
              <Option value={0}>Active</Option>
              <Option value={1}>Requested</Option>
              <Option value={2}>Blocked</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Avatar" name="avatar">
            <Upload
              name={"file"}
              accept=".png,.jpeg,.jpg"
              className="m-2 custom-upload"
              beforeUpload={() => false}
              listType="picture-card"
              onChange={handleChangeImage}
              fileList={images}
              maxCount={1}
            >
              <button type="button">
                <PlusOutlined />
                <div>Upload</div>
              </button>
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 18, span: 14 }}>
            <Button type="primary" htmlType="submit" disabled={isDisabled}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddUser;
