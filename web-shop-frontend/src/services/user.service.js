import base from './base.service';
import {gateway} from "../constant/constants";

const instance = base.service(true);


export const getUsers = (page,size,name) => {
    return instance
        .get(gateway+'users', {
            params: {
                page: page,
                size: size,
                name: name
            },
        })
        .then((results)=>results.data);
};

export const getUserInfo = () => {
    return instance
        .get(gateway+`userInfo`)
        .then((results) => results.data);
};

export const getUser = (idUser) => {
    return instance
        .get(gateway+`users/${idUser}`)
        .then((results) => results.data);
};

export const updateUser = (idUser,dataToUpdate) => {
    return instance
        .put(gateway+`users/${idUser}`,dataToUpdate)
        .then((results) => results.data);
};

export const changePassword = (dataToUpdate) => {
    return instance
        .put(gateway+'changePassword',dataToUpdate)
        .then((results) => results.data);
};

export const adminRegister = (registrationData) => {
    return instance
        .post(gateway + 'admin/createUser', registrationData)
        .then((results) => results);
}

export const adminUpdateUser = (idUser,dataToUpdate) => {
    return instance
        .put(gateway+`admin/${idUser}/updateUser`,dataToUpdate)
        .then((results) => results.data);
};

export const blockUser = (idUser) => {
    return instance
        .put(gateway+`admin/${idUser}/blockUser`)
        .then((results) => results.data);
};


const User = {
    getUser,
    updateUser,
    changePassword,
    getUsers,
    getUserInfo,
    adminRegister,
    adminUpdateUser,
    blockUser
}
export default User;


