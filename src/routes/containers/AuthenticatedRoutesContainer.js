import React from 'react';
import { Switch, Route } from 'react-router';
import { Interpreter } from 'xstate';
import { useActor } from '@xstate/react';

require('dotenv').config();

const AuthenticatedRoutesContainer = ({ isLogin, authService }) => {
  // const [state] = useActor(authService);
  // var user = state.context.user;

  return <Switch></Switch>;
};

export default AuthenticatedRoutesContainer;
