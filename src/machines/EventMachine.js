import { createMachine, assign, spawn } from 'xstate';
import {
  createEvent,
  fetchEvent,
  fetchEvents,
} from '../queries/EventQueries.js';

export const EventsMachine = createMachine(
  {
    id: 'events_machine',
    context: {
      events: undefined,
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
        after: { 15000: { actions: assign({ error: 'timeout' }) } },
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
        return fetchEvents(event.params['user_id']);
      },
    },
    actions: {
      AssignEvents: assign((ctx, event) =>
        ctx.events.push({
          ...event.data.data,
          ref: spawn(EventMachine(event.data.data)),
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
          after: { 15000: { actions: assign({ error: 'timeout' }) } },
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
          after: { 15000: { actions: assign({ error: 'timeout' }) } },
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
          after: { 15000: { actions: assign({ error: 'timeout' }) } },
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
          return createEvent(event.value);
        },
        GetEvent: async (context, event) => {
          return fetchEvent(event.params['event_id']);
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
