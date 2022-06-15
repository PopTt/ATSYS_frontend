import React from 'react';
import { Switch } from 'react-router';

import * as Path from './route_paths.js';
import { Home } from '../containers/AtHome.js';
import AuthorizedRoute from './AuthorizedRoute.js';

require('dotenv').config();

const AuthorizedRoutes = ({ isLogin, authService }) => {
  return (
    <Switch>
      <AuthorizedRoute isLogin={isLogin} exact path={[Path.home, '', '/']}>
        <Home authService={authService} />
      </AuthorizedRoute>
    </Switch>
  );
};

export default AuthorizedRoutes;
