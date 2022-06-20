import { Get, Post, Delete } from './axios/call.js';
import {
  register,
  get_instructors,
  update_instructor,
  delete_instructor,
} from './api_path.js';

export const fetchInstructors = async (admin_id) => {
  return await Get(get_instructors + '/' + admin_id);
};

export const createInstructor = async (data) => {
  return await Post(register, data);
};

export const updateInstructor = async (data) => {
  return await Post(update_instructor, data);
};

export const deleteInstructor = async (data) => {
  return await Delete(delete_instructor, data);
};
