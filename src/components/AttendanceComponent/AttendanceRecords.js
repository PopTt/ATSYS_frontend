import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';
import { useMachine } from '@xstate/react';

import { Loading } from '../LoadingComponent/CircularLoading.js';
import { EmptyError, ServerError } from '../FailureComponent/ServerFailure.js';
import {
  defineUserAttendance,
  AttendancesMachine,
  UserAttendanceMachine,
} from '../../machines/AttendanceMachine.js';
import { AttendanceStatus } from '../../models/UserAttendance.js';
import { SmallTitle } from '../../frameworks/Typography.js';

export const AttendanceRecords = ({
  authService,
  user,
  adminInstructorPermission,
  attendance_id,
}) => {
  const [state, send] = useMachine(AttendancesMachine);

  useEffect(() => {
    send({
      type: 'GET_USERS_EVENT_ATTENDANCES',
      params: { attendance_id: attendance_id },
    });
  }, [attendance_id]);

  return (
    <div
      style={{
        width: '800px',
        margin: '0 auto',
      }}
    >
      {state.matches('loaded') && (
        <div>
          {state.context.userAttendances &&
          state.context.userAttendances.length > 0 ? (
            <AttendanceRecordsGrid
              user={user}
              userAttendances={state.context.userAttendances}
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
      {state.matches('get_users_event_attendances') && <Loading flexCenter />}
    </div>
  );
};

const AttendanceRecordsGrid = ({ user, userAttendances }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [_, send] = useMachine(UserAttendanceMachine);

  const columns = [
    { field: 'id', headerName: 'Id', width: 70, hide: true },
    { field: 'first_name', headerName: 'First name', width: 130 },
    { field: 'last_name', headerName: 'Last name', width: 130 },
    { field: 'email', headerName: 'Email', width: 160 },
    {
      field: 'status',
      headerName: 'Status',
      type: 'singleSelect',
      width: 160,
      editable: true,
      valueOptions: () => {
        return [AttendanceStatus[0], AttendanceStatus[1]];
      },
      preProcessEditCellProps: ({ props, row }) => {
        const updatedRow = { ...row, status: props.value };
        send({
          type: 'UPDATE',
          value: {
            role: user.permission_type,
            ua_id: row.id,
            attendance_status: AttendanceStatus[props.value],
          },
        });
        return { ...props, row: updatedRow };
      },
    },
    {
      field: 'time',
      headerName: 'Recorded Time',
      width: 160,
    },
  ];

  useEffect(() => {
    setLoading(true);
    let temp = [];
    userAttendances.map((userAttendance, index) => {
      let temp_ua = defineUserAttendance(userAttendance);
      temp.push({
        id: userAttendance.ua_id,
        first_name: userAttendance.first_name,
        last_name: userAttendance.last_name,
        email: userAttendance.email,
        status: temp_ua.getStatus(),
        time: temp_ua.getTakenTime(),
      });
    });
    setRows(temp);
    setLoading(false);
  }, [userAttendances]);

  return (
    <div style={{ height: 400, width: '800px' }}>
      <br />
      <SmallTitle title='Attendance Records' />
      <br />
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        loading={loading}
        components={{
          LoadingOverlay: LinearProgress,
        }}
      />
    </div>
  );
};
