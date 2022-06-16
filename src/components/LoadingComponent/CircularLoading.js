import React from 'react';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { useGlobalStyles } from '../../helpers/styles.js';

export const Loading = ({ loadingText = '' }) => {
  const global = useGlobalStyles();

  return (
    <Box sx={{ display: 'flex' }} className={global.center}>
      <CircularProgress />
      {loadingText !== '' && (
        <Typography component='p' variant='h4'>
          {loadingText}...
        </Typography>
      )}
    </Box>
  );
};
