import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useMachine } from '@xstate/react';

import { CreateModal } from './Create.js';
import { EventAttendanceTable } from './Table.js';
import { Loading } from '../LoadingComponent/CircularLoading.js';
import { EmptyError, ServerError } from '../FailureComponent/ServerFailure.js';
import { AttendancesMachine } from '../../machines/AttendanceMachine.js';
import { useGlobalStyles } from '../../helpers/styles.js';
import { SmallTitle } from '../../frameworks/Typography.js';

export const EventAttendance = ({
  authService,
  user,
  event_id,
  adminInstructorPermission,
  instructorLevelPermission,
}) => {
  const global = useGlobalStyles();

  const refresh = () => {
    send({ type: 'REFRESH', params: { event_id: event_id } });
  };

  const [create, setCreate] = useState(false);

  const [state, send] = useMachine(AttendancesMachine);

  useEffect(() => {
    send({ type: 'GET_EVENT_ATTENDANCES', params: { event_id: event_id } });
  }, [event_id]);

  return (
    <div>
      <br />
      <div className={global.horizontal} style={{ marginBottom: '10px' }}>
        <SmallTitle title='Attendance List' weight={500} size={16} />
        {state.matches('loaded') && instructorLevelPermission && (
          <Button
            variant='contained'
            style={{ marginLeft: 'auto' }}
            onClick={() => setCreate(true)}
          >
            Create Attendance
          </Button>
        )}
      </div>
      {state.matches('loaded') && (
        <div style={{ marginTop: '32px' }}>
          {state.context.attendances.length > 0 ? (
            <EventAttendanceTable
              authService={authService}
              user={user}
              attendances={state.context.attendances}
              view={adminInstructorPermission}
              edit={instructorLevelPermission}
              remove={instructorLevelPermission}
              refresh={refresh}
            />
          ) : (
            <EmptyError flexCenter />
          )}
        </div>
      )}
      {state.matches('failure') && (
        <ServerError
          authService={authService}
          error={state.context.error}
          flexCenter
        />
      )}
      {state.matches('get_event_attendances') && <Loading flexCenter />}
      {create && (
        <CreateModal
          authService={authService}
          open={create}
          setOpen={setCreate}
          user={user}
          event_id={event_id}
          refresh={() => {
            send({
              type: 'REFRESH',
              params: { event_id: event_id },
            });
          }}
        />
      )}
      <br />
    </div>
  );
};
