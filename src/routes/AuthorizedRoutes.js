import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { login } from '../links/url.js';

function AuthenticatedRoutes({ isLogin, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={() =>
        isLogin ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: login,
            }}
          />
        )
      }
    />
  );
}

export default AuthenticatedRoutes;
