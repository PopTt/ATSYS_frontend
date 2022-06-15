import * as React from 'react';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const Loading = ({ loadingText = '' }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
      {loadingText !== '' && (
        <Typography component='p' variant='h4'>
          {loadingText}...
        </Typography>
      )}
    </Box>
  );
};
