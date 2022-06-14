import { createMachine, assign, State, interpret } from 'xstate';

import * as PersistHelper from '.';
import { User } from '../models/User.js';
import { AUTH as AUTH_LOG } from '../static/Auth.js';
import { login, register, logout } from '../queries/AuthorizationQueries.js';

//return a new user class instance
const defineUser = (user) => {
  return new User(
    user._id,
    user.first_name,
    user.last_name,
    user.email,
    user.account_type,
    user.google_id
  );
};

export const AuthenticationMachine = createMachine(
  {
    id: 'authentication-machine',
    context: {
      user: undefined,
    },
    initial: 'unauthorized',
    states: {
      redirect: {
        on: {
          AUTHORIZED: { target: 'authorized' },
          UNAUTHORIZED: { target: 'unauthorized' },
        },
      },
      unauthorized: {
        entry: 'InitializeUser',
        on: {
          LOGIN: { target: 'login' },
          REGISTER: { target: 'register' },
        },
      },
      authorized: {
        on: {
          LOGOUT: { target: 'logout' },
          EXPIRE: { target: 'expire' },
        },
      },
      login: {
        invoke: {
          src: 'Login',
          onDone: {
            target: 'redirect',
            actions: 'AssignUser',
          },
          onError: { target: 'failure.refused' },
        },
        after: {
          15000: { target: 'failure.timeout' },
        },
        meta: {
          message: 'authorizing',
        },
      },
      register: {
        invoke: {
          src: 'Register',
          onDone: {
            target: 'redirect',
            actions: 'AssignUser',
          },
          onError: { target: 'failure.refused' },
        },
        after: {
          15000: { target: 'failure.timeout' },
        },
        meta: {
          message: 'creating',
        },
      },
      expire: {
        entry: () => {
          logout();
          localStorage.setItem(AUTH_LOG, '');
        },
        on: {
          unauthorized: { target: 'unauthorized' },
        },
      },
      logout: {
        entry: () => {
          logout();
          localStorage.setItem(AUTH_LOG, '');
        },
        on: {
          unauthorized: { target: 'unauthorized' },
        },
      },
      failure: {
        initial: PersistHelper.failureInit,
        states: {
          refused: {
            meta: {
              message: PersistHelper.refusedMessage,
            },
          },
          nofound: {
            meta: {
              message: '404: User Not Found',
            },
          },
          timeout: {
            meta: {
              message: PersistHelper.timeoutMessage,
            },
          },
        },
        on: {
          unauthorized: { target: 'unauthorized' },
        },
      },
    },
  },
  {
    services: {
      Login: async (context, event) => {
        return login(event.value);
      },
      Register: async (context, event) => {
        //Define User Object
        let new_user = defineUser(event.value);
        let password = { password: event.value.password };
        let user_with_password = Object.assign(new_user, password);

        return register(user_with_password);
      },
    },
    actions: {
      InitializeUser: assign((ctx, event) => ({
        user: undefined,
      })),
      AssignUser: assign((ctx, event) => ({
        user: event.data,
      })),
    },
  }
);

const authState = localStorage.getItem(AUTH_LOG);
const stateDefinition = authState
  ? JSON.parse(authState)
  : AuthenticationMachine.initialState;

let resolvedState;
if (stateDefinition) {
  const previousState = State.create(stateDefinition);
  resolvedState = AuthenticationMachine.resolveState(previousState);
}

export const AuthenticationService = interpret(AuthenticationMachine)
  .onTransition((state) => {
    if (state.changed) {
      localStorage.setItem(AUTH_LOG, JSON.stringify(state));
    }
  })
  .start(resolvedState);
