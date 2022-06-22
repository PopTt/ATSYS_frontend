import { createMachine, assign } from 'xstate';
import { Flash } from '../models/Flash.js';
import {
  createFlash,
  updateFlash,
  fetchFlashes,
} from '../queries/FlashQueries.js';

export const defineFlash = (flash) => {
  return new Flash(
    flash.flash_id,
    flash.flash_question,
    flash.falsh_ans,
    flash.creator_id,
    flash.attendance_id
  );
};

export const FlashMachine = createMachine(
  {
    id: 'flash_machine',
    context: {
      flashes: [],
      error: '',
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          CREATE: 'creating',
          UPDATE: 'updating',
          GET_FLASHES: 'get_flashes',
        },
      },
      creating: {
        invoke: {
          src: 'CreateFlash',
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
          src: 'UpdateFlash',
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
      get_flashes: {
        invoke: {
          src: 'GetFlashes',
          onDone: {
            target: 'loaded',
            actions: 'AssignFlashes',
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
      done: { type: 'final' },
      loaded: {
        on: {
          REFRESH: 'get_flashes',
        },
      },
      failure: {
        on: {
          idle: 'idle',
          GET_FLASHES: 'get_flashes',
        },
      },
    },
  },
  {
    services: {
      CreateFlash: async (context, event) => {
        return await createFlash(event.value);
      },
      UpdateFlash: async (context, event) => {
        return await updateFlash(event.value);
      },
      GetFlashes: async (context, event) => {
        return await fetchFlashes(event.params['attendance_id']);
      },
    },
    actions: {
      AssignFlashes: assign((ctx, event) => ({
        flashes: event.data.data,
      })),
    },
  }
);
