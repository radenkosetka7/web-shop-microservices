import {Button, Form, Input, InputNumber, Switch} from "antd";
import React, {useState} from "react";
import TextArea from "antd/es/input/TextArea";


const GeneralForm = ({onFinish, initialValues}) => {

    const [statusCode, setStatusCode] = useState(null);

    const [open, setOpen] = useState(false);
    const onChangeOpen = (checked) => {
        setOpen(checked);
    };
    return (
        <Form
            initialValues={initialValues}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
            onClick={event => event.stopPropagation()}
        >
            <br/>
            <Form.Item wrapperCol={{ offset: 2, span: 14 }} label="Name" name="name" rules={[
                { required: true, message: 'Please enter a name.' },
            ]}>
                <Input />
            </Form.Item >
            <Form.Item wrapperCol={{ offset: 2, span: 14 }} label="Description" name="description" rules={[
                { required: true, message: 'Please enter a description.' },
                { max: 10000, message: 'Description must not exceed 10000 characters.' },
            ]}>
                <TextArea rows={4} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 2, span: 14 }} label="Price" name="price" rules={[
                { required: true, message: 'Please enter a price.' },
            ]}>
                <InputNumber min={0} />
            </Form.Item >
            <Form.Item wrapperCol={{ offset: 2, span: 14 }} label="New" name="condition" rules={[
            ]}>
            <Switch
                onChange={onChangeOpen}
                checked={open}
                style={{
                }}
            />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 2, span: 14 }} label="City" name="city" rules={[
                { required: true, message: 'Please enter a city.' },
            ]}>
                <Input />
            </Form.Item >
            <Form.Item wrapperCol={{ offset: 2, span: 14 }} label="Contact" name="contact" rules={[
                { required: true, message: 'Please enter a contact number.' },
                {
                    pattern: /^(\+\d{1,3})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3}$/,
                    message: 'Please enter a valid phone number.'
                }
            ]}>
                <Input placeholder="E.g. +1 123-456-789"  />
            </Form.Item >
            <Form.Item wrapperCol={{ offset: 18, span: 14 }}>
                <Button type="primary" htmlType="submit">
                    Continue
                </Button>
            </Form.Item>
            {
                statusCode &&
                <p className='error1' style={{maxWidth: "250px"}}>
                    {statusCode}
                </p>

            }
        </Form>
    )
}

export default GeneralForm;