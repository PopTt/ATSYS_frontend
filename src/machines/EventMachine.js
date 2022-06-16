import { createMachine, assign, spawn } from 'xstate';
import { Event } from '../models/Event.js';
import {
  createEvent,
  fetchEvent,
  fetchEvents,
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
    },
    actions: {
      AssignEvents: assign((ctx, event) =>
        event.data.data.map((event) => {
          ctx.events.push({
            ...event,
            ref: spawn(EventMachine(event)),
          });
        })
      ),
    },
  }
);

export const EventMachine = (event) =>
  createMachine(
    {
      id: 'event_machine',
      context: {
        event: event,
        error: '',
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            CREATE: 'creating',
            GET_EVENT: 'get_event',
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
        CreateEvent: async (context, event) => {
          return await createEvent(event.value);
        },
        GetEvent: async (context, event) => {
          return await fetchEvent(event.params['event_id']);
        },
        JoinEvent: async (context, event) => {},
      },
      actions: {
        AssignEvent: assign((ctx, event) => ({
          event: event.data.data,
        })),
      },
    }
  );
