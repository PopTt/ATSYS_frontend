require('dotenv').config();

//api prefix
const api_prefix = 'api/';

//api port
export const APIPort = process.env.REACT_APP_API_PORT;

//User Authorize
const user_auth_prefix = api_prefix + 'auth/';
export const user_login = user_auth_prefix + 'login';
export const user_register = user_auth_prefix + 'register';
export const user_google_login = user_auth_prefix + 'google';
export const user_log_out = user_auth_prefix + 'logout';
