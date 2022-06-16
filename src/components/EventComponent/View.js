import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Tabs,
  Tab,
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
import { useMachine } from '@xstate/react';

import { Loading } from '../LoadingComponent/CircularLoading.js';
import { ServerError } from '../FailureComponent/ServerFailure.js';
import { defineEvent, EventMachine } from '../../machines/EventMachine.js';
import { useGlobalStyles } from '../../helpers/styles.js';
import { SmallTitle, BigTitle, Text } from '../../frameworks/Typography.js';
import { ListItem } from '../../frameworks/ListItem.js';
import DeleteIcon from '@mui/icons-material/Delete';

function TabPanel({ children, value, index }) {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && (
        <div style={{ width: '1000px', margin: '0 auto' }}>{children}</div>
      )}
    </div>
  );
}

const useStyles = makeStyles(() => ({
  iconBox: {
    width: '40px',
    borderRight: '1px solid #F9FAFE',
    marginRight: '40px',
  },
  icon: {
    cursor: 'pointer',
    marginLeft: '15px',
    fontSize: '1.7em',
    marginTop: '10px',
    marginLeft: '-10px',
  },
  container: {
    width: '100%',
    marginTop: '40px',
  },
}));

export const Event = ({ authService, user }) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const [event, setEvent] = useState(undefined);
  const [value, setValue] = React.useState(0);

  const [state, send] = useMachine(EventMachine(undefined));

  const event_id = window.location.pathname.split('/')[2];

  useEffect(() => {
    send({ type: 'GET_EVENT', params: { event_id: event_id } });
  }, []);

  useEffect(() => {
    let temp = state.context.event;
    if (temp != undefined) setEvent(defineEvent(state.context.event));
  }, [state.context.event]);

  return (
    <>
      {state.matches('loaded') && event && (
        <Box sx={{ minHeight: '100vh', width: '100%' }}>
          <AppBar
            position='fixed'
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <Toolbar>
              <div className={classes.iconBox}>
                <div className={classes.icon}>
                  <ion-icon
                    name='arrow-back-outline'
                    onClick={() => window.history.back()}
                  ></ion-icon>
                </div>
              </div>
              <BigTitle title='AtEvent Management' weight='500' />
            </Toolbar>
          </AppBar>
          <Box component='main' className={classes.container}>
            <Toolbar />
            <div>
              {event.getEventDescription() !== '' ? (
                <ListItem
                  style={{
                    width: '1000px',
                    height: '290px',
                    padding: '32px',
                    margin: '0 auto',
                  }}
                >
                  <BigTitle title={event.getEventName()} />
                  <div style={{ marginBottom: '4px' }}></div>
                  <div style={{ height: '160px' }}>
                    <Text text={event.getEventDescription()} />
                  </div>
                  <Button variant='outlined'>Update Event</Button>
                </ListItem>
              ) : (
                <ListItem
                  style={{
                    width: '1000px',
                    height: '140px',
                    padding: '32px',
                    margin: '0 auto',
                  }}
                >
                  <div
                    className={global.horizontal}
                    style={{ marginBottom: '20px' }}
                  >
                    <BigTitle title={event.getEventName()} />
                    <Button variant='outlined' style={{ marginLeft: '24px' }}>
                      Update Event
                    </Button>
                  </div>
                  <i>
                    <Text text='No description provided.' />
                  </i>
                </ListItem>
              )}
            </div>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                width: '1000px',
                margin: '0 auto',
              }}
            >
              <Tabs
                value={value}
                onChange={(_, value) => setValue(value)}
                aria-label='basic tabs example'
              >
                <Tab label='Members' />
                <Tab label='Attendances' />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <br />
              <div
                className={global.horizontal}
                style={{ marginBottom: '10px' }}
              >
                <SmallTitle title='Event Member List' weight={500} size={16} />
                <Button variant='outlined' style={{ marginLeft: 'auto' }}>
                  Add Instructors
                </Button>
              </div>
              <MemberTables />
              <br />
            </TabPanel>
            <TabPanel value={value} index={1}>
              Item Two
            </TabPanel>
          </Box>
        </Box>
      )}
      {state.matches('failure') && (
        <ServerError authService={authService} error={state.context.error} />
      )}
      {state.matches('get_event') && <Loading />}
    </>
  );
};

const columns = [
  {
    id: 'first_name',
    label: 'First\u00a0Name',
    minWidth: 100,
  },
  { id: 'last_name', label: 'Last\u00a0Name', minWidth: 180 },
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

const rows = [
  createData(
    'Lim',
    'Jing Xiang',
    'jingxiang1319@gmail.com',
    'instructor',
    '123'
  ),
];

const MemberTables = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
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
                              <Tooltip title='Delete'>
                                <IconButton>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
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
  );
};
