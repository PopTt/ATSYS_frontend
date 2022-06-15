import {
  backend,
  login as login_path,
  register as register_path,
  log_out as logout_path,
} from './api_path.js';
import { httpClient } from './axios/http.js';

require('dotenv').config();
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

export const login = async (user) => {
  return await httpClient
    .post(backend + login_path, user, {
      withCredentials: true,
    })
    .then((res) => {
      localStorage.setItem(ACCESS_TOKEN, res.data.token);
      return res.data;
    })
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
};

export const register = async (user) => {
  return await httpClient
    .post(backend + register_path, user, {
      withCredentials: true,
    })
    .then(() => {
      return true;
    })
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
};

export const logout = async () => {
  await httpClient.post(backend + logout_path);
};
