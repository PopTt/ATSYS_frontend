import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import { Login } from '../../components/AuthorizationComponent/Login.js';
import { Register } from '../../components/AuthorizationComponent/Register.js';
import { login, register } from '../../links/url.js';

const UnauthorizedRoutesContainer = ({ authService }) => {
  return (
    <Router>
      <Switch>
        <Route exact path={login}>
          <Login />
        </Route>
        <Route exact path={register}>
          <Register authService={authService} />
        </Route>
        <Redirect to={{ pathname: login }} />
      </Switch>
    </Router>
  );
};

export default UnauthorizedRoutesContainer;
