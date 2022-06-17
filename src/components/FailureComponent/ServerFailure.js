import React, { useEffect } from 'react';
import { useActor } from '@xstate/react';
import { Typography } from '@mui/material';
import clsx from 'clsx';

import { login } from '../../routes/route_paths.js';
import { useGlobalStyles } from '../../helpers/styles.js';
import Empty from '../../static/img/Empty.png';
import Error from '../../static/img/Error.png';

export const EmptyError = ({ flexCenter = false }) => {
  const global = useGlobalStyles();

  return (
    <div
      className={clsx(
        !flexCenter && global.center,
        flexCenter && global.flexCenter
      )}
    >
      <img src={Empty} alt='Empty Error' height={120} width={120} />
      <Typography
        component='h1'
        variant='h5'
        fontWeight={600}
        style={{ marginTop: '24px' }}
      >
        Nothings to display...
      </Typography>
    </div>
  );
};

export const ServerError = ({
  authService,
  error = 'Internal Server Error',
  hide = false,
  flexCenter = false,
}) => {
  const global = useGlobalStyles();

  const [_, send] = useActor(authService);

  useEffect(() => {
    if (error == 'Invalid token') {
      send({ type: 'EXPIRE' });
      window.location.href = login;
    }
  }, [error]);

  return (
    <div
      className={clsx(
        !flexCenter && global.center,
        flexCenter && global.flexCenter
      )}
      style={{ display: hide ? 'none' : flexCenter ? 'block' : 'absolute' }}
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

export const NotPermissionError = () => {
  const global = useGlobalStyles();

  return (
    <div className={global.center}>
      <img src={Error} alt='Server Error' height={120} width={120} />
      <Typography
        component='h1'
        variant='h5'
        fontWeight={600}
        style={{ marginTop: '24px' }}
      >
        You are not allowed to view this page.
      </Typography>
    </div>
  );
};
