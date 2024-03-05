import './Register.css';
import {registration, uploadImage} from '../../services/auth.service';
import {
    signUpTitle, isRequired, errorLength, invalidEmail, errorCPass
} from '../../constant/constants';
import React, {useState} from 'react';
import {Button, Form, Input} from 'antd';
import {useEffect} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";


const Register = () => {

    const [isDisabled, setIsDisabled] = useState(false);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 75px)');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {authenticated} = useSelector((state) => state.users);

    useEffect(() => {
        if (authenticated)
            navigate('/');
    }, [authenticated, navigate, dispatch]);

    const [statusCode, setStatusCode] = useState(null);

    const [selectedFile, setSelectedFile] = useState();
    const [tempVariable, setTempVariable] = useState(null);
    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setTempVariable(1);
    };
    const onSubmit = async (registerData) => {
        setIsDisabled(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
            let responseImage = null;

            if (tempVariable !== null) {
                responseImage = await uploadImage(formData);
            }
            const registerReq = {
                name: registerData.name,
                surname: registerData.surname,
                city: registerData.city,
                username: registerData.username,
                password: registerData.password,
                mail: registerData.mail,
                avatar: tempVariable !== null ? responseImage.data : null
            }
            const response = await registration(registerReq);
            if (response.status === 200 || response.status === 201) {
                setStatusCode("Successfully registered.");
                setTimeout(() => {
                    navigate("/activateAccount", {state: {username: registerReq.username}});
                    setIsDisabled(false);
                }, 2000);
            } else {
                setIsDisabled(false);
            }
        } catch (error) {
            setIsDisabled(false);
        }

    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <div style={{backgroundColor: '#f3f1f1', height: contentHeight}}>
                <div className='linearGradient1'>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 9,
                        }}
                        wrapperCol={{
                            span: 12,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onSubmit}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <p className='form-title1'>{signUpTitle}</p>
                        <Form.Item
                            label="Firstname"
                            name="name"

                            rules={[
                                {
                                    required: true,
                                    message: 'Firstname' + isRequired,
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Lastname"
                            name="surname"

                            rules={[
                                {
                                    required: true,
                                    message: 'Lastname' + isRequired,
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Username"
                            name="username"

                            rules={[
                                {
                                    required: true,
                                    message: 'Username' + isRequired,

                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

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
                        <Form.Item
                            label="Email"
                            name="mail"
                            rules={[
                                {
                                    required: true,
                                    message: 'Email' + isRequired,
                                },
                                {
                                    type: "email",
                                    message: invalidEmail
                                }
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="City"
                            name="city"

                            rules={[
                                {
                                    required: true,
                                    message: 'City' + isRequired,
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Avatar"
                            name="avatar"
                        ><input type="file" onChange={changeHandler} id="file" name="file"
                                accept=".jpg, .jpeg, .png"/>
                        </Form.Item>
                        {
                            statusCode &&
                            <p className='error1' style={{maxWidth: "250px"}}>
                                {statusCode}
                            </p>

                        }
                        <Form.Item
                            wrapperCol={{
                                offset: 10,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit" disabled={isDisabled}>
                                {!isDisabled ? 'Submit' : 'Loading...'}
                            </Button>
                        </Form.Item>
                        <p className='signup-link'>
                            Already have an account?
                            <Link to="/login" className='signupLink'> Login</Link>
                        </p>
                    </Form>

                </div>
            </div>
        </div>

    )
}
export default Register;