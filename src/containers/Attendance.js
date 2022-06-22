import React, { useEffect, useState } from 'react';
import { useActor } from '@xstate/react';

import { Loading } from '../components/LoadingComponent/CircularLoading.js';
import { defineUser } from '../machines/UserAuthorizationMachine.js';
import { Attendance as AttendanceComponent } from '../components/AttendanceComponent/View.js';

export const Attendance = ({ authService }) => {
  const [user, setUser] = useState(undefined);
  const [state] = useActor(authService);

  useEffect(() => {
    setUser(defineUser(state.context.user, state.context.user.permission_type));
  }, [authService]);

  return user !== undefined ? (
    <AttendanceComponent authService={authService} user={user} />
  ) : (
    <Loading loadingText='Loading' />
  );
};
