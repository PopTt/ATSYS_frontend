export var AccountType;
(function (AccountType) {
  AccountType[(AccountType['STUDENT'] = 0)] = 'student';
  AccountType[(AccountType['TEACHER'] = 1)] = 'Teacher';
  AccountType[(AccountType['ADMIN'] = 2)] = 'Admin';
})(AccountType || (AccountType = {}));

export class User {
  constructor(_id, first_name, last_name, email, account_type, google_id) {
    this._id = _id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.account_type = account_type;
    this.google_id = google_id;
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

  getAccountType() {
    return AccountType[this.account_type];
  }
}
