import { Button, Form, Input, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import {invalidEmail, isRequired} from "../../constant/constants";
import { getLoggedUser, updateUser } from "../../redux-store/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {uploadImage} from "../../services/auth.service";
import { PlusOutlined } from "@ant-design/icons";

const EditProfile = ({show,onClose}) => {

    const [isDisabled, setIsDisabled] = useState(false);
    const dispatch= useDispatch();
    const {loggedUser} = useSelector((state)=>state.users);
    const [avatar, setAvatar] = useState('');
    const [images,setImages]=useState([]);

    const handleChangeImage = ({fileList: newFileList}) => {
        setImages(newFileList);
        setAvatar(newFileList[0]);
    };


    const handleFormSubmit = async (values) => {
        setIsDisabled(true)

        if (loggedUser.firstname !== values.firstname || loggedUser.lastname !== values.lastname || loggedUser.email !== values.email ||
          loggedUser.city !== values.city || avatar) {

            let formData;
            let uid;
            if(avatar)
            {
                formData  = new FormData();
                formData.append("file",avatar.originFileObj)
                uid = avatar.uid
            }
            const uploadData = {
                firstname:values.firstname,
                lastname:values.lastname,
                city: values.city,
                avatar: avatar ? uid : loggedUser.avatar,
                email:values.email
            };
            await dispatch(updateUser({id:loggedUser.id,value:uploadData}));
            if(avatar)
            {
                uploadImage(formData,uid);
            }
            setTimeout(() => {
                setIsDisabled(false);
                onClose();
            }, 1000);
            dispatch(getLoggedUser({}));
        }

    };

    useEffect(() => {
        const img = require("../../assets/users/" + loggedUser.avatar + ".png")
        console.log('sta je avatar ' + img);
        setImages([
            {
                uid:'-1',
                name:'image.png',
                status:'done',
                url: img
            }
        ])
    }, [loggedUser]);

    return (
        <>
            <Modal maskClosable={false} title={<div style={{ textAlign: 'center', fontSize: '20px' }}>Edit profile</div>} footer={[
            ]} open={show} onCancel={onClose} >
                <br/>
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onFinish={handleFormSubmit}
                    style={{ maxWidth: 600 }}
                    onClick={event => event.stopPropagation()}
                    initialValues={{
                        firstname: loggedUser.firstname,
                        lastname: loggedUser.lastname,
                        email: loggedUser.email,
                        username:loggedUser.username,
                        city: loggedUser.city,
                    }}
                >
                    <Form.Item
                        label="Firstname"
                        name="firstname"

                        rules={[
                            {
                                required: true,
                                message: 'Firstname' + isRequired,

                            }
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Lastname: "
                        name="lastname"

                        rules={[
                            {
                                required: true,
                                message: 'Lastname' + isRequired,
                            }
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Username: "
                        name="username"

                    >
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label="Email: "
                        name="email"

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
                        label="City: "
                        name="city"

                        rules={[
                            {
                                required: true,
                                message: 'City' + isRequired,
                            }
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                      label="Avatar"
                      name="avatar"
                    ><Upload name={"file"}
                             accept=".png,.jpeg,.jpg"
                             className="m-2 custom-upload"
                             onChange={handleChangeImage}
                             fileList={images}
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

export default EditProfile;