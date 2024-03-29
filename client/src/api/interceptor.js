import axios from 'axios';
import CONTANTS from '../constants';
import { createBrowserHistory } from 'history';

const instance = axios.create({
  baseURL: CONTANTS.BASE_URL,
});

instance.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem(CONTANTS.ACCESS_TOKEN);
    if (token) {
      config.headers = { ...config.headers, Authorization: token };
    }
    return config;
  },
  err => Promise.reject(err)
);

instance.interceptors.response.use(
  response => {
    if (response.data.token) {
      window.localStorage.setItem(CONTANTS.ACCESS_TOKEN, response.data.token);
    }
    return response;
  },
  err => {
    const history = createBrowserHistory();
    if (
      err.response.status === 408 &&
      history.location.pathname !== '/login' &&
      history.location.pathname !== '/registration' &&
      history.location.pathname !== '/howItWorks' &&
      history.location.pathname !== '/'
    ) {
      history.replace('/login');
      history.go();
    }
    return Promise.reject(err);
  }
);

export default instance;
