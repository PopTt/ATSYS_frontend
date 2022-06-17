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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Loading } from '../LoadingComponent/CircularLoading.js';
import { PermissionType } from '../../models/User.js';

const columns = [
  {
    id: 'first_name',
    label: 'First\u00a0Name',
    minWidth: 100,
  },
  { id: 'last_name', label: 'Last\u00a0Name', minWidth: 180, align: 'right' },
  {
    id: 'email',
    label: 'Email',
    minWidth: 180,
    align: 'center',
  },
  {
    id: 'permission_type',
    label: 'Permission\u00a0Type',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'user_id',
    label: 'Actions',
    minWidth: 170,
    align: 'center',
  },
];

function createData(first_name, last_name, email, permission_type, user_id) {
  return { first_name, last_name, email, permission_type, user_id };
}

export const UserTable = ({ users, edit, remove }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    setLoading(true);
    let temp = [];
    users.map((user) => {
      temp.push(
        createData(
          user.first_name,
          user.last_name,
          user.email,
          PermissionType[user.permission_type],
          user.user_id
        )
      );
    });
    setRows(temp);
    setLoading(false);
  }, [users]);

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
                              {column.id != 'user_id' ? (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              ) : (
                                <TableCell key={column.id} align={column.align}>
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
    </>
  );
};
