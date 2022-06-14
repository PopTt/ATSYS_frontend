import React from 'react';
import { useActor } from '@xstate/react';
import { makeStyles } from '@mui/styles';
import { CssBaseline } from '@mui/material';

import { AuthenticationService } from '../machines/AuthenticationMachine';
import AuthenticatedRoutesContainer from '../routes/containers/AuthenticatedRoutesContainer';
import UnauthorizedRoutesContainer from '../routes/containers/UnauthorizedRoutesContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    fontFamily: 'Open Sans',
    backgroundColor: theme.palette.background.default,
  },
}));

const App = () => {
  const classes = useStyles();
  const [authState] = useActor(AuthenticationService);

  const isLogin = authState.matches('authorized');

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* {isLogin ? (
        <AuthenticatedRoutesContainer
          isLogin={isLogin}
          authService={AuthenticationService}
        />
      ) : (
        <UnauthorizedRoutesContainer authService={AuthenticationService} />
      )} */}
      <UnauthorizedRoutesContainer authService={AuthenticationService} />
    </div>
  );
};

export default App;
