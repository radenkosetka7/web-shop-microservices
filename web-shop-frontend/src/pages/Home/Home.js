import React, {useEffect, useState} from 'react';
import {Layout, Pagination, Select, Input, InputNumber, Button} from 'antd';
import './Home.css';
import {ClearOutlined, SearchOutlined} from '@ant-design/icons';
import SearchComponent from "../../components/Search/Search";
import CardComponent from "../../components/Card/CardComponent";
import CategoryList from "../../components/CategoryList/CategoryList";
import {getLoggedUser} from "../../redux-store/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {getAllProducts, searchProduct,removeProduct} from "../../redux-store/productSlice";
import { getCategories, getCategory, getCategoryAttributes, removeCategory } from "../../redux-store/categorySlice";

const {Footer, Sider, Content} = Layout;
const Home = () => {

    const [contentHeight, setContentHeight] = useState('calc(100vh - 125px)');
    const [current, setCurrent] = useState(1);
    const [title, setTitle] = useState("");
    const {products,selectedProduct} = useSelector((state) => state.products);
    const [size, setSize] = useState(10);
    const [page, setPage] = useState(1);
    const {categories, selectedCategory,attributes} = useSelector((state) => state.categories);
    const [removeCategoryFlag, setRemoveCategoryFlag] = useState(0);
    const [selectedValue, setSelectedValue] = useState(null);
    const [location, setLocation] = useState(null);
    const [priceFrom, setPriceFrom] = useState(0);
    const [priceTo, setPriceTo] = useState(0);
    const [attributeValues, setAttributeValues] = useState({});
    const [searchAttrsClicked, setSearchAttrsClicked] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);


    const [selectedCategoryTemp, setSelectedCategoryTemp] = useState(null);

    const onChangeValue = (value) => {
        setSelectedValue(value);
    };


    const handleChangeRefreshKey = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };
    const handlePriceFromChange = (value) => {
        setPriceFrom(value);
    };

    const handlePriceToChange = (value) => {
        setPriceTo(value);
    };

    const onSearch = (value) => {
        setTitle(value);
        setCurrent(1);
        setPage(1);
    };
    const dispatch = useDispatch();

    const handleCategorySelect = (selectedKeys) => {
        setSelectedCategoryTemp(selectedKeys[0]);
    };
    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const onShowSizeChange = (current, pageSize) => {
        setSize(pageSize);
    };

    useEffect(() => {
        const token = sessionStorage.getItem('access');
        if (token !== null) {
            dispatch(getLoggedUser({}));
        }
        dispatch(getCategories({}));
    }, []);
    const handlePaginationChange = (newPage) => {
        setCurrent(newPage);
        setPage(newPage);
    };

    const handleClearFilters = () => {
        setSelectedValue(null);
        setLocation(null);
        setPriceFrom(0);
        setPriceTo(0);
        setAttributeValues({});
        setCurrent(1);
        setPage(1);
        setSearchAttrsClicked(false);
    };

    useEffect(() => {
        if (typeof selectedCategoryTemp === 'string') {
            setRemoveCategoryFlag(1);
            dispatch(getCategory({value: selectedCategoryTemp}));
            dispatch(getCategoryAttributes({value: selectedCategoryTemp}));
        } else if (removeCategoryFlag !== 0) {
            dispatch(removeCategory());
        }

    }, [selectedCategoryTemp])

    const attributeList = Object.values(attributeValues).map(attrData => {
        return {
            attributeId: attrData.id,
            value: attrData.value
        };
    });
    let searchData = {
        category: selectedCategory && typeof selectedCategoryTemp === 'string' ? selectedCategory.id : null,
        title: title === "" ? null : title,
        location: location !== null ? location : null,
        productStatus: selectedValue !== null ? (selectedValue === '1' ? true : false) : null,
        priceFrom: priceFrom !== 0 ? priceFrom : null,
        priceTo: priceTo !== 0 ? priceTo : null,
        attributeValueList: attributeList.length > 0 ? attributeList : null
    };

    useEffect(() => {

        if(selectedProduct !== null)
        {
            dispatch(removeProduct());
        }
        if (!searchAttrsClicked)
        {
            dispatch(getAllProducts({page, size, title}));

        } else if (searchAttrsClicked) {

            const response = dispatch(searchProduct({page: page, size: size, value: searchData}));
            if (response.error)
            {
                setSearchAttrsClicked(false);
                setCurrent(1);
                setPage(1);
            }
        }


    }, [page, size, title, searchAttrsClicked, refreshKey]);

    const handleSubmit = async () => {
        handleChangeRefreshKey();
        setSearchAttrsClicked(true);
        setCurrent(1);
        setPage(1);

    }

    return (<div style={{height: contentHeight}}>
        <SearchComponent onSearch={onSearch}/>
        <Layout style={{minHeight: '100%'}}>
            <Sider className="siderStyle"
                   breakpoint="lg"
                   style={{ backgroundColor: "#c5c5c5" }}
                   collapsedWidth="0">
                <h2 style={{ color: "black" }}>Filter</h2>
                <CategoryList categories={categories} onSelect={handleCategorySelect}
                              setSelectedCategoryTemp={setSelectedCategoryTemp} />
                <hr />
                <br />
                <div style={{ textAlign: "left", marginLeft: "3%" }}>
                    <Select
                      style={{ backgroundColor: "#c5c5c5" }}
                      placeholder="Select a status"
                      value={selectedValue}
                      onChange={onChangeValue}
                      onSearch={onSearch}
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                          {
                              value: "0",
                              label: "New"
                          },
                          {
                              value: "1",
                              label: "Used"
                          }
                      ]} />
                </div>
                <br />
                <div style={{ textAlign: "left", marginLeft: "3%", marginRight: "3%" }}>
                    <label style={{ color: "black", fontSize: "16px" }}>Location</label>
                    <Input value={location} onChange={handleLocationChange} />
                </div>
                <br />
                <div style={{ textAlign: "left", marginLeft: "3%", marginRight: "3%" }}>
                    <label style={{ color: "black", fontSize: "16px" }}>Price from</label>
                    <br />
                    <InputNumber value={priceFrom} min={0} onChange={handlePriceFromChange} style={{ width: "50%" }}
                                 placeholder="Price from" />
                </div>
                <div style={{ textAlign: "left", marginLeft: "3%", marginRight: "3%" }}>
                    <label style={{ color: "black", fontSize: "16px" }}>Price to</label>
                    <br />
                    <InputNumber value={priceTo} style={{ width: "50%" }} min={priceFrom} onChange={handlePriceToChange}
                                 placeholder="Price to" />
                </div>
                <br />
                <br />
                {selectedCategoryTemp && (
                  <div style={{ marginRight: "3%" }}><h3 style={{ color: "black" }}>Specific attributes</h3>
                      <hr />
                      {selectedCategory != null && attributes.map((attribute) => (
                        <div key={attribute.id} style={{ textAlign: "left", marginLeft: "3%" }}>
                            <label style={{ color: "black", fontSize: "16px" }}>{attribute.name}</label>
                            <br />
                            {attribute.type === "STRING" &&
                              <Input value={attributeValues[attribute.id]?.value || null} onChange={(e) => {
                                  const newValue = e.target.value;
                                  setAttributeValues(prevValues => ({
                                      ...prevValues,
                                      [attribute.id]: {
                                          id: attribute.id,
                                          name: attribute.name,
                                          type: attribute.type,
                                          value: newValue
                                      }
                                  }));
                              }} />}
                            {(attribute.type === "INT" || attribute.type === "DOUBLE") &&
                              <InputNumber value={attributeValues[attribute.id]?.value || 0} min={0}
                                           onChange={(value) => setAttributeValues(prevValues => ({
                                               ...prevValues,
                                               [attribute.id]: {
                                                   id: attribute.id,
                                                   name: attribute.name,
                                                   type: attribute.type,
                                                   value: value
                                               }
                                           }))} />}
                        </div>
                      ))}

                  </div>)
                }
                <br />
                <br />
                <Button onClick={handleSubmit} type="primary" icon={<SearchOutlined />}>
                    Search
                </Button>
                <br />
                <br />
                <Button onClick={handleClearFilters} type="default" icon={<ClearOutlined />}>
                    Clear filters
                </Button>
            </Sider>
            <Layout>
                <Content className="contentStyle">
                    <div className="contentDiv">
                        {products.products && products.products.length !== 0 ? (
                            products.products.map(product => (
                              <div className="productCard">
                                  <CardComponent key={product.id} product={product}
                                                 handleChangeRefreshKey={handleChangeRefreshKey} />
                              </div>
                            ))
                          ) :
                            (
                                <p style={{color: "black", fontWeight: "bold", fontSize: "20px"}}>Loading...</p>
                            )}
                    </div>
                </Content>
                <Footer style={{backgroundColor: "#1d8f8a"}} className='footerStyle'>
                    {products.products && products.total && (
                        <Pagination
                            showSizeChanger
                            onShowSizeChange={onShowSizeChange}
                            onChange={handlePaginationChange}
                            current={current}
                            total={products.total}
                        />
                    )}
                </Footer>
            </Layout>
        </Layout>
    </div>)
};
export default Home;