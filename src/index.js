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
      main: '#654321',
    },
    secondary: {
      main: '#fff',
    },
    background: {
      default: 'rgba(250, 224, 216, 0.2)',
    },
  },
  typography: {
    fontFamily: ['Open Sans', 'sans serif'].join(','),
  },
  shadows: {
    0: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
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
