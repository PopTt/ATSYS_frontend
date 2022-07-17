import { createMachine, assign, spawn } from 'xstate';
import { Attendance } from '../models/Attendance.js';
import { UserAttendance } from '../models/UserAttendance.js';
import {
  createAttendance,
  updateAttendance,
  updateStatus,
  removeAttendance,
  fetchAttendance,
  fetchUserHistory,
  fetchQRCode,
  fetchEventAttendances,
  fetchUsersEventAttendances,
} from '../queries/AttendanceQueries.js';

export const defineAttendance = (attendance) => {
  return new Attendance(
    attendance.attendance_id,
    attendance.attendance_name,
    attendance.start_time,
    attendance.end_time,
    attendance.event_id,
    attendance.user_id,
    attendance.attendance_type
  );
};

export const defineUserAttendance = (userAttendance) => {
  return new UserAttendance(
    userAttendance.ua_id,
    userAttendance.user_id,
    userAttendance.attendance_id,
    userAttendance.attendance_status,
    userAttendance.attendance_time,
    userAttendance.flash_result,
    userAttendance.location
  );
};

export const AttendancesMachine = createMachine(
  {
    id: 'attendances_machine',
    context: {
      attendances: [],
      userAttendances: [],
      error: '',
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          GET_USER_HISTORY: 'get_user_history',
          GET_EVENT_ATTENDANCES: 'get_event_attendances',
          GET_USERS_EVENT_ATTENDANCES: 'get_users_event_attendances',
        },
      },
      get_user_history: {
        invoke: {
          src: 'GetUserHistory',
          onDone: {
            target: 'loaded',
            actions: 'AssignUserAttendances',
          },
          onError: {
            target: 'failure',
            actions: assign({ error: (context, event) => event.data.message }),
          },
        },
      },
      get_event_attendances: {
        invoke: {
          src: 'GetEventAttendances',
          onDone: {
            target: 'loaded',
            actions: 'AssignAttendances',
          },
          onError: {
            target: 'failure',
            actions: assign({ error: (context, event) => event.data.message }),
          },
        },
        after: {
          15000: {
            target: 'failure',
            actions: assign({ error: 'Request Timeout' }),
          },
        },
      },
      get_users_event_attendances: {
        invoke: {
          src: 'GetUsersEventAttendances',
          onDone: {
            target: 'loaded',
            actions: 'AssignUserAttendances',
          },
          onError: {
            target: 'failure',
            actions: assign({ error: (context, event) => event.data.message }),
          },
        },
        after: {
          15000: {
            target: 'failure',
            actions: assign({ error: 'Request Timeout' }),
          },
        },
      },
      loaded: {
        on: {
          REFRESH: 'get_event_attendances',
          REFRESH_USERS_ATTENDANCE: 'get_users_event_attendances',
        },
      },
      failure: {
        on: {
          idle: 'idle',
        },
      },
    },
  },
  {
    services: {
      GetUserHistory: async (context, event) => {
        return await fetchUserHistory(
          event.params['user_id'],
          event.params['event_id']
        );
      },
      GetEventAttendances: async (context, event) => {
        return await fetchEventAttendances(event.params['event_id']);
      },
      GetUsersEventAttendances: async (context, event) => {
        return await fetchUsersEventAttendances(event.params['attendance_id']);
      },
    },
    actions: {
      AssignAttendances: assign((ctx, event) => {
        ctx.attendances = [];
        event.data.data.map((attendance) => {
          ctx.attendances.push({
            ...attendance,
            ref: spawn(AttendanceMachine(attendance)),
          });
        });
      }),
      AssignUserAttendances: assign((ctx, event) => {
        ctx.userAttendances = [];
        event.data.data.map((userAttendance) => {
          ctx.userAttendances.push({
            ...userAttendance,
            ref: spawn(UserAttendanceMachine(userAttendance)),
          });
        });
      }),
    },
  }
);

