export var UserStatus;
(function (UserStatus) {
  UserStatus[(UserStatus['Active'] = 0)] = 'Active';
  UserStatus[(UserStatus['Inactive'] = 1)] = 'Inactive';
  UserStatus[(UserStatus['Deleted'] = 2)] = 'Deleted';
})(UserStatus || (UserStatus = {}));

export var PermissionType;
(function (PermissionType) {
  PermissionType[(PermissionType['Admin'] = 0)] = 'Admin';
  PermissionType[(PermissionType['Instructor'] = 1)] = 'Instructor';
  PermissionType[(PermissionType['User'] = 2)] = 'User';
})(PermissionType || (PermissionType = {}));

export class User {
  constructor(
    user_id,
    first_name,
    last_name,
    email,
    permission_type,
    status,
    admin_id
  ) {
    this.user_id = user_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.permission_type = permission_type;
    this.status = status;
    this.admin_id = admin_id;
  }

  getId() {
    return this.user_id;
  }

  getFullName() {
    return this.first_name + ' ' + this.last_name;
  }

  getEmail() {
    return this.email;
  }

  getPermissionType() {
    return PermissionType[this.permission_type];
  }

  getStatus() {
    return UserStatus[this.status];
  }
}
