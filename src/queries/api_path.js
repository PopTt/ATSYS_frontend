require('dotenv').config();

export const backend = process.env.REACT_APP_BACKEND;

const user_path = backend + 'users/';
export const login = user_path + 'login';
export const register = user_path + 'register';
export const log_out = user_path + 'logout';
export const get_instructors = user_path + 'getInstructors';
export const update_instructor = user_path + 'updateInstructor';
export const delete_instructor = user_path + 'deleteInstructor';

const event_path = backend + 'events/';
export const add_event_students = event_path + 'addEventStudents';
export const add_event_instructors = event_path + 'addEventInstructors';
export const create_event = event_path + 'create';
export const update_event = event_path + 'update';
export const join_event = event_path + 'join';
export const remove_event_member = event_path + 'removeEventMember';
export const get_event = event_path + 'getEvent';
export const get_events = event_path + 'getEvents';
export const get_user_events = event_path + 'getUserEvents';
export const get_invitation_code = event_path + 'getInvitationCode';
export const get_not_in_event_instructors =
  event_path + 'getNotInEventInstructors';
export const get_event_members = event_path + 'getEventMembers';

const attendance_path = backend + 'attendances/';
export const get_attendance = attendance_path + 'getAttendance';
export const get_qr_code = attendance_path + 'getQRCode';
export const get_event_attendances = attendance_path + 'getEventAttendances';
export const get_users_event_attendances =
  attendance_path + 'getUsersEventAttendances';
export const get_user_attendance_histories =
  attendance_path + 'getUserAttendanceHistories';
export const assign_users = attendance_path + 'assignUsers';
export const create_attendance = attendance_path + 'create';
export const update_attendance = attendance_path + 'updateAttendance';
export const update_status = attendance_path + 'updateStatus';
export const delete_attendance = attendance_path + 'deleteAttendance';

export const create_flash = attendance_path + 'createFlash';
export const update_flash = attendance_path + 'updateFlash';
export const get_flashes = attendance_path + 'getFlash';
