import { createMachine, assign, spawn } from 'xstate';
import { Attendance } from '../models/Attendance.js';
import {
  createAttendance,
  fetchEventAttendances,
  fetchUsersEventAttendances,
} from '../queries/AttendanceQueries.js';

export const defineAttendance = (attendance) => {
  return new Attendance(
    attendance.attendance_id,
    attendance.attendance_name,
    attendance.attendance_type,
    attendance.start_time,
    attendance.end_time,
    attendance.event_id,
    attendance.user_id
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
          GET_EVENT_ATTENDANCES: 'get_event_attendances',
          GET_USERS_EVENT_ATTENDANCES: 'get_users_event_attendances',
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
            //ref: spawn(UserAttendanceMachine(userAttendance)),
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
        error: '',
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            CREATE: 'creating',
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
        CreateAttendance: async (context, event) => {
          return await createAttendance(event.value);
        },
      },
      actions: {
        AssignAttendance: assign((ctx, event) => ({
          attendance: event.data.data,
        })),
      },
    }
  );
