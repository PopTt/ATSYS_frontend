import { RefactorDateTime } from '../helpers/time.js';

export var AttendanceType;
(function (AttendanceType) {
  AttendanceType[(AttendanceType['QRCode'] = 0)] = 'QRCode';
  AttendanceType[(AttendanceType['Quiz'] = 1)] = 'Quiz';
})(AttendanceType || (AttendanceType = {}));

export class Attendance {
  constructor(
    attendance_id,
    attendance_name,
    attendance_type,
    start_time,
    end_time,
    event_id,
    user_id
  ) {
    this.attendance_id = attendance_id;
    this.attendance_name = attendance_name;
    this.attendance_type = attendance_type;
    this.start_time = start_time;
    this.end_time = end_time;
    this.event_id = event_id;
    this.user_id = user_id;
  }

  getId() {
    return this.attendance_id;
  }

  getName() {
    return this.attendance_name;
  }

  getType() {
    return AttendanceType[this.attendance_type];
  }

  getStartTime() {
    return RefactorDateTime(this.start_time);
  }

  getEndTime() {
    return RefactorDateTime(this.end_time);
  }

  getStatus() {
    if (this.start_time < new Date() && this.end_time > new Date())
      return 'Active';
    else return 'Inactive';
  }
}
