import { Get, Post } from './axios/call.js';
import { create_event, get_event, get_events } from './api_path.js';

export const fetchEvent = async (event_id) => {
  return await Get(get_event + '/' + event_id);
};

export const fetchEvents = async (admin_id) => {
  return await Get(get_events + '/' + admin_id);
};

export const createEvent = async (data) => {
  return await Post(create_event, data);
};
