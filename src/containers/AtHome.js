import React, { useEffect, useState } from 'react';
import { useActor } from '@xstate/react';

import { Loading } from '../components/LoadingComponent/CircularLoading.js';
import { UserHome } from '../components/AtHomeComponent/UserHome.js';
import * as PermissionChecker from '../helpers/permission.js';

export const Home = ({ authService }) => {
  const [managementPermission, setManagementPermission] = useState(undefined);
  const [state, send] = useActor(authService);

  useEffect(
    () =>
      setManagementPermission(
        PermissionChecker.AdminInstLevelPermission(
          state.context.user.permission_type
        )
      ),
    [authService]
  );

  return (
    <div>
      {managementPermission !== undefined ? (
        <>{!managementPermission && <UserHome authService={authService} />}</>
      ) : (
        <Loading loadingText='Granting Permission' />
      )}
    </div>
  );
};
