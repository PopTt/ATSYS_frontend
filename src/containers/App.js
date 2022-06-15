import React from 'react';
import { useActor } from '@xstate/react';
import { makeStyles } from '@mui/styles';
import { CssBaseline } from '@mui/material';

import { AuthorizationService } from '../machines/UserAuthorizationMachine.js';
import AuthorizedRoutes from '../routes/AuthorizedRoutes.js';
import UnauthorizedRoutes from '../routes/UnauthorizedRoutes.js';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    fontFamily: 'Open Sans',
  },
}));

const App = () => {
  const classes = useStyles();
  const [state] = useActor(AuthorizationService);

  const isLogin = state.matches('authorized');

  return (
    <div className={classes.root}>
      <CssBaseline />
      {isLogin ? (
        <AuthorizedRoutes
          isLogin={isLogin}
          authService={AuthorizationService}
        />
      ) : (
        <UnauthorizedRoutes authService={AuthorizationService} />
      )}
    </div>
  );
};

export default App;
