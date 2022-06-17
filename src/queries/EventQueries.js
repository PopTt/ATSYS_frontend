import { Get, Post } from './axios/call.js';
import {
  add_event_instructors,
  create_event,
  get_event,
  get_events,
  get_event_members,
  get_not_in_event_instructors,
} from './api_path.js';

export const fetchEvent = async (event_id) => {
  return await Get(get_event + '/' + event_id);
};

export const fetchEvents = async (admin_id) => {
  return await Get(get_events + '/' + admin_id);
};

export const fetchEventMembers = async (event_id) => {
  return await Get(get_event_members + '/' + event_id);
};

export const fetchNotInEventInstructors = async (admin_id, event_id) => {
  return await Get(
    get_not_in_event_instructors + '/' + admin_id + '/' + event_id
  );
};

export const createEvent = async (data) => {
  return await Post(create_event, data);
};

export const addEventInstructors = async (data) => {
  return await Post(add_event_instructors, data);
};
