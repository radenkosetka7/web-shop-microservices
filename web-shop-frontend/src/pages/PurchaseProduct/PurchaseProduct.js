import React, {useState} from "react";
import './PurchaseModal.css';
import {Modal,Card} from "antd";
import {useSelector} from "react-redux";
import {Button, Form, Input, Radio} from 'antd';

const PurchaseProduct = ({show, onClose,onFinish}) => {

    const {selectedProduct} = useSelector((state) => state.products);

    const [chooseValue, setChooseValue] = useState(0);
    const onChange = (e) => {
        setChooseValue(e.target.value);
    };
    return (
        <Modal maskClosable={false} title={<div style={{textAlign: 'center', fontSize: '20px'}}>Buy product</div>}
               footer={[]} open={show} onCancel={onClose}>
            <br/>
            <Card style={{ display: 'flex', alignItems: 'center', width: 'fit-content', backgroundColor: 'transparent', borderColor:'black', marginRight: '10%' }}>
                <img
                    alt="example"
                    src={require("../../assets/products/" + selectedProduct.images[0].productImage +".png")}
                    className='image'
                />
                <div className='right'>

                    <p><strong>Name: </strong>{selectedProduct.title}</p>
                    <p><strong>Price: </strong>{selectedProduct.price}KM</p>
                    <p><strong>Product condition: </strong> {selectedProduct.isNew ? 'Used' : 'New'}</p>
                </div>
            </Card>

            <h3 style={{textAlign: 'center'}}>Select payment method</h3>
            <Radio.Group onChange={onChange} value={chooseValue}>
                <Radio value={0}>Cash on delivery</Radio>
                <Radio value={1}>By credit or debit card</Radio>
                <br/>
                <div style={{margin: '2%'}}>
                    {chooseValue === 0 && (
                        <Form
                            labelCol={{span: 8}}
                            wrapperCol={{span: 14}}
                            style={{maxWidth: 500}}
                            layout="horizontal"
                            onFinish={onFinish}
                            onClick={event => event.stopPropagation()}
                        >

                            <Form.Item wrapperCol={{offset: 2, span: 15}} label="Address" name="address" rules={[
                                {required: true, message: 'Please enter a valid address.'},
                            ]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item wrapperCol={{offset: 18, span: 15}}>
                                <Button style={{width: "fit-content", height: 'fit-content'}}
                                        type="primary"
                                        htmlType="submit">
                                    Finish
                                </Button>
                            </Form.Item>
                        </Form>
                    )}


                    {chooseValue === 1 && (
                        <Form
                            labelCol={{span: 8}}
                            wrapperCol={{span: 14}}
                            style={{maxWidth: 500}}
                            layout="horizontal"
                            onFinish={onFinish}
                            onClick={event => event.stopPropagation()}
                        >

                            <Form.Item wrapperCol={{offset: 2, span: 15}} label="Card number" name="cardNum" rules={[
                                {required: true, message: 'Please enter a valid card number.'},
                            ]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item wrapperCol={{offset: 18, span: 15}}>
                                <Button style={{width: "fit-content", height: 'fit-content'}}
                                        type="primary"
                                        htmlType="submit">
                                    Finish
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
                </div>
            </Radio.Group>

        </Modal>
    )
}

export default PurchaseProduct;