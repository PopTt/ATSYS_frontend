import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, TextField } from '@mui/material';
import { useMachine } from '@xstate/react';

import { ServerError } from '../FailureComponent/ServerFailure.js';
import { EventMachine } from '../../machines/EventMachine.js';
import { useGlobalStyles } from '../../helpers/styles.js';
import { DefaultModal } from '../../frameworks/Modal.js';
import Join from '../../static/img/Join.png';

const useStyles = makeStyles((theme) => ({
  modal: {
    width: '500px',
    height: '400px',
  },
}));

export const JoinModal = ({ authService, open, setOpen, user, refresh }) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const [invitationCode, setInvitationCode] = useState('');
  const [error, setError] = useState('');

  const [state, send] = useMachine(EventMachine(undefined));

  useEffect(() => {
    if (state.matches('done')) {
      setTimeout(() => {
        setOpen(false);
        refresh();
      }, 1000);
    }
  }, [state]);

  return (
    <DefaultModal
      header='Join Event'
      open={open}
      setOpen={setOpen}
      className={classes.modal}
    >
      <div className={global.center} style={{ marginTop: '24px' }}>
        {state.matches('failure') && (
          <>
            <Alert severity='error'>{state.context.error}</Alert>{' '}
            <ServerError
              authService={authService}
              error={state.context.error}
              hide
            />
          </>
        )}
        {state.matches('done') && (
          <Alert severity='success'>Successully Joined.</Alert>
        )}
        <img src={Join} width={100} height={100} />
        <TextField
          placeholder='Put the invitation code here!'
          style={{ marginTop: '24px', width: '240px' }}
          onChange={(event) => setInvitationCode(event.target.value)}
          error={error !== '' && error !== undefined ? true : false}
          helperText={error}
        />
        <br />
        <br />
        <LoadingButton
          loading={state.matches('join_event')}
          variant='contained'
          fullWidth
          disabled={state.matches('done')}
          onClick={() => {
            if (invitationCode == '') setError('Invitation Code is required.');
            else
              send({
                type: 'JOIN_EVENT',
                value: {
                  user_id: user.getId(),
                  invitation_code: invitationCode,
                },
              });
          }}
        >
          Join
        </LoadingButton>
      </div>
    </DefaultModal>
  );
};
