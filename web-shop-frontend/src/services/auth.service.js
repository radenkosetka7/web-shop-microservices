import base from './base.service';
import {gateway} from "../constant/constants";

const instance = base.service();
export const login = (username, password) => {
    return instance
        .post( gateway + 'login', {username, password})
        .then((results) => {
            const {token} = results.data;
            sessionStorage.setItem('access', token);
            return results.data;
        })
        .catch((err) => Promise.reject(err.response.status));
}
export const registration = (registrationData) => {
    return instance
        .post(gateway + 'register', registrationData)
        .then((results) => results);
}

export const activateAccount = (activateAccountData) => {
    return instance
        .post(gateway +'activateAccount', activateAccountData)
        .then((results) => results);
}

export const uploadImage = (imageData) => {
    const file = imageData.get("file");
    return instance
        .post(gateway+'uploadAvatar', {file}, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((results) => results);
}

export const logout = () => sessionStorage.removeItem('access');
const auth = {
    login,
    registration,
    activateAccount,
    uploadImage,
    logout,
};
export default auth;
