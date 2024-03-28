import base from "./base.service";
import { gateway } from "../constant/constants";

const instance = base.service(true);


export const commentProduct = (idProduct, commentData) => {
  return instance
    .post(gateway + `comments/${idProduct}`, commentData)
    .then((results) => results.data);
};

export const answerComment = (idComment, answerData) => {
  return instance
    .put(gateway + `comments/${idComment}`, answerData)
    .then((results) => results.data);
};

const Comment = {
  commentProduct,
  answerComment
};

export default Comment;