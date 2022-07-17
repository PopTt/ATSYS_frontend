import { Get, Post, Delete } from './axios/call.js';
import {
  assign_users,
  create_attendance,
  update_attendance,
  update_status,
  delete_attendance,
  get_attendance,
  get_qr_code,
  get_user_attendance_histories,
  get_event_attendances,
  get_users_event_attendances,
} from './api_path.js';

export const fetchAttendance = async (attendance_id) => {
  return await Get(get_attendance + '/' + attendance_id);
};

export const fetchQRCode = async (attendance_id) => {
  return await Get(get_qr_code + '/' + attendance_id);
};

export const fetchUserHistory = async (user_id, event_id) => {
  return await Get(
    get_user_attendance_histories + '/' + user_id + '/' + event_id
  );
};

export const fetchEventAttendances = async (event_id) => {
  return await Get(get_event_attendances + '/' + event_id);
};

export const fetchUsersEventAttendances = async (attendance_id) => {
  return await Get(get_users_event_attendances + '/' + attendance_id);
};

export const createAttendance = async (data) => {
  let response = await Post(create_attendance, data);
  return await Post(assign_users, {
    event_id: data.event_id,
    attendance_id: response.data.insertId,
  });
};

export const updateAttendance = async (data) => {
  return await Post(update_attendance, data);
};

export const updateStatus = async (data) => {
  return await Post(update_status, data);
};

export const removeAttendance = async (data) => {
  return await Delete(delete_attendance, data);
};
