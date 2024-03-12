import base from './base.service';
import {gateway} from "../constant/constants";

const instance = base.service();
const authInstance = base.service(true);

export const getAllCategories = () => {
    return instance
        .get(gateway+'categories/')
        .then((results) => results.data);
};

export const getCategory = (idCategory) => {
    return authInstance
        .get(gateway+`categories/${idCategory}`)
        .then((results) => results.data);
};

export const createCategory = (categoryData) => {
    return authInstance
        .post(gateway+'categories/',categoryData)
        .then((results) => results.data);
};

export const getCategoryAttributes = (id) => {
    return authInstance
        .get(gateway+`categories/${id}/attributes`)
        .then((results) => results.data);
};

export const updateCategory = (idCategory,dataToUpdate) => {
    return authInstance
        .put(gateway+`categories/${idCategory}`,dataToUpdate)
        .then((results) => results.data);
};

export const updateAttribute = (idAttribute,dataToUpdate) => {
    return authInstance
        .put(gateway+`attributes/${idAttribute}`,dataToUpdate)
        .then((results) => results.data);
};

export const deleteCategory = (idCategory) => {
    return authInstance
        .delete(gateway+`categories/${idCategory}`)
        .then((results) => results.data);
};



const Category = {
    getCategory,
    getAllCategories,
    createCategory,
    getCategoryAttributes,
    updateCategory,
    updateAttribute,
    deleteCategory
}
export default Category;