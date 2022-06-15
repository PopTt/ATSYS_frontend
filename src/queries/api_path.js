require('dotenv').config();

export const backend = process.env.REACT_APP_BACKEND;

const user_path = 'users/';
export const login = user_path + 'login';
export const register = user_path + 'register';
export const log_out = user_path + 'logout';
