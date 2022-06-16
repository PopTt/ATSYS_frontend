import React, { useEffect, useState } from 'react';
import { useActor } from '@xstate/react';

import { Loading } from '../components/LoadingComponent/CircularLoading.js';
import { defineUser } from '../machines/UserAuthorizationMachine.js';
import { Event as EventComponent } from '../components/EventComponent/View.js';

export const Event = ({ authService }) => {
  const [user, setUser] = useState(undefined);
  const [state] = useActor(authService);

  useEffect(() => {
    setUser(defineUser(state.context.user, state.context.user.permission_type));
  }, [authService]);

  return user !== undefined ? (
    <EventComponent authService={authService} user={user} />
  ) : (
    <Loading loadingText='Loading' />
  );
};
