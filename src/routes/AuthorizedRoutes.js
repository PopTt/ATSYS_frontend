import React from 'react';
import { Switch, Redirect } from 'react-router';

import * as Path from './route_paths.js';
import { Home } from '../containers/Home.js';
import { Event } from '../containers/Event.js';
import AuthorizedRoute from './AuthorizedRoute.js';

const AuthorizedRoutes = ({ isLogin, authService }) => {
  return (
    <Switch>
      <AuthorizedRoute isLogin={isLogin} exact path={[Path.home, '', '/']}>
        <Home authService={authService} />
      </AuthorizedRoute>
      <AuthorizedRoute isLogin={isLogin} exact path={Path.event_route}>
        <Event authService={authService} />
      </AuthorizedRoute>
    </Switch>
  );
};

export default AuthorizedRoutes;
