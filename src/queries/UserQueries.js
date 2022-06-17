import { Get, Post } from './axios/call.js';
import { register, get_instructors } from './api_path.js';

export const fetchInstructors = async (admin_id) => {
  return await Get(get_instructors + '/' + admin_id);
};

export const createInstructor = async (data) => {
  return await Post(register, data);
};
