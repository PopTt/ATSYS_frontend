import { Get, Post } from './axios/call.js';
import { create_flash, update_flash, get_flashes } from './api_path.js';

export const fetchFlashes = async (attendance_id) => {
  return await Get(get_flashes + '/' + attendance_id);
};

export const createFlash = async (data) => {
  return await Post(create_flash, data);
};

export const updateFlash = async (data) => {
  return await Post(update_flash, data);
};
