import { Get, Post } from './axios/call.js';
import {
  create_attendance,
  get_event_attendances,
  get_users_event_attendances,
} from './api_path.js';

export const fetchEventAttendances = async (event_id) => {
  return await Get(get_event_attendances + '/' + event_id);
};

export const fetchUsersEventAttendances = async (attendance_id) => {
  return await Get(get_users_event_attendances + '/' + attendance_id);
};

export const createAttendance = async (data) => {
  return await Post(create_attendance, data);
};
