import { httpClient } from './http.js';
import { ErrorHandler } from '../helpers/errorHandler.js';

/*
Props {
  url: string;
  event?: any;
}
*/

const axiosConfig = {};

export const AxiosPost = async (props) => {
  return await httpClient
    .post(
      props.url,
      {
        data: props.event,
      },
      axiosConfig
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      ErrorHandler(err.response.status);
    });
};

export const AxiosDelete = async (props) => {
  return await httpClient
    .delete(props.url, {
      data: props.event,
    })
    .then((res) => {
      if (res.status === 201) {
        return res.data;
      }
    })
    .catch((err) => {
      ErrorHandler(err.response.status);
    });
};

export const AxiosGetByUrlId = async (props) => {
  return await httpClient
    .get(props.url, axiosConfig)
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      }
    })
    .catch((err) => {
      ErrorHandler(err.response.status);
    });
};
