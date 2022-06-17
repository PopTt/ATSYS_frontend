import React, { useEffect, useState } from 'react';
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

import { ViewUsersAttendance } from './View.js';
import { Loading } from '../LoadingComponent/CircularLoading.js';
import { defineAttendance } from '../../machines/AttendanceMachine.js';

const columns = [
  {
    id: 'attendance_name',
    label: 'Name',
    minWidth: 100,
  },
  {
    id: 'attendance_type',
    label: 'Attendance\u00a0Type',
    minWidth: 100,
    align: 'center',
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
    id: 'attendance_id',
    label: 'Actions',
    minWidth: 170,
    align: 'center',
  },
];

function createData(
  attendance_name,
  attendance_type,
  start_time,
  end_time,
  status,
  attendance_id
) {
  return {
    attendance_name,
    attendance_type,
    start_time,
    end_time,
    status,
    attendance_id,
  };
}

export const EventAttendanceTable = ({
  authService,
  user,
  attendances,
  view,
  edit,
  remove,
}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [show, setShow] = useState(false);
  const [viewId, setViewId] = useState('');

  useEffect(() => {
    setLoading(true);
    let temp = [];
    attendances.map((attendance) => {
      let defined_temp = defineAttendance(attendance);
      temp.push(
        createData(
          defined_temp.getName(),
          defined_temp.getType(),
          defined_temp.getStartTime(),
          defined_temp.getEndTime(),
          defined_temp.getStatus(),
          defined_temp.getId()
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
                              {column.id != 'attendance_id' ? (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              ) : (
                                <TableCell key={column.id} align={column.align}>
                                  {view !== undefined && (
                                    <Tooltip title='View Event Attendance'>
                                      <IconButton
                                        onClick={() => {
                                          setShow(true);
                                          setViewId(value);
                                        }}
                                      >
                                        <ViewIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  {edit !== undefined && (
                                    <Tooltip title='Edit'>
                                      <IconButton>
                                        <EditIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  {remove !== undefined && (
                                    <Tooltip title='Delete'>
                                      <IconButton>
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
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
            onPageChange={(event, newPage) => {
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
      {show != '' && (
        <ViewUsersAttendance
          open={show}
          setOpen={setShow}
          viewId={viewId}
          authService={authService}
          user={user}
        />
      )}
    </>
  );
};
