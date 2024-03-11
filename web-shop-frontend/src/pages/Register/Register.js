import './Register.css';
import {registration, uploadImage} from '../../services/auth.service';
import {
  signUpTitle, isRequired, errorLength, invalidEmail, errorCPass
} from '../../constant/constants';
import React, {useState} from 'react';
import { Button, Form, Input, Upload } from "antd";
import {useEffect} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import { PlusOutlined } from "@ant-design/icons";

const Register = () => {

  const [isDisabled, setIsDisabled] = useState(false);
  const [contentHeight, setContentHeight] = useState('calc(100vh - 75px)');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [avatar, setAvatar] = useState("");


  const {authenticated} = useSelector((state) => state.users);

  useEffect(() => {
    if (authenticated)
      navigate('/');
  }, [authenticated, navigate, dispatch]);

  const handleChangeImage = ({fileList: newFileList}) => {
    if (newFileList.length === 0) {
      //formik.setFieldValue("avatar", "")
    } else {
      //formik.setFieldValue("avatar ", newFileList[0])
    }
    setImages(newFileList);
    setAvatar(newFileList[0]);
    //setAvatarValue(newFileList[0]);
  };

  const [statusCode, setStatusCode] = useState(null);

  const [selectedFile, setSelectedFile] = useState('');
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const onSubmit = async (registerData) => {
    setIsDisabled(true);
    let formData;
    let uid;
    if(avatar)
    {
      formData  = new FormData();
      formData.append("file",avatar.originFileObj)
      uid = avatar.uid
    }
    try {
      const registerReq = {
        firstname: registerData.name,
        lastname: registerData.surname,
        city: registerData.city,
        username: registerData.username,
        password: registerData.password,
        email: registerData.mail,
        avatar: avatar ? uid : null
      }
      await registration(registerReq);
      if(avatar)
      {
        uploadImage(formData,uid);
      }
        setStatusCode("Successfully registered.");
        setTimeout(() => {
          navigate("/activateAccount", {state: {username: registerReq.username}});
          setIsDisabled(false);
        }, 2000);
    } catch (error) {
      setStatusCode(error.response.data.message);
      setIsDisabled(false);
    }

  }
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
            > <Upload
              name={"file"}
              accept=".png,.jpeg,.jpg"
              className="m-2 custom-upload"
              beforeUpload={() => false}
              listType="picture-card"
              fileList={images}
              onChange={handleChangeImage}
              maxCount={1}
            >
              <button type="button">
                <PlusOutlined />
                <div>
                  Upload
                </div>
              </button>
            </Upload>
            </Form.Item>
            {
              statusCode &&
              <p className="error1" style={{ maxWidth: "250px" }}>
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