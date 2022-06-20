import { createMachine, assign, spawn } from 'xstate';
import { Event } from '../models/Event.js';
import {
  addEventInstructors,
  createEvent,
  updateEvent,
  joinEvent,
  fetchEvent,
  fetchUserEvents,
  fetchInvitationCode,
  fetchEvents,
  fetchEventMembers,
  fetchNotInEventInstructors,
  removeEventMember,
} from '../queries/EventQueries.js';

export const defineEvent = (event) => {
  return new Event(
    event.event_id,
    event.event_name,
    event.event_description,
    event.established_time,
    event.invitation_code,
    event.admin_id
  );
};

export const EventsMachine = createMachine(
  {
    id: 'events_machine',
    context: {
      events: [],
      error: '',
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          GET_EVENTS: 'get_events',
          GET_USER_EVENTS: 'get_user_events',
        },
      },
      get_events: {
        invoke: {
          src: 'GetEvents',
          onDone: {
            target: 'loaded',
            actions: 'AssignEvents',
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
      get_user_events: {
        invoke: {
          src: 'GetUserEvents',
          onDone: {
            target: 'loaded',
            actions: 'AssignEvents',
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
          REFRESH: 'get_events',
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
      GetEvents: async (context, event) => {
        return await fetchEvents(event.params['admin_id']);
      },
      GetUserEvents: async (context, event) => {
        return await fetchUserEvents(event.params['user_id']);
      },
    },
    actions: {
      AssignEvents: assign((ctx, event) => {
        ctx.events = [];
        event.data.data.map((event) => {
          ctx.events.push({
            ...event,
            ref: spawn(EventMachine(event)),
          });
        });
      }),
    },
  }
);

export const EventMachine = (event) =>
  createMachine(
    {
      id: 'event_machine',
      context: {
        event: event,
        users: undefined,
        error: '',
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            CREATE: 'creating',
            UPDATE: 'updating',
            GET_EVENT: 'get_event',
            GET_INVITATION_CODE: 'get_invitation_code',
            JOIN_EVENT: 'join_event',
          },
        },
        creating: {
          invoke: {
            src: 'CreateEvent',
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
            src: 'UpdateEvent',
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
        get_event: {
          invoke: {
            src: 'GetEvent',
            onDone: {
              target: 'loaded',
              actions: 'AssignEvent',
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
        get_invitation_code: {
          invoke: {
            src: 'GetInvitationCode',
            onDone: {
              target: 'loaded',
              actions: 'AssignEvent',
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
        join_event: {
          invoke: {
            src: 'JoinEvent',
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
        loaded: {
          on: {
            REFRESH: 'get_event',
          },
        },
        failure: {
          on: {
            idle: 'idle',
            JOIN_EVENT: 'join_event',
          },
        },
      },
    },
    {
      services: {
        CreateEvent: async (context, event) => {
          return await createEvent(event.value);
        },
        UpdateEvent: async (context, event) => {
          return await updateEvent(event.value);
        },
        GetEvent: async (context, event) => {
          return await fetchEvent(event.params['event_id']);
        },
        GetInvitationCode: async (context, event) => {
          return await fetchInvitationCode(event.params['event_id']);
        },
        JoinEvent: async (context, event) => {
          return await joinEvent(event.value);
        },
      },
      actions: {
        AssignEvent: assign((ctx, event) => ({
          event: event.data.data,
        })),
      },
    }
  );

export const EventMembersMachine = createMachine(
  {
    id: 'user_event_members_machine',
    context: {
      members: [],
      instructors: [],
      error: '',
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          ADD_EVENT_INSTRUCTORS: 'add_event_instructors',
          GET_NOT_IN_EVENT_INSTRUCTORS: 'get_not_in_event_instructors',
          GET_EVENT_MEMBERS: 'get_event_members',
        },
      },
      add_event_instructors: {
        invoke: {
          src: 'AddEventInstructors',
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
      get_not_in_event_instructors: {
        invoke: {
          src: 'GetNotInEventInstructors',
          onDone: {
            target: 'loaded',
            actions: 'AssignInstructors',
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
      get_event_members: {
        invoke: {
          src: 'GetEventMembers',
          onDone: {
            target: 'loaded',
            actions: 'AssignEventMembers',
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
          REFRESH: 'get_event_members',
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
      AddEventInstructors: async (context, event) => {
        return await addEventInstructors(event.value);
      },
      GetNotInEventInstructors: async (context, event) => {
        return await fetchNotInEventInstructors(
          event.params['admin_id'],
          event.params['event_id']
        );
      },
      GetEventMembers: async (context, event) => {
        return await fetchEventMembers(event.params['event_id']);
      },
    },
    actions: {
      AssignInstructors: assign((ctx, event) => {
        ctx.instructors = [];
        ctx.instructors = event.data.data;
      }),
      AssignEventMembers: assign((ctx, event) => {
        ctx.members = [];
        event.data.data.map((member) => {
          ctx.members.push({
            ...member,
            ref: spawn(EventMemberMachine(member)),
          });
        });
      }),
    },
  }
);

export const EventMemberMachine = (user) =>
  createMachine(
    {
      id: 'event_member_machine',
      context: {
        user: user,
        error: '',
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            REMOVE: 'removing',
          },
        },
        removing: {
          invoke: {
            src: 'RemoveEventMember',
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
            REMOVE: 'removing',
          },
        },
      },
    },
    {
      services: {
        RemoveEventMember: async (context, event) => {
          return await removeEventMember({
            user_id: context.user.user_id,
            event_id: event.value.event_id,
            role: event.value.role,
          });
        },
      },
    }
  );
