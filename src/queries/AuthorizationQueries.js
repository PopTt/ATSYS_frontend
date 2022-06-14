import {
  APIPort,
  user_login,
  user_register,
  user_google_login,
  user_log_out,
} from '../links/api.js';
import { httpClient } from './axios/http.js';

export const login = async (user) => {
  let url = APIPort + user_login;
  if (user.ref) url = APIPort + user_google_login;

  return await httpClient
    .post(
      url,
      {
        data: user,
      },
      {
        withCredentials: true,
      }
    )
    .then((res) => {
      return JSON.parse(res.data.user);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export const register = async (user) => {
  return await httpClient
    .post(
      APIPort + user_register,
      {
        data: user,
      },
      {
        withCredentials: true,
      }
    )
    .then((res) => {
      return JSON.parse(res.data.user);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export const logout = async () => {
  await httpClient.post(APIPort + user_log_out);
};
