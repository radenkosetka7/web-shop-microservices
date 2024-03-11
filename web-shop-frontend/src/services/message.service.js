import base from './base.service';
import {gateway} from "../constant/constants";

const instance = base.service(true);
export const createMessage = (messageData) => {
    return instance
        .post(gateway+'messages', messageData)
        .then((results) => results.data);
};

export const readMessage = (idMessage) => {
    return instance
        .put(gateway+`messages/${idMessage}`)
        .then((results) => results.data);
};

export const getMessages = (page,size,content) => {
    return instance
        .get(gateway+'messages', {
            params: {
                page: page,
                size: size,
                content: content
            },
        })
        .then((results)=>results.data);
};


export const getMessage = (idMessage) => {
    return instance
        .get(gateway+`messages/${idMessage}`)
        .then((results) => results.data);
};

export const replyMessage = (replyData) => {
    return instance
        .post(gateway+'replyMessage', replyData)
        .then((results)=>results.data);
};



const Message = {
    createMessage,
    readMessage,
    getMessages,
    getMessage,
    replyMessage
}
export default Message;