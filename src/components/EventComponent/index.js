import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import { useMachine } from '@xstate/react';
import { Button, LinearProgress } from '@mui/material';

import { CreateModal } from './Create.js';
import { JoinModal } from './Join.js';
import { Loading } from '../LoadingComponent/CircularLoading.js';
import { EmptyError, ServerError } from '../FailureComponent/ServerFailure.js';
import { defineEvent, EventsMachine } from '../../machines/EventMachine.js';
import { event as event_path } from '../../routes/route_paths.js';
import { useGlobalStyles } from '../../helpers/styles.js';
import { SmallTitle, BigTitle } from '../../frameworks/Typography.js';

const useStyles = makeStyles(() => ({
  container: {
    flexBasis: '100%',
  },
  item: {
    display: 'inline-block',
    minWidth: '295px',
    maxWidth: '295px',
    minHeight: '200px',
    maxHeight: '250px',
    marginRight: '12px',
    verticalAlign: 'top',
  },
}));

export const UserEvent = ({
  authService,
  user,
  adminPermission,
  studentPermission,
}) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const [create, setCreate] = useState(false);
  const [join, setJoin] = useState(false);

  const [state, send] = useMachine(EventsMachine);

  useEffect(() => {
    if (adminPermission)
      send({ type: 'GET_EVENTS', params: { admin_id: user.getId() } });
    else send({ type: 'GET_USER_EVENTS', params: { user_id: user.getId() } });
  }, [user]);

  return (
    <div className={classes.container}>
      <div className={global.horizontal}>
        <BigTitle title='Your Classes' />
        {state.matches('loaded') && (
          <div style={{ marginLeft: '32px' }}>
            {adminPermission && (
              <Button variant='contained' onClick={() => setCreate(true)}>
                Create Class
              </Button>
            )}
            {/* {studentPermission && (
              <Button variant='contained' onClick={() => setJoin(true)}>
                Join Class
              </Button>
            )} */}
          </div>
        )}
      </div>
      {state.matches('loaded') && (
        <div style={{ marginTop: '10px' }}>
          {state.context.events.length > 0 ? (
            <ClassGrid
              user={user}
              events={state.context.events}
              adminPermission={adminPermission}
            />
          ) : (
            <EmptyError />
          )}
        </div>
      )}
      {state.matches('failure') && (
        <ServerError authService={authService} error={state.context.error} />
      )}
      {(state.matches('get_events') || state.matches('get_user_events')) && (
        <Loading />
      )}
      {join && (
        <JoinModal
          authService={authService}
          open={join}
          setOpen={setJoin}
          user={user}
          refresh={() => {
            send({
              type: 'GET_USER_EVENTS',
              params: { user_id: user.getId() },
            });
          }}
        />
      )}
      {create && (
        <CreateModal
          authService={authService}
          open={create}
          setOpen={setCreate}
          user={user}
          refresh={() => {
            send({ type: 'GET_EVENTS', params: { admin_id: user.getId() } });
          }}
        />
      )}
    </div>
  );
};

const ClassGrid = ({ user, events, adminPermission }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

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
    { field: 'event_name', headerName: 'Class name', width: 320 },
    {
      field: 'type',
      headerName: 'Class Type',
      width: 160,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      width: 160,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'end_date',
      headerName: 'End Date',
      width: 160,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: ViewClass,
    },
  ];

  useEffect(() => {
    setLoading(true);
    let temp = [];
    events.map((event, index) => {
      let temp_ev = defineEvent(event);
      temp.push({
        id: event.event_id,
        event_name: temp_ev.getEventName(),
        type: temp_ev.getEventType(),
        start_date: temp_ev.getStartDate(),
        end_date: temp_ev.getEndDate(),
        status: temp_ev.getStatus() ? 'Active' : 'Inactive',
        actions: event.event_id,
      });
    });
    setRows(temp);
    setLoading(false);
  }, [events]);

  return (
    <div style={{ height: 700, width: '1150px' }}>
      <br />
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: 'status', sort: 'asc' }],
          },
        }}
        pageSize={12}
        rowsPerPageOptions={[12]}
        loading={loading}
        components={{
          LoadingOverlay: LinearProgress,
          Toolbar: GridToolbar,
        }}
      />
      <br />
    </div>
  );
};

const ViewClass = (props) => {
  const { hasFocus, value } = props;

  return (
    <Button
      component='button'
      variant='contained'
      size='small'
      tabIndex={hasFocus ? 0 : -1}
      onKeyDown={(event) => {
        if (event.key === ' ') {
          event.stopPropagation();
        }
      }}
      onClick={() => (window.location.href = event_path + '/' + value)}
    >
      Open
    </Button>
  );
};
