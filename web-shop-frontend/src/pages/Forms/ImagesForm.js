import React, {useState} from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Space } from 'antd';

const ImagesForm = ({onFinish}) => {


    const [selectedImages, setSelectedImages] = useState([]);

    const handleImageChange = (index, event) => {
        const newImages = [...selectedImages];
        newImages[index] = event.target.files[0];
        setSelectedImages(newImages);
    };

    const handleRemoveImage = (index) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);
    };
    const handleSubmit = (values) => {
        // Here, you can access the selectedImages array and pass it to the onFinish callback.
        onFinish({ ...values, images: selectedImages });
    };

    return (
            <Form
                onFinish={handleSubmit}
                style={{
                    maxWidth: 600,
                }}
                autoComplete="off"
            >
            <br/>
            <Form.List name="image"
                       rules={[
                           {
                               required: true,
                               message: 'Please add at least one image.',
                               validator: (_, value) => {
                                   if (value && value.length > 0) {
                                       return Promise.resolve();
                                   }
                                   return Promise.reject(new Error('Please add at least one image.'));
                               },
                           },
                       ]}>
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}, index) => (
                            <Space
                                key={key}
                                style={{
                                    display: 'flex',
                                    marginBottom: 8,
                                }}
                                align="baseline"
                            >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'image']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Missing image',
                                        },
                                    ]}
                                >
                                    <input type="file"  id={`file_${index}`}
                                           name={`file_${index}`}
                                           accept=".jpg, .jpeg, .png"
                                           onChange={(event) => handleImageChange(index, event)}/>
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => {
                                    remove(name);
                                    handleRemoveImage(index);
                                }}/>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                Add field
                            </Button>
                        </Form.Item>
                        {fields.length === 0 && (
                            <Form.Item validateStatus="error" style={{fontWeight: 'bold'}}
                                       help="At least one image is required">
                            </Form.Item>
                        )}
                    </>
                )}
            </Form.List>
            <Form.Item>
                <Form.Item wrapperCol={{offset: 18, span: 14}}>
                    <Button type="primary" htmlType="submit">
                        Continue
                    </Button>
                </Form.Item>
            </Form.Item>
        </Form>
    );
}
export default ImagesForm;