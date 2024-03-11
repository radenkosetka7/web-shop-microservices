import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { useDispatch } from "react-redux";
import { replyMessage } from "../../redux-store/messageSlice";

const ReplyMessageModal = ({ show, onClose, record }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const [statusCode, setStatusCode] = useState(null);
  const handleFormSubmit = (values) => {
    const { mail, question, answer } = values;
    const replyRquest = {
      mail: mail,
      question:question,
      answer:answer
    };
    dispatch(replyMessage({value:replyRquest}))
    setStatusCode("Message sent successfully.");
    setTimeout(() => {
      setIsDisabled(false);
      onClose();
    }, 1000);
  };

  return (
    <>
      <Modal
        maskClosable={false}
        title={<div style={{ textAlign: 'center', fontSize: '20px' }}>Reply Message</div>}
        open={show}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>,
          <Button key="reply" type="primary" disabled={isDisabled} onClick={() => form.submit()}>
            Reply
          </Button>,
        ]}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          onFinish={handleFormSubmit}
          initialValues={{
            'mail': record.user.email,
            'question': record.question,
          }}
        >
          <Form.Item label="User-email" name="mail">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Question" name="question">
            <Input.TextArea disabled autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>

          <Form.Item label="Answer" name="answer" rules={[{ required: true, message: 'Please enter your reply!' }]}>
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
          {
            statusCode &&
            <p className='error1' style={{maxWidth: "250px"}}>
              {statusCode}
            </p>

          }
        </Form>
      </Modal>
    </>
  );
};

export default ReplyMessageModal;
