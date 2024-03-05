import {Button, Form, Input, InputNumber, Select} from "antd";
import React, {useEffect, useState} from "react";
import TextArea from "antd/es/input/TextArea";
import {useDispatch, useSelector} from "react-redux";
import {getCategories} from "../../redux-store/categorySlice";


const SelectCategory = ({onFinish,initialValues}) => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCategories({}));
    }, []);

    const {categories} = useSelector((state) => state.categories);
    const [statusCode, setStatusCode] = useState(null);
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
            <Form.Item wrapperCol={{ offset: 2, span: 14 }} label="Category" name="category" rules={[
                { required: true, message: 'Category is required.' },
            ]}>
                <Select>
                    {categories.map(category => (
                        <Select.Option key={category.id} value={category.id}>
                            {category.name}
                        </Select.Option>
                    ))}
                </Select>
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

export default SelectCategory;