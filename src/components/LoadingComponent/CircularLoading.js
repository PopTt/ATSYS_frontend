import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import clsx from 'clsx';

import { useGlobalStyles } from '../../helpers/styles.js';

export const Loading = ({ loadingText = '', flexCenter = false }) => {
  const global = useGlobalStyles();

  return (
    <Box
      sx={{ display: 'flex' }}
      className={clsx(
        !flexCenter && global.center,
        flexCenter && global.flexCenter
      )}
    >
      <CircularProgress />
      {loadingText !== '' && (
        <Typography component='p' variant='h4'>
          {loadingText}...
        </Typography>
      )}
    </Box>
  );
};
