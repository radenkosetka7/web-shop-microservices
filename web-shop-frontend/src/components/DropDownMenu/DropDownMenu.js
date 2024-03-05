import React, {useState} from 'react';
import './DropDownMenu.css';
import {LogoutOutlined, UserOutlined, QuestionOutlined} from '@ant-design/icons';
import {Dropdown, Space} from 'antd';
import {PlusSquareOutlined} from "@ant-design/icons";
import {logout} from "../../redux-store/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import CustomerSupportModal from "../../pages/CustomerSupport/CustomerSupportModal";
import AddProduct from "../../pages/AddProduct/AddProduct";

const items = [
    {
        key: '1',
        label: 'My profile',
        icon: <UserOutlined/>
    },
    {
        key: '2',
        label: 'New offer',
        icon: <PlusSquareOutlined/>
    },
    {
        key: '3',
        label: 'Support',
        icon: <QuestionOutlined/>
    },
    {
        key: '4',
        label: 'Logout',
        icon: <LogoutOutlined/>
    },
];

const DropDownMenu = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector((state) => state.users);

    const [supportModal, setSupportModal] = useState(false);
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
    };

    const handleCloseSupportModal = () => {
        setSupportModal(false);
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
                    items,
                    onClick
                }}
            >
                <a onClick={(e) => e.preventDefault()}>
                    <div className='logo-map'>
                        <div className='round-image-container'>
                            <img className='confLogo round-image' src={ user.avatar !== null ? require("../../assets/users/" + user.avatar):require("../../assets/user_318-159711.avif")}  alt="Logo"/>
                        </div>
                    </div>
                </a>
            </Dropdown>
            { supportModal && <CustomerSupportModal show={supportModal} onClose={handleCloseSupportModal}/> }
            { addProductModal && <AddProduct show={addProductModal} onClose={handleCloseAddProductModal}/> }
        </div>

    );
}
export default DropDownMenu;