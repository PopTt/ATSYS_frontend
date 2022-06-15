import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { login } from './route_paths.js';

function AuthorizedRoute({ isLogin, children, ...rest }) {
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

export default AuthorizedRoute;
