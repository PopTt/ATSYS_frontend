import { PermissionType } from '../models/User.js';

export const AdminLevelPermission = (permission_type) => {
  if (permission_type == PermissionType.Admin) return true;
  return false;
};

export const AdminInstructorLevelPermission = (permission_type) => {
  if (
    permission_type == PermissionType.Admin ||
    permission_type == PermissionType.Instructor
  )
    return true;
  return false;
};

export const InstructorLevelPermission = (permission_type) => {
  if (permission_type == PermissionType.Instructor) return true;
  return false;
};

export const InstructorStudentLevelPermission = (permission_type) => {
  if (
    permission_type == PermissionType.Instructor ||
    permission_type == PermissionType.Student
  )
    return true;
  return false;
};

export const StudentLevelPermission = (permission_type) => {
  if (permission_type == PermissionType.Student) return true;
  return false;
};
