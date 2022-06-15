require('dotenv').config();

export const backend = process.env.REACT_APP_BACKEND;

const user_path = 'users/';
export const login = user_path + 'login';
export const register = user_path + 'register';
export const log_out = user_path + 'logout';

const event_path = backend + 'events/';
export const create_event = event_path + 'create';
export const get_event = event_path + 'getEvent';
export const get_events = event_path + 'getEvents';
