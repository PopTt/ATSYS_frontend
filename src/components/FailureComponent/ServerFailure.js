import { Typography } from '@mui/material';

import { useGlobalStyles } from '../../helpers/styles.js';
import Error from '../../static/img/Error.png';

export const ServerError = ({ error = 'Internal Server Error' }) => {
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
        {error !== '' ? error : 'Internal Server Error'}
      </Typography>
    </div>
  );
};
