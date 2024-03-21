import React, {useEffect, useState} from 'react';
import './Profile.css'
import {useDispatch, useSelector} from "react-redux";
import {FaBox, FaEdit, FaMoneyCheck, FaShoppingCart} from "react-icons/fa";
import {Button, Layout, Pagination} from "antd";
import jwtDecode from "jwt-decode";
import { getLoggedUser, getUser } from "../../redux-store/userSlice";
import EditProfile from "../EditProfile/EditProfile";
import ChangePassword from "../../components/ChangePassword/ChangePassword";
import {getAllProductsForSeller, getAllProductsForBuyer, removeProduct} from "../../redux-store/productSlice";
import CardComponent from "../../components/Card/CardComponent";

const {Footer, Sider, Content} = Layout;

const Profile = () => {

    const [profileModal, setProfileModal] = useState(false);
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [page, setPage] = useState(current);
    const {loggedUser} = useSelector((state) => state.users);
    const [passwordModal, setPasswordModal] = useState(false);
    const dispatch = useDispatch();
    const [refreshKey, setRefreshKey] = useState(0);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 73px)');
    const [activeProducts, setActiveProducts] = useState(true);
    const [soldProducts, setSoldProducts] = useState(false);
    const [purchasedProducts, setPurchasedProducts] = useState(false);

    const {products,selectedProduct} = useSelector((state) => state.products);


    const onShowSizeChange = (current, pageSize) => {
        setSize(pageSize);
    };
    const handlePaginationChange = (newPage) => {
        setCurrent(newPage);
        setPage(newPage);
    };
    const handleEditProfileOpen = () => {
        setProfileModal(true);

    };

    const handleActiveProductsOpen = () => {
        if(current>1)
        {
            setCurrent(1);
            setPage(1);
        }
        setActiveProducts(true);
        setSoldProducts(false);
        setPurchasedProducts(false);
    };

    const handleSoldProductsOpen = () => {
        if(current>1)
        {
            setCurrent(1);
            setPage(1);
        }
        setSoldProducts(true);
        setActiveProducts(false);
        setPurchasedProducts(false);
    };

    const handlePurchasedProductsOpen = () => {
        if(current>1)
        {
            setCurrent(1);
            setPage(1);
        }
        setPurchasedProducts(true);
        setActiveProducts(false);
        setSoldProducts(false);
    };
    const handleEditProfileClose = () => {
        setProfileModal(false);
        handleChangeRefreshKey();

    };

    const handleChangeRefreshKey = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const handleChangePassowrdOpen = () => {
        setPasswordModal(true);

    };
    const handleChangePassowrdClose = () => {
        setPasswordModal(false);

    };

    useEffect(()=>
    {

        if(selectedProduct !== null)
        {
            dispatch(removeProduct());
        }
        if(activeProducts)
       {
           dispatch(getAllProductsForSeller({page:page,size:size,finished:0}));

       }
       else if(soldProducts)
       {
           dispatch(getAllProductsForSeller({page:page,size:size,finished:1}));
       }
       else if(purchasedProducts)
       {
           dispatch(getAllProductsForBuyer({page:page,size:size}))
       }

    },[activeProducts,soldProducts,purchasedProducts,page,size,refreshKey]);


    return (<div style={{height: contentHeight}}>
        <Layout style={{minHeight: '100%'}}>
            <Sider
                breakpoint="lg"
                style={{backgroundColor: "#c5c5c5"}}
                collapsedWidth="0">
                <div className='left'>
                    {loggedUser ? (
                        <div className='leftSide'>
                            <div className='userImageContainer'>
                                <img className='userImage'
                                     src={loggedUser.avatar !== null ? require("/usr/src/app/src/assets/users/" + loggedUser.avatar+".png") : require("/usr/src/app/src/assets/user_318-159711.avif")}
                                     alt="User"/>
                            </div>
                            <p className='name'>{loggedUser.username}</p>
                            <Button type="primary" className='editButton' onClick={handleEditProfileOpen}>
                                <FaEdit style={{marginRight: '5px'}}/>
                                Edit Profile
                            </Button>
                        </div>


                    ) : null}
                    <div>
                        <br/>
                        <Button type="primary" onClick={handleChangePassowrdOpen} className='editButton'>
                            <FaEdit style={{marginRight: '5px'}}/> Change password
                        </Button>
                        <br/>
                        <Button type="primary" disabled={activeProducts} onClick={handleActiveProductsOpen} className='editButton'>
                            <FaBox style={{marginRight: '5px'}}/>
                            Active products
                        </Button>
                        <br/>
                        <Button type="primary" onClick={handleSoldProductsOpen} disabled={soldProducts} className='editButton'>
                            <FaMoneyCheck style={{marginRight: '5px'}}/>
                            Sold products
                        </Button>
                        <br/>
                        <Button type="primary" onClick={handlePurchasedProductsOpen} disabled={purchasedProducts} className='editButton'>
                            <FaShoppingCart style={{marginRight: '5px'}}/>
                            My purchase
                        </Button>
                    </div>
                </div>
            </Sider>
            {(activeProducts || soldProducts || purchasedProducts) && (
                <Layout>
                    <Content className='contentStyle'>
                        <div className='contentDiv'>
                            {products && products.products.length !== 0 ? (
                                    products.products.map(product => (
                                        <div className='productCard'>
                                        <CardComponent key={product.id} product={product} handleChangeRefreshKey={handleChangeRefreshKey}/>
                                        </div>
                                    ))
                                ) :
                                (
                                    <p style={{color: "black", fontWeight: "bold", fontSize: "20px"}}>No products found.</p>
                                )}
                        </div>
                    </Content>
                    <Footer style={{backgroundColor: "#1d8f8a", textAlign: 'center', color: 'fff'}}>
                        <Pagination
                            showSizeChanger
                            onShowSizeChange={onShowSizeChange}
                            onChange={handlePaginationChange}
                            current={current}
                            total={products.totalElements}
                        />
                    </Footer>
                </Layout>)}
        </Layout>
        {profileModal && <EditProfile show={profileModal} onClose={handleEditProfileClose}/>}
        {passwordModal && <ChangePassword show={passwordModal} onClose={handleChangePassowrdClose}/>}

    </div>);
};

export default Profile;