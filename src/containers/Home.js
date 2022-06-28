import React, { useEffect, useState } from 'react';
import { useActor } from '@xstate/react';

import { Loading } from '../components/LoadingComponent/CircularLoading.js';
import { defineUser } from '../machines/UserAuthorizationMachine.js';
import { Home as HomeComponent } from '../components/HomeComponent';
import { home } from '../routes/route_paths.js';

export const Home = ({ authService }) => {
  const [user, setUser] = useState(undefined);
  const [state] = useActor(authService);

  useEffect(() => {
    if (window.location.pathname !== home) {
      window.location.replace(home);
    }
    setUser(defineUser(state.context.user, state.context.user.permission_type));
  }, [authService]);

  return user !== undefined ? (
    <HomeComponent authService={authService} user={user} />
  ) : (
    <Loading loadingText='Loading' />
  );
};
