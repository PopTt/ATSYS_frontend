import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './containers/App';

import { createTheme, ThemeProvider } from '@mui/material';
import { history } from './helpers/history';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: '#163057',
    },
    secondary: {
      main: '#fff',
    },
    background: {
      default: '#f8f8ff',
    },
  },
  typography: {
    fontFamily: ['Quicksand', 'sans serif'].join(','),
  },
});

ReactDOM.render(
  <Router history={history}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Router>,
  document.getElementById('root')
);
