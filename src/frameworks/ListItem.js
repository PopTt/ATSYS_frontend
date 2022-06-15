import { Theme, Paper, styled } from '@mui/material';

export const ListItem = styled(Paper)(({ theme }) => ({
  cursor: 'pointer',
  marginTop: '8px',
  padding: '16px',
  transitionDuration: '1s',
  boxShadow: theme.shadows[26],
  '&:hover': {
    boxShadow: theme.shadows[27],
  },
}));
