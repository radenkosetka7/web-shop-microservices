import { Button, Modal, Input, Form, Select } from 'antd';
import {useDispatch} from "react-redux";
import {createMessage} from "../../redux-store/messageSlice";
import React, {useState} from "react";
const { TextArea } = Input;
const { Option } = Select;
const CustomerSupportModal = ({show,onClose}) => {
    const dispatch = useDispatch();
    const handleClick = (e) => {
        e.stopPropagation();
    };

    const [isDisabled, setIsDisabled] = useState(false);
    const [statusCode, setStatusCode] = useState(null);

    const handleFormSubmit = (values) => {
        setIsDisabled(true)
        const messageRequest = {
            question: values.message,
        };
        dispatch(createMessage({value:messageRequest}));
        setStatusCode("Message sent successfully.");
        setTimeout(() => {
            setIsDisabled(false);
            onClose();
        }, 1000);
    };

    return (
        <>
            <Modal maskClosable={false} title={<div style={{ textAlign: 'center', fontSize: '20px' }}>Customer Support</div>} footer={[
            ]} open={show} onCancel={onClose}  bodyStyle={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onFinish={handleFormSubmit}
                    style={{ maxWidth: 600 }}
                    onClick={event => event.stopPropagation()}
                >
                    <Form.Item label="Message" name="message" rules={[
                        { required: true, message: 'Please enter a message.' },
                        { max: 255, message: 'Message must not exceed 255 characters.' },
                    ]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 14 }}>
                        <Button type="primary" htmlType="submit" disabled={isDisabled} onClick={handleClick}>
                            Send message
                        </Button>
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
export default CustomerSupportModal;