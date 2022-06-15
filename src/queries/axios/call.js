import { httpClient } from './http.js';
import { ErrorCode } from './errorCode.js';

/*
Props {
  url: string;
  event?: any;
}
*/

require('dotenv').config();
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
  },
};

export const Post = async (props) => {
  return await httpClient
    .post(
      props.url,
      {
        data: props.event,
      },
      config
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      ErrorCode(err.response.status);
    });
};

export const Get = async (props) => {
  return await httpClient
    .get(props.url, config)
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      }
    })
    .catch((err) => {
      ErrorCode(err.response.status);
    });
};
