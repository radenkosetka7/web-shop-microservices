import React, { useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { crateCategory } from "../../redux-store/categorySlice";

const { Option } = Select;

const AddUser = ({ show, onClose }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [fields, setFields] = useState([{ name: "Type", type: "STRING" }]);
  const dispatch = useDispatch();

  const handleAddField = () => {
    setFields([...fields, { name: "", type: "STRING" }]);
  };

  const handleRemoveField = (index) => {
    if (fields.length === 1 || (index === 0 && fields[index].name === "Type" && fields[index].type === "STRING")) {
      return;
    }
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleFormSubmit = async (values) => {
    setIsDisabled(true);
    const categoryObj = {
      name: values.name,
      attributes: fields
    };
    await dispatch(crateCategory({ value: categoryObj }));
    setTimeout(() => {
      setIsDisabled(false);
      onClose();
      setFields(null);
    }, 1000);
  };

  return (
    <Modal
      style={{ top: 20 }}
      maskClosable={false}
      title={<div style={{ textAlign: "center", fontSize: "20px" }}>Add category</div>}
      footer={[]}
      open={show}
      onCancel={onClose}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600, overflowY: "auto", height: 400 }}
        onClick={(event) => event.stopPropagation()}
        onFinish={handleFormSubmit}
      >
        <br />
        <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required" }]}>
          <Input />
        </Form.Item>
        <div style={{ textAlign: "center", fontSize: "20px" }}>Attributes</div>
        <br />
        {fields.map((field, index) => (
          <div key={index} style={{ display: "flex", justifyContent: "center" }}>
            <Form.Item style={{ marginRight: 10 }}>
              <label>Name</label>
              <Input
                value={field.name}
                onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                rules={[{ required: true, message: "Name is required" }]}
              />
            </Form.Item>
            <Form.Item>
              <label>Type</label>
              <Select style={{ width: "fit-content" }}
                      value={field.type}
                      onChange={(value) => handleFieldChange(index, "type", value)}
              >
                <Option value="STRING">String</Option>
                <Option value="INT">Integer</Option>
                <Option value="DOUBLE">Double</Option>
              </Select>
            </Form.Item>
            {fields.length > 1 && (
              <MinusCircleOutlined
                onClick={() => handleRemoveField(index)}
                style={{ marginTop: 8 }}
              />
            )}
          </div>
        ))}
        <br />
        <Button type="dashed" onClick={handleAddField}
                style={{ width: "fit-content", float: "right", border: "2px solid black" }}>+ Add
          Field
        </Button>
        <br />
        <br />
        <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
          <Button type="primary" htmlType="submit" disabled={isDisabled}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUser;
