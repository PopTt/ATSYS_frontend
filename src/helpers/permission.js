import { PermissionType } from '../models/User.js';

export const AdminLevelPermission = (permission_type) => {
  if (permission_type == PermissionType.Admin) return true;
  return false;
};
