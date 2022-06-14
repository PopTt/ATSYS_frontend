import { Typography } from '@mui/material';

export const MediumTitle = ({ title, weight = 500 }) => {
  return (
    <Typography component='h1' variant='h4' fontWeight={weight}>
      {title}
    </Typography>
  );
};
