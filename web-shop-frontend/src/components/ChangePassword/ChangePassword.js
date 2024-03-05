import {Button, Form, Input, Modal} from "antd";
import React, {useState} from "react";
import {errorCPass, errorLength, isRequired} from "../../constant/constants";
import {changePassword} from "../../redux-store/userSlice";
import {useDispatch, useSelector} from "react-redux";


const ChangePassword = ({show,onClose}) => {

    const [isDisabled, setIsDisabled] = useState(false);
    const dispatch= useDispatch();
    const {user} = useSelector((state)=>state.users);

    const handleFormSubmit = (values) => {
        setIsDisabled(true)
        const changePasswordRequest = {
            password: values.password,
            newPassword:values.confirmPassword
        };
        dispatch(changePassword({id:user.id, value:changePasswordRequest}));
        setTimeout(() => {
            setIsDisabled(false);
            onClose();
        }, 1000);
    };

    return (
        <>
            <Modal maskClosable={false} title={<div style={{ textAlign: 'center', fontSize: '20px' }}>Change password</div>} footer={[
            ]} open={show} onCancel={onClose}  bodyStyle={{ maxHeight: '300px', overflowY: 'auto' }}>
                <br/>
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onFinish={handleFormSubmit}
                    style={{ maxWidth: 600 }}
                    onClick={event => event.stopPropagation()}
                >
                <Form.Item
                    label="Password"
                    name="password"

                    rules={[
                        {
                            required: true,
                            message: 'Password' + isRequired,

                        },
                        {
                            min: 8,
                            message: errorLength,
                        }
                    ]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    label="Confirm password: "
                    name="confirmPassword"

                    rules={[
                        {
                            required: true,
                            message: 'Password' + isRequired,
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(errorCPass));
                            },
                        }),
                    ]}
                >
                    <Input.Password/>
                </Form.Item>
                    <Form.Item wrapperCol={{ offset: 18, span: 14 }}>
                        <Button type="primary" htmlType="submit" disabled={isDisabled}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default ChangePassword;