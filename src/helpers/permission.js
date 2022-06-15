import { PermissionType } from '../models/User.js';

//Grant Management Page Permission
export const AdminInstLevelPermission = (permission_type) => {
  if (permission_type == PermissionType.User) return false;
  return true;
};
