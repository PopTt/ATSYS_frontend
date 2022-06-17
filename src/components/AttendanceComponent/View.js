import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import { useMachine } from '@xstate/react';

import { Loading } from '../LoadingComponent/CircularLoading.js';
import {
  EmptyError,
  ServerError,
  NotPermissionError,
} from '../FailureComponent/ServerFailure.js';
import { AttendancesMachine } from '../../machines/AttendanceMachine.js';
import { useGlobalStyles } from '../../helpers/styles.js';
import { BigTitle } from '../../frameworks/Typography.js';
import { DefaultModal } from '../../frameworks/Modal.js';

const columns = [
  { field: 'id', headerName: 'User Id', width: 70 },
  { field: 'first_name', headerName: 'First name', width: 130 },
  { field: 'last_name', headerName: 'Last name', width: 130 },
  {
    field: 'status',
    headerName: 'Status',
    width: 160,
  },
];

const useStyles = makeStyles(() => ({
  modal: {
    width: '660px',
    minHeight: '650px',
    padding: '32px 48px',
  },
}));

export const ViewUsersAttendance = ({
  open,
  setOpen,
  viewId,
  authService,
  user,
}) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const [state, send] = useMachine(AttendancesMachine);

  useEffect(() => {
    send({
      type: 'GET_USERS_EVENT_ATTENDANCES',
      params: { attendance_id: viewId },
    });
  });

  return (
    <DefaultModal
      header='Attendance Details'
      open={open}
      setOpen={setOpen}
      className={classes.modal}
    >
      {state.matches('loaded') && (
        <>
          {state.context.userAttendances?.length > 0 ? (
            <DataGrid
              rows={state.context.usersAttendance}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          ) : (
            <EmptyError />
          )}
        </>
      )}
      {state.matches('failure') && (
        <ServerError authService={authService} error={state.context.error} />
      )}
      {state.matches('get_users_event_attendances') && <Loading />}
    </DefaultModal>
  );
};
