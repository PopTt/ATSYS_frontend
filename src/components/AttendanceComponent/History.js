import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';
import { useMachine } from '@xstate/react';

import { Loading } from '../LoadingComponent/CircularLoading.js';
import { EmptyError, ServerError } from '../FailureComponent/ServerFailure.js';
import {
  defineUserAttendance,
  AttendancesMachine,
} from '../../machines/AttendanceMachine.js';
import { RefactorDateTime } from '../../helpers/time.js';
import { SmallTitle } from '../../frameworks/Typography.js';

export const UserAttendanceHistory = ({ authService, user, event_id }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, send] = useMachine(AttendancesMachine);

  useEffect(() => {
    send({
      type: 'GET_USER_HISTORY',
      params: { user_id: user.user_id, event_id: event_id },
    });
  }, [user, event_id]);

  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      width: 70,
      hide: true,
      disableExport: true,
      hideable: false,
      filterable: false,
    },
    { field: 'attendance_name', headerName: 'Attendance Name', width: 130 },
    { field: 'start_time', headerName: 'Start Time', width: 130 },
    { field: 'end_time', headerName: 'End Time', width: 160 },
    {
      field: 'type',
      headerName: 'Recorded Type',
      width: 130,
    },
    {
      field: 'attendance_status',
      headerName: 'Status',
      width: 160,
    },
    {
      field: 'attendance_time',
      headerName: 'Recorded Time',
      width: 160,
    },
    {
      field: 'flash_result',
      headerName: 'Flash Result',
      width: 120,
    },
    {
      field: 'location',
      headerName: 'Recorded Location',
      width: 200,
    },
  ];

  useEffect(() => {
    setLoading(true);
    if (
      state.matches('loaded') &&
      state.context.userAttendances &&
      state.context.userAttendances.length > 0
    ) {
      let temp = [];
      state.context.userAttendances.map((userAttendance, index) => {
        let temp_ua = defineUserAttendance(userAttendance);
        temp.push({
          id: userAttendance.ua_id,
          attendance_name: userAttendance.attendance_name,
          start_time: RefactorDateTime(userAttendance.start_time),
          end_time: RefactorDateTime(userAttendance.end_time),
          type: temp_ua.getTakenType(),
          attendance_status: temp_ua.getStatus(),
          attendance_time: temp_ua.getTakenTime(),
          flash_result: temp_ua.getFlashResult(),
          location: temp_ua.getLocation(),
        });
      });
      setRows(temp);
    }
    setLoading(false);
  }, [state.context.userAttendances]);

  return (
    <div>
      {state.matches('loaded') && (
        <>
          {state.context.userAttendances &&
          state.context.userAttendances.length > 0 ? (
            <div style={{ height: 400, width: '1000px' }}>
              <br />
              <SmallTitle title='Your Attendance History' />
              <br />
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                loading={loading}
                components={{
                  LoadingOverlay: LinearProgress,
                  Toolbar: GridToolbar,
                }}
              />
            </div>
          ) : (
            <div style={{ marginTop: '50px' }}>
              <EmptyError flexCenter />
            </div>
          )}
        </>
      )}
      {state.matches('failure') && (
        <div style={{ marginTop: '50px' }}>
          <ServerError
            authService={authService}
            error={state.context.error}
            flexCenter
          />
        </div>
      )}
      {(state.matches('get_user_history') || loading) && (
        <div style={{ marginTop: '50px' }}>
          <Loading flexCenter />
        </div>
      )}
    </div>
  );
};
