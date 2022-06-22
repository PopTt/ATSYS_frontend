import { RefactorDateTime } from '../helpers/time.js';

export var AttendanceStatus;
(function (AttendanceStatus) {
  AttendanceStatus[(AttendanceStatus['Absent'] = 0)] = 'Absent';
  AttendanceStatus[(AttendanceStatus['Attend'] = 1)] = 'Attend';
})(AttendanceStatus || (AttendanceStatus = {}));

export class UserAttendance {
  constructor(
    ua_id,
    user_id,
    attendance_id,
    attendance_status,
    attendance_time
  ) {
    this.ua_id = ua_id;
    this.user_id = user_id;
    this.attendance_id = attendance_id;
    this.attendance_status = attendance_status;
    this.attendance_time = attendance_time;
  }

  getId() {
    return this.ua_id;
  }

  getStatus() {
    return AttendanceStatus[this.attendance_status];
  }

  getTakenTime() {
    return RefactorDateTime(this.attendance_time);
  }
}
