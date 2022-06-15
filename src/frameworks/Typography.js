import { Typography } from '@mui/material';

export const SmallTitle = ({ title, weight = 500, size = 20 }) => {
  return (
    <Typography component='h1' variant='h6' fontWeight={weight} fontSize={size}>
      {title}
    </Typography>
  );
};

export const MediumTitle = ({ title, weight = 500 }) => {
  return (
    <Typography component='h1' variant='h4' fontWeight={weight}>
      {title}
    </Typography>
  );
};

export const BigTitle = ({ title, size = 26, weight = 600 }) => {
  return (
    <Typography component='h1' variant='h3' fontWeight={weight} fontSize={size}>
      {title}
    </Typography>
  );
};

export const Text = ({ text, readmore = false, maxLength = 140 }) => {
  let dot = text.length > 140 ? '...' : '';
  return (
    <Typography paragraph style={{ textAlign: 'justify' }}>
      {readmore ? text.substring(0, maxLength) + dot : text}
    </Typography>
  );
};
