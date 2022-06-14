import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import { Login } from '../../components/AuthorizationComponent/Login';
import { login, register } from '../../links/url';

const UnauthorizedRoutesContainer = ({ authService }) => {
  return (
    <Router>
      <Switch>
        <Route exact path={login}>
          <Login />
        </Route>
        {/* <Route exact path={register}>
          <SignUp authService={authService} />
        </Route> */}
        <Redirect to={{ pathname: login }} />
      </Switch>
    </Router>
  );
};

export default UnauthorizedRoutesContainer;
