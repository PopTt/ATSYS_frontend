import React, { useEffect, useState } from 'react';
import { useActor } from '@xstate/react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  IconButton,
} from '@mui/material';
import ViewIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { attendance as attendance_path } from '../../routes/route_paths.js';
import { UpdateModal } from './Update.js';
import { Loading } from '../LoadingComponent/CircularLoading.js';
import { defineAttendance } from '../../machines/AttendanceMachine.js';
import { ConfirmationModal } from '../../frameworks/Modal.js';

const columns = [
  {
    id: 'attendance_name',
    label: 'Name',
    minWidth: 100,
  },
  {
    id: 'start_time',
    label: 'Start\u00a0Time',
    minWidth: 180,
    align: 'right',
  },
  {
    id: 'end_time',
    label: 'End\u00a0Time',
    minWidth: 180,
    align: 'right',
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'center',
  },
];

function createData(attendance_name, start_time, end_time, status, ref) {
  return {
    attendance_name,
    start_time,
    end_time,
    status,
    actions: ref,
  };
}

export const EventAttendanceTable = ({
  authService,
  user,
  attendances,
  view,
  edit,
  remove,
  refresh,
}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    setLoading(true);
    let temp = [];
    attendances.map((attendance) => {
      let defined_temp = defineAttendance(attendance);
      temp.push(
        createData(
          defined_temp.getName(),
          defined_temp.getStartTime(),
          defined_temp.getEndTime(),
          defined_temp.getStatus(),
          attendance.ref
        )
      );
    });
    setRows(temp);
    setLoading(false);
  }, [attendances]);

  return (
    <>
      {!loading ? (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <>
                              {column.id != 'actions' ? (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              ) : (
                                <TableCell key={column.id} align={column.align}>
                                  <Actions
                                    authService={authService}
                                    user={user}
                                    view={view}
                                    remove={remove}
                                    edit={edit}
                                    action={value}
                                    refresh={refresh}
                                  />
                                </TableCell>
                              )}
                            </>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50, 100]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => {
              setPage(newPage);
            }}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(+event.target.value);
              setPage(0);
            }}
          />
        </Paper>
      ) : (
        <Loading />
      )}
    </>
  );
};

const Actions = ({
  authService,
  user,
  view,
  remove,
  edit,
  action,
  refresh,
}) => {
  const [state, send] = useActor(action);

  const [updateAttendance, setUpdateAttendance] = useState(false);
  const [removeAttendance, setRemoveAttendance] = useState(false);

  return (
    <>
      {view !== undefined && (
        <Tooltip title='View Event Attendance'>
          <IconButton
            onClick={() =>
              (window.location.href =
                attendance_path + '/' + state.context.attendance.attendance_id)
            }
          >
            <ViewIcon />
          </IconButton>
        </Tooltip>
      )}
      {edit !== undefined && (
        <Tooltip title='Edit'>
          <IconButton onClick={() => setUpdateAttendance(true)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
      {remove !== undefined && (
        <Tooltip title='Delete'>
          <IconButton onClick={() => setRemoveAttendance(true)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      {removeAttendance && (
        <ConfirmationModal
          authService={authService}
          open={removeAttendance}
          setOpen={setRemoveAttendance}
          onClick={() =>
            send({
              type: 'REMOVE',
              value: {
                role: user.permission_type,
                attendance_id: state.context.attendance.attendance_id,
              },
            })
          }
          failure={state.matches('failure')}
          success={state.matches('done')}
          loading={state.matches('removing')}
          error={state.context.error}
          successMessage='Successully Deleted! Closing...'
          refresh={refresh}
        />
      )}
      {updateAttendance && (
        <UpdateModal
          authService={authService}
          open={updateAttendance}
          setOpen={setUpdateAttendance}
          user={user}
          attendance={state.context.attendance}
          refresh={refresh}
        />
      )}
    </>
  );
};
