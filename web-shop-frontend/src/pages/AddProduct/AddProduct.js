import {Modal,Steps,} from 'antd';
import {useDispatch} from "react-redux";
import React, {useState} from "react";
import GeneralForm from "../Forms/GeneralForm";
import ImagesForm from "../Forms/ImagesForm";
import SelectCategory from "../Forms/SelectCategory";
import AttributeForm from "../Forms/AttributeForm";
import Finished from "../Forms/Finished";
import {uploadImages} from "../../services/product.service";
import {createProduct} from "../../redux-store/productSlice";
const AddProduct = ({show,onClose}) => {
    const dispatch = useDispatch();
    const handleClick = (e) => {
        e.stopPropagation();
    };

    const [isDisabled, setIsDisabled] = useState(false);
    const [statusCode, setStatusCode] = useState(null);

    const[currentPage,setCurrentPage] = useState(0);
    const[generalDetails,setGeneralDetails]=useState(null);
    const onFinishedGeneral=(values) => {
        setGeneralDetails(values);
        setCurrentPage(1);
    }

    const handleFormSubmit = async (values) => {
        setIsDisabled(true)

         const responseImages = await uploadImages(imageDetails);
        const imagesRequests = responseImages.data.map(imageName => {
            return { productImage: imageName };
        });

        const resultAttributes = Object.entries(attributeDetails).map(([attributId, value]) => ({
            value: value,
            attributeId: parseInt(attributId)
        }));


        const productRequest= {
            title: generalDetails.name,
            description: generalDetails.description,
            price: generalDetails.price,
            productStatus: generalDetails.condition === true ? 0 : 1,
            city: generalDetails.city,
            contact: generalDetails.contact,
            categoryId: categoryDetails.category,
            images: imagesRequests,
            attributeValues: resultAttributes
        };

        dispatch(createProduct({value:productRequest}));
        setTimeout(() => {
            setIsDisabled(false);
            onClose();
        }, 1000);
    };

    const[imageDetails,setImageDetails]=useState(null);
    const[categoryDetails,setCategoryDetails]=useState(null);
    const [attributeDetails,setAttributeDetails]=useState(null);

    const onFinishedImage=(values) => {
        setImageDetails(values.images);
        setCurrentPage(2);
    }
    const onFinishedCatergory=(values) => {
        setCategoryDetails(values);
        setCurrentPage(3);
    }
    const onFinishedAttribute=(values) => {
        setAttributeDetails(values);
        setCurrentPage(4)
    }
    const isStepDisabled = (number) => {
        if(number === 0)
        {
            return false;
        }
        if(number === 1)
        {
            return generalDetails === null;
        }
        if(number === 2)
        {
            return generalDetails === null || imageDetails === null
        }
        if(number === 3)
        {
            return generalDetails === null || imageDetails === null || categoryDetails === null
        }
        if(number === 4)
        {
            return generalDetails === null || imageDetails === null || categoryDetails === null || attributeDetails === null
        }
    }
    const forms= [
        <GeneralForm onFinish={onFinishedGeneral} initialValues={generalDetails}/>,
        <ImagesForm onFinish={onFinishedImage}/>,
        <SelectCategory onFinish={onFinishedCatergory} initialValues={categoryDetails}/>,
        <AttributeForm onFinish={onFinishedAttribute} categoryId={categoryDetails!==null ? categoryDetails.category:0} initialValues={attributeDetails}/>,
        <Finished onFinish={handleFormSubmit} isDisabled={isDisabled}/>
    ]

    return (
        <>
            <Modal width="50%"  maskClosable={false} title={<div style={{ textAlign: 'center', fontSize: '20px' }}>Add new product</div>} footer={[
            ]} open={show} onCancel={onClose}  bodyStyle={{ maxHeight: '410px', overflowY: 'auto', width:"100%"  }}>
                <Steps onChange={setCurrentPage} current={currentPage}>
                    <Steps.Step disabled={isStepDisabled(0)} title='General' ></Steps.Step>
                    <Steps.Step disabled={isStepDisabled(1)} title='Images'></Steps.Step>
                    <Steps.Step disabled={isStepDisabled(2)} title='Category'></Steps.Step>
                    <Steps.Step disabled={isStepDisabled(3)} title='Attributes'></Steps.Step>
                    <Steps.Step disabled={isStepDisabled(4)} title='Finished'></Steps.Step>
                </Steps>
                {forms[currentPage]}
            </Modal>
        </>
    );
};
export default AddProduct;