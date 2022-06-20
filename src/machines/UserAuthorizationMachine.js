import { createMachine, assign, State, interpret } from 'xstate';

import { User, PermissionType } from '../models/User.js';
import { login, register, logout } from '../queries/AuthorizationQueries.js';

const USER_AUTH_TOKEN = 'user_authorize_token';

export const defineUser = (user, permission_type) => {
  return new User(
    user.user_id,
    user.first_name,
    user.last_name,
    user.email,
    permission_type,
    user.status,
    user.admin_id
  );
};

export const UserAuthorizationMachine = createMachine(
  {
    id: 'user_auth_machine',
    context: {
      user: undefined,
      error: '',
    },
    initial: 'unauthorized',
    states: {
      unauthorized: {
        entry: 'ResetUser',
        on: {
          LOGIN: { target: 'login' },
          REGISTER: { target: 'register' },
        },
      },
      login: {
        invoke: {
          src: 'Login',
          onDone: {
            target: 'authorized',
            actions: 'AssignUser',
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
      authorized: {
        on: {
          EXPIRE: { target: 'expire' },
          LOGOUT: { target: 'logout' },
        },
      },
      expire: {
        on: {
          UNAUTHORIZED: 'unauthorized',
        },
      },
      register: {
        invoke: {
          src: 'Register',
          onDone: {
            target: 'done',
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
      done: {
        on: {
          UNAUTHORIZED: { target: 'unauthorized' },
          LOGIN: { target: 'login' },
          REGISTER: { target: 'register' },
        },
      },
      logout: {
        entry: 'Logout',
        on: {
          UNAUTHORIZED: { target: 'unauthorized' },
        },
      },
      failure: {
        on: {
          UNAUTHORIZED: { target: 'unauthorized' },
          LOGIN: { target: 'login' },
          REGISTER: { target: 'register' },
        },
      },
    },
  },
  {
    services: {
      Login: async (context, event) => {
        return await login(event.value);
      },
      Register: async (context, event) => {
        let new_user = defineUser(event.value, PermissionType.User);
        let password = { password: event.value.password };
        let user_with_password = Object.assign(new_user, password);

        return await register(user_with_password);
      },
      Logout: async (context, event) => {
        await logout();
        localStorage.setItem(USER_AUTH_TOKEN, '');
      },
    },
    actions: {
      AssignUser: assign((ctx, event) => ({
        user: event.data.data,
      })),
      ResetUser: assign((ctx, event) => ({
        user: undefined,
      })),
    },
  }
);

const stored_state = localStorage.getItem(USER_AUTH_TOKEN);
const raw_state = stored_state
  ? JSON.parse(stored_state)
  : UserAuthorizationMachine.initialState;

let resolvedState;
if (raw_state) {
  const previousState = State.create(raw_state);
  resolvedState = UserAuthorizationMachine.resolveState(previousState);
}

export const AuthorizationService = interpret(UserAuthorizationMachine)
  .onTransition((state) => {
    if (state.changed) {
      localStorage.setItem(USER_AUTH_TOKEN, JSON.stringify(state));
    }
  })
  .start(resolvedState);