export const AttendanceMachine = (attendance) =>
  createMachine(
    {
      id: 'attendance_machine',
      context: {
        attendance: attendance,
        QRCode: undefined,
        error: '',
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            CREATE: 'creating',
            UPDATE: 'updating',
            REMOVE: 'removing',
            GET_ATTENDANCE: 'get_attendance',
            GET_QR_CODE: 'get_qr_code',
          },
        },
        creating: {
          invoke: {
            src: 'CreateAttendance',
            onDone: {
              target: 'done',
            },
            onError: {
              target: 'failure',
              actions: assign({
                error: (context, event) => event.data.message,
              }),
            },
          },
          after: {
            15000: {
              target: 'failure',
              actions: assign({ error: 'Request Timeout' }),
            },
          },
        },
        updating: {
          invoke: {
            src: 'UpdateAttendance',
            onDone: {
              target: 'done',
            },
            onError: {
              target: 'failure',
              actions: assign({
                error: (context, event) => event.data.message,
              }),
            },
          },
          after: {
            15000: {
              target: 'failure',
              actions: assign({ error: 'Request Timeout' }),
            },
          },
        },
        removing: {
          invoke: {
            src: 'RemoveAttendance',
            onDone: {
              target: 'done',
            },
            onError: {
              target: 'failure',
              actions: assign({
                error: (context, event) => event.data.message,
              }),
            },
          },
          after: {
            15000: {
              target: 'failure',
              actions: assign({ error: 'Request Timeout' }),
            },
          },
        },
        get_attendance: {
          invoke: {
            src: 'GetAttendance',
            onDone: {
              target: 'loaded',
              actions: 'AssignAttendance',
            },
            onError: {
              target: 'failure',
              actions: assign({
                error: (context, event) => event.data.message,
              }),
            },
          },
          after: {
            15000: {
              target: 'failure',
              actions: assign({ error: 'Request Timeout' }),
            },
          },
        },
        get_qr_code: {
          invoke: {
            src: 'GetQRCode',
            onDone: {
              target: 'loaded',
              actions: 'AssignQRCode',
            },
            onError: {
              target: 'failure',
              actions: assign({
                error: (context, event) => event.data.message,
              }),
            },
          },
          after: {
            15000: {
              target: 'failure',
              actions: assign({ error: 'Request Timeout' }),
            },
          },
        },
        done: {
          type: 'final',
        },
        loaded: {
          on: {
            REFRESH: 'get_attendance',
          },
        },
        failure: {
          on: {
            idle: 'idle',
          },
        },
      },
    },
    {
      services: {
        CreateAttendance: async (context, event) => {
          return await createAttendance(event.value);
        },
        UpdateAttendance: async (context, event) => {
          event.value.attendance_id = context.attendance.attendance_id;
          return await updateAttendance(event.value);
        },
        RemoveAttendance: async (context, event) => {
          return await removeAttendance(event.value);
        },
        GetAttendance: async (context, event) => {
          return await fetchAttendance(event.params['attendance_id']);
        },
        GetQRCode: async (context, event) => {
          return await fetchQRCode(event.params['attendance_id']);
        },
      },
      actions: {
        AssignAttendance: assign((ctx, event) => ({
          attendance: event.data.data,
        })),
        AssignQRCode: assign((ctx, event) => ({
          QRCode: event.data.data,
        })),
      },
    }
  );

export const UserAttendanceMachine = (userAttendance) =>
  createMachine(
    {
      id: 'user_attendance_machine',
      context: {
        userAttendance: userAttendance,
        error: '',
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            UPDATE: 'updating',
          },
        },
        updating: {
          invoke: {
            src: 'UpdateStatus',
            onDone: {
              target: 'done',
            },
            onError: {
              target: 'failure',
              actions: assign({
                error: (context, event) => event.data.message,
              }),
            },
          },
          after: {
            15000: {
              target: 'failure',
              actions: assign({ error: 'Request Timeout' }),
            },
          },
        },
        done: {
          type: 'final',
        },
        failure: {
          on: {
            idle: 'idle',
          },
        },
      },
    },
    {
      services: {
        UpdateStatus: async (context, event) => {
          return await updateStatus(event.value);
        },
      },
    }
  );
