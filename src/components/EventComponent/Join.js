import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Button, TextField } from '@mui/material';

import { useGlobalStyles } from '../../helpers/styles.js';
import { DefaultModal } from '../../frameworks/Modal.js';
import Join from '../../static/img/Join.png';

const useStyles = makeStyles((theme) => ({
  modal: {
    width: '500px',
    height: '400px',
  },
}));

export const JoinModal = ({ open, setOpen }) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const [invitationCode, setInvitationCode] = useState('');
  const [error, setError] = useState('');

  return (
    <DefaultModal
      header='Join Event'
      open={open}
      setOpen={setOpen}
      className={classes.modal}
    >
      <div className={global.center} style={{ marginTop: '24px' }}>
        <img src={Join} width={100} height={100} />
        <TextField
          placeholder='Put the invitation code here!'
          style={{ marginTop: '24px', width: '240px' }}
          onChange={(event) => setInvitationCode(event.target.value)}
          error={error !== '' && error !== undefined ? true : false}
          helperText={error}
        />
        <br />
        <Button
          variant='contained'
          style={{ marginTop: '32px' }}
          onClick={() => {
            if (invitationCode == '') setError('Invitation Code is required.');
          }}
        >
          Join Event
        </Button>
      </div>
    </DefaultModal>
  );
};
