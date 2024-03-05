import base from './base.service';
import {gateway} from "../constant/constants";

const instance = base.service();
const authInstance = base.service(true);


export const getAllProducts = (page,size,title) => {
    return instance
        .get(gateway+`products`, {
            params: {
                page: page,
                size: size,
                title: title
            },
        })
        .then((results) => results.data);
};

export const getProductByid = (idProduct) => {
    return instance
        .get(gateway+`products/${idProduct}`)
        .then((results) => results.data);
};

export const searchProduct = (page, size, searchProduct) => {
    return instance
        .post(gateway+`products/search`, searchProduct, {
            params: {
                page: page,
                size: size,
            },
        })
        .then((results) => results.data);
};


export const addProduct = (productData) => {
    return authInstance
        .post(gateway+`products`,productData)
        .then((results) => results.data);
};

export const getAllProductsForBuyer = (page,size) => {
    return authInstance
        .get(gateway+`purchasedProducts`,{
            params: {
                page: page,
                size: size,
            },
        })
        .then((results) => results.data);
};

export const getAllProductsForSeller = (page,size,finished) => {
    return authInstance
        .get(gateway+`soldProducts`, {
            params: {
                page: page,
                size: size,
                finished: finished,
            },
        })
        .then((results) => results.data);
};

export const uploadImages = (imageData) => {

    const formData = new FormData();
    imageData.forEach(file => {
        formData.append("files", file);
    });

    return authInstance
        .post(gateway+ 'products/uploadImages', formData)
        .then((results) => results);
}

export const purchaseProduct = (idProduct) => {
    return authInstance
        .put(gateway+`products/${idProduct}`)
        .then((results) => results.data);
};

export const deleteProduct = (idProduct) => {
    return authInstance
        .delete(gateway+`products/${idProduct}`)
        .then((results) => results.data);
};


const Product = {
    getAllProducts,
    getProductByid,
    searchProduct,
    addProduct,
    purchaseProduct,
    deleteProduct,
    getAllProductsForSeller,
    getAllProductsForBuyer,
    uploadImages
}

export default Product;