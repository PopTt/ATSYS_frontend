import { createMachine, assign, spawn } from 'xstate';
import { defineUser } from './UserAuthorizationMachine';
import { PermissionType } from '../models/User.js';
import { fetchInstructors, createInstructor } from '../queries/UserQueries.js';

export const UsersMachine = createMachine(
  {
    id: 'users_machine',
    context: {
      users: [],
      error: '',
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          GET_INSTRUCTORS: 'get_instructors',
        },
      },
      get_instructors: {
        invoke: {
          src: 'GetInstructors',
          onDone: {
            target: 'loaded',
            actions: 'AssignUsers',
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
          REFRESH: 'get_instructors',
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
      GetInstructors: async (context, event) => {
        return await fetchInstructors(event.params['admin_id']);
      },
    },
    actions: {
      AssignUsers: assign((ctx, event) => {
        ctx.users = [];
        event.data?.data?.map((user) => {
          ctx.users.push({
            ...user,
            //ref: spawn(EventMachine(event)),
          });
        });
      }),
    },
  }
);

export const UserMachine = (user) =>
  createMachine(
    {
      id: 'user_machine',
      context: {
        user: user,
        error: '',
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            CREATE_INSTRUCTOR: 'create_instructor',
          },
        },
        create_instructor: {
          invoke: {
            src: 'CreateInstructor',
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
        CreateInstructor: async (context, event) => {
          let new_user = defineUser(event.value, PermissionType.Instructor);
          let password = { password: event.value.password };
          let user_with_password = Object.assign(new_user, password);

          return await createInstructor(user_with_password);
        },
      },
      actions: {
        AssignEvent: assign((ctx, event) => ({
          event: event.data.data,
        })),
      },
    }
  );
