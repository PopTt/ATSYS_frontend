import React, { useEffect, useState } from 'react';
import { useActor } from '@xstate/react';

import { Loading } from '../components/LoadingComponent/CircularLoading.js';
import { defineUser } from '../machines/UserAuthorizationMachine.js';
import { Home as HomeComponent } from '../components/AtHomeComponent';

export const Home = ({ authService }) => {
  const [user, setUser] = useState(undefined);
  const [state] = useActor(authService);

  useEffect(() => {
    setUser(defineUser(state.context.user, state.context.user.permission_type));
  }, [authService]);

  return user !== undefined ? (
    <HomeComponent authService={authService} user={user} />
  ) : (
    <Loading loadingText='Granting Permission' />
  );
};
