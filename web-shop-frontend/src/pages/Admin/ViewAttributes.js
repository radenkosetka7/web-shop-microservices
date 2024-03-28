import { useSelector } from "react-redux";
import React from "react";
import { Col, Form, Input, Modal, Row } from "antd";

const ViewAttributes = ({ show, onClose, record }) => {
  const { attributes } = useSelector((state) => state.categories);

  return (
    <>
      <Modal
        maskClosable={false}
        title={<div style={{ textAlign: "center", fontSize: "20px" }}>{record.name} Attributes</div>}
        footer={[]}
        open={show}
        style={{ overflowY: "auto" }}

        onCancel={onClose}
      >
        <br />
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ minWidth: "fit-content", height: 400 }}
          onClick={(event) => event.stopPropagation()}
        >
          {attributes.map(attribute => (
            <Row key={attribute.id} gutter={16}>
              <Col span={12}>
                <label htmlFor={`name-${attribute.id}`}>Name</label>
                <Input disabled={true} id={`name-${attribute.id}`} value={attribute.name} />
              </Col>
              <Col span={12}>
                <label htmlFor={`type-${attribute.id}`}>Type</label>
                <Input disabled={true} id={`type-${attribute.id}`} value={attribute.type} />
              </Col>
              <hr />
            </Row>

          ))}
        </Form>
      </Modal>
    </>
  );
};

export default ViewAttributes;
