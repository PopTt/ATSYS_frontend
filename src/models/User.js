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
    admin_id
  ) {
    this.user_id = user_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.permission_type = permission_type;
    this.admin_id = admin_id;
  }

  getId() {
    return this._id;
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
}
