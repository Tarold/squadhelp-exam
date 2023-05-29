import queryString from 'query-string';
import http from '../interceptor';

export const registerRequest = data => http.post('registration', data);
export const loginRequest = data => http.post('login', data);
export const getUser = () => http.post('getUser');
export const setNewOffer = data => http.post('setNewOffer', data);
export const setOfferStatus = data => http.post('setOfferStatus', data);
export const downloadContestFile = data =>
  http.get(`downloadFile/${data.fileName}`);
export const payMent = data => http.post('contests', data.formData);
export const changeMark = data => http.post('changeMark', data);
export const dataForContest = data => http.post('dataForContest', data);
export const cashOut = data => http.post('cashout', data);
export const updateUser = data => http.post('updateUser', data);

export const getCustomersContests = data =>
  http.get(`contests/byCustomer?${queryString.stringify(data)}`);

export const getActiveContests = data =>
  http.get(`contests?${queryString.stringify(data)}`);

export const updateContest = ({ contestId, data }) => {
  return http.patch(`contests/${contestId}`, data);
};

export const getContestById = ({ contestId }) =>
  http.get(`contests/${contestId}`);

export const newMessage = data => http.post('chat', data);
export const getPreviewChat = () => http.get('chat');
export const getDialog = data => http.get(`chat/${data}`);
export const changeChatBlock = data => http.post('chat/block', data);
export const changeChatFavorite = data => http.post('chat/fav', data);

export const getCatalogList = data => http.get('chat/catalog', data);
export const createCatalog = data => http.post('chat/catalog', data);
export const deleteCatalog = data =>
  http.delete(`chat/catalog/${data.catalogId}`);
export const changeCatalogName = data =>
  http.patch(`chat/catalog/${data.catalogId}`, data);

export const addChatToCatalog = data =>
  http.post(`chat/catalog/${data.catalogId}/${data.chatId}`);
export const removeChatFromCatalog = data =>
  http.delete(`chat/catalog/${data.catalogId}/${data.chatId}`);

export const getTransactions = () => http.get('users/id/transactions');
