import React, {useState} from 'react';
import './DropDownMenu.css';
import {LogoutOutlined, UserOutlined, QuestionOutlined} from '@ant-design/icons';
import {Dropdown} from 'antd';
import {PlusSquareOutlined} from "@ant-design/icons";
import {logout} from "../../redux-store/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import CustomerSupportModal from "../../pages/CustomerSupport/CustomerSupportModal";
import AddProduct from "../../pages/AddProduct/AddProduct";
import ChangePassword from "../ChangePassword/ChangePassword";


const DropDownMenu = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loggedUser} = useSelector((state) => state.users);

    const generateDynamicItems = () => {
        const dynamicItems = [];

        if (loggedUser.role == 0 || loggedUser.role == 1) {
            dynamicItems.push({
                key: '5',
                label: 'Change password',
                icon: <QuestionOutlined/>
            });

            dynamicItems.push({
                key: '4',
                label: 'Logout',
                icon: <LogoutOutlined/>
            });
        } else {
            dynamicItems.push({
                key: '1',
                label: 'My profile',
                icon: <UserOutlined/>
            });
            dynamicItems.push({
                key: '2',
                label: 'New offer',
                icon: <PlusSquareOutlined/>
            });
            dynamicItems.push({
                key: '3',
                label: 'Support',
                icon: <QuestionOutlined/>
            });
            dynamicItems.push({
                key: '4',
                label: 'Logout',
                icon: <LogoutOutlined/>
            });
        }

        return dynamicItems;
    };
    const [supportModal, setSupportModal] = useState(false);
    const [changePasswordModal, setChangePasswordModal] = useState(false);

    const [addProductModal, setAddProductModal] = useState(false);
    const onClick = ({key}) => {
        if (key === '4') {
            handleLogout();
        } else if (key === '3') {
            setSupportModal(true);
        }
        else if (key === '2')
        {
            setAddProductModal(true);
        }
        else if( key === '1')
        {
            navigate('/myProfile');
        }
        else if( key == '5')
        {
            setChangePasswordModal(true);
        }
    };

    const handleCloseSupportModal = () => {
        setSupportModal(false);
    };
    const handleCloseChangePasswordModal = () => {
        setChangePasswordModal(false);
    };


    const handleCloseAddProductModal = () => {
        setAddProductModal(false);
    };



    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };
    return (
        <div>
            <Dropdown
              menu={{
                  items: generateDynamicItems(),
                  onClick
              }}
            >
                <a onClick={(e) => e.preventDefault()}>
                    <div className='logo-map'>
                        <div className='round-image-container'>
                            <img className='confLogo round-image' src={ loggedUser.avatar !== null ? require("/usr/src/app/src/assets/users/" + loggedUser.avatar+".png"):require("/usr/src/app/src/assets/user_318-159711.avif")}  alt="Logo"/>
                        </div>
                    </div>
                </a>
            </Dropdown>
            { supportModal && <CustomerSupportModal show={supportModal} onClose={handleCloseSupportModal}/> }
            { addProductModal && <AddProduct show={addProductModal} onClose={handleCloseAddProductModal}/> }
            { changePasswordModal && <ChangePassword show={changePasswordModal} onClose={handleCloseChangePasswordModal}/> }
        </div>

    );
}
export default DropDownMenu;