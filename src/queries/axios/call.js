import { httpClient } from './http.js';

/*
Props {
  url: string;
  event?: any;
}
*/

require('dotenv').config();

const config = {
  headers: {
    authorization: `Bearer ${localStorage.getItem(
      process.env.REACT_APP_ACCESS_TOKEN
    )}`,
  },
};

export const Post = async (url, data) => {
  return await httpClient
    .post(url, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err.response.status === 401)
        localStorage.removeItem(process.env.REACT_APP_ACCESS_TOKEN);
      throw new Error(err.response.data.message);
    });
};

export const Delete = async (url, data) => {
  return await httpClient
    .delete(url, { ...config, data: data })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err.response.status === 401)
        localStorage.removeItem(process.env.REACT_APP_ACCESS_TOKEN);
      throw new Error(err.response.data.message);
    });
};

export const Get = async (url) => {
  return await httpClient
    .get(url, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err.response.status === 401)
        localStorage.removeItem(process.env.REACT_APP_ACCESS_TOKEN);
      throw new Error(err.response.data.message);
    });
};
