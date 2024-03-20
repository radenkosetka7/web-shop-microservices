import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateCategory } from "../../redux-store/categorySlice";
import { getLoggedUser } from "../../redux-store/userSlice";

const { Option } = Select;

const EditCategory = ({ show, onClose, category }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [fields, setFields] = useState([]);
  const dispatch = useDispatch();
  const {attributes} = useSelector((state)=>state.categories);

  const [addedFields, setAddedFields] = useState([]);
  const [removedFields, setRemovedFields] = useState([]);
  const [changedFields, setChangedFields] = useState([]);
  useEffect(() => {
    if (category) {
      setFields(attributes);
    }
  }, [category]);

  const handleAddField = () => {
    const newField = { name: "", type: "STRING" };
    setFields([...fields, newField]);
  };
  const handleRemoveField = (index) => {
    const newFields = [...fields];
    const removedField = newFields.splice(index, 1);
    setFields(newFields);
    setRemovedFields([...removedFields, removedField]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    const changedField = { ...newFields[index], [key]: value };
    newFields[index] = changedField;
    setFields(newFields);

    const existingIndex = changedFields.findIndex((field) => changedField.name.includes(field.name));
    if (existingIndex !== -1) {
      const newChangedFields = [...changedFields];
      newChangedFields[existingIndex] = changedField;
      setChangedFields(newChangedFields);
    } else {
      setChangedFields([...changedFields, changedField]);
    }
  };

  const handleFormSubmit = async (values) => {
    const filteredRemovedFields = removedFields.flat().filter(field => field.hasOwnProperty('id'));

    let filteredChangedFields = changedFields.filter(changedField => {
      return !removedFields.flat().some(removedField => removedField.name === changedField.name && !removedField.hasOwnProperty('id'));
    });

    const filteredAddedFields = filteredChangedFields.filter(field=>!field.hasOwnProperty('id'));
    filteredChangedFields = filteredChangedFields.filter(field=>field.hasOwnProperty('id'));
    const updateCategoryRequest = {
      name:values.name,
      addedAttributes:filteredAddedFields,
      deletedAttributes:filteredRemovedFields,
      updatedAttributes:filteredChangedFields,
    }
    await dispatch(updateCategory({id:category.id, value:updateCategoryRequest}));

    setTimeout(() => {
      setIsDisabled(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal
      style={{ top: 20 }}
      maskClosable={false}
      title={<div style={{ textAlign: "center", fontSize: "20px" }}>Edit category</div>}
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
        initialValues={{ name: category.name }}
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
        <Button type="dashed" onClick={handleAddField} style={{ width: "fit-content", float:"right", border: "2px solid black" }}>+ Add
          Field
        </Button>
        <br />
        <br />
        <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
          <Button  type="primary" htmlType="submit" disabled={isDisabled}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategory;