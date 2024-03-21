import { Button, Form, Input, Modal, Upload, Select } from "antd";
import React, { useEffect, useState } from "react";
import { invalidEmail, isRequired } from "../../constant/constants";
import { adminUpdateUser, getLoggedUser } from "../../redux-store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../../services/auth.service";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const EditUser = ({ show, onClose }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState('');
  const [images, setImages] = useState([]);
  const { user } = useSelector((state) => state.users);

  // State za Role i Status
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);

  const handleChangeImage = ({ fileList: newFileList }) => {
    setImages(newFileList);
    setAvatar(newFileList[0]);
  };

  const handleFormSubmit = async (values) => {
    setIsDisabled(true);
    if (
      user.firstname !== values.firstname ||
      user.lastname !== values.lastname ||
      user.email !== values.email ||
      user.city !== values.city ||
      avatar ||
      user.status !== values.status ||
      user.role !== values.role
    ) {
      let formData;
      let uid;
      if (avatar) {
        formData = new FormData();
        formData.append("file", avatar.originFileObj);
        uid = avatar.uid;
      }
      const uploadData = {
        firstname: values.firstname,
        lastname: values.lastname,
        username: values.username,
        city: values.city,
        avatar: avatar ? uid : user.avatar,
        email: values.email,
        role: role,
        status: status
      };
      await dispatch(adminUpdateUser({ id: user.id, value: uploadData }));
      if (avatar) {
        await uploadImage(formData, uid);
      }
      setTimeout(() => {
        setIsDisabled(false);
        onClose();
        dispatch(getLoggedUser({}));
      }, 1000);
    }
  };

  useEffect(() => {
    if (user?.avatar) {
      const img = require("/usr/src/app/src/assets/users/" + user.avatar + ".png");
      setImages([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: img,
        },
      ]);
    }
  }, []);

  return (
    <>
      <Modal
        style={{ top: 20 }}
        maskClosable={false}
        title={<div style={{ textAlign: "center", fontSize: "20px" }}>Edit profile</div>}
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
          style={{ maxWidth: 600,overflowY: 'auto', height:400 }}
          onClick={(event) => event.stopPropagation()}
          initialValues={{
            firstname: user?.firstname,
            lastname: user?.lastname,
            email: user?.email,
            username: user?.username,
            city: user?.city,
          }}
        >
          <Form.Item label="Firstname" name="firstname" rules={[{ required: true, message: 'Firstname' + isRequired, }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Lastname" name="lastname" rules={[{ required: true, message: 'Lastname' + isRequired, }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Username" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email' + isRequired, },{ type: "email", message: invalidEmail }]}>
            <Input />
          </Form.Item>
          <Form.Item label="City" name="city" rules={[{ required: true, message: 'City' + isRequired, }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Select onChange={(value) => setRole(value)} defaultValue={user.role}>
              <Option value={0}>Admin</Option>
              <Option value={1}>Support</Option>
              <Option value={2}>Ordinary</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select onChange={(value) => setStatus(value)} defaultValue={user.status}>
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

export default EditUser;
