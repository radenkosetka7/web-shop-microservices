import base from "./base.service";
import { gateway } from "../constant/constants";

const instance = base.service();
export const login = (username, password) => {
  return instance
    .post(gateway + "login", { username, password })
    .then((results) => {
      const { access_token } = results.data.data;
      sessionStorage.setItem("access", access_token);
      return results.data;
    })
    .catch((err) => Promise.reject(err.response.status));
};
export const registration = (registrationData) => {
  return instance
    .post(gateway + "register", registrationData)
    .then((results) => results);
};

export const activateAccount = (activateAccountData) => {
  return instance
    .post(gateway + "activateAccount", activateAccountData)
    .then((results) => results);
};

export const uploadImage = (file, uid) => {
  return instance
    .post(gateway + "uploadAvatar", file, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      params: {
        uid: uid
      }

    })
    .then((results) => results);
};

export const logout = () => sessionStorage.removeItem("access");
const auth = {
  login,
  registration,
  activateAccount,
  uploadImage,
  logout
};
export default auth;
