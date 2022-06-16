import React, { useEffect } from 'react';
import { useActor } from '@xstate/react';
import { Typography } from '@mui/material';

import { useGlobalStyles } from '../../helpers/styles.js';
import Error from '../../static/img/Error.png';

export const ServerError = ({
  authService,
  error = 'Internal Server Error',
  hide = false,
}) => {
  const global = useGlobalStyles();

  const [_, send] = useActor(authService);

  useEffect(() => {
    if (error == 'Invalid token') {
      send({ type: 'EXPIRE' });
    }
  }, [error]);

  return (
    <div
      className={global.center}
      style={{ display: hide ? 'none' : 'absolute' }}
    >
      <img src={Error} alt='Server Error' height={120} width={120} />
      <Typography
        component='h1'
        variant='h5'
        fontWeight={600}
        style={{ marginTop: '24px' }}
      >
        {error !== '' ? error : 'Internal Server Error'}
      </Typography>
    </div>
  );
};
