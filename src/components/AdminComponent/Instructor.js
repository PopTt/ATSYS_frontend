import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import { useMachine } from '@xstate/react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Button, LinearProgress } from '@mui/material';

import {
  RegisterForm,
  UpdateForm,
} from '../AuthorizationComponent/Register.js';
import { UserTable } from '../UserComponent/Table.js';
import { Loading } from '../LoadingComponent/CircularLoading.js';
import {
  EmptyError,
  ServerError,
  NotPermissionError,
} from '../FailureComponent/ServerFailure.js';
import { EventMembersMachine } from '../../machines/EventMachine.js';
import { UsersMachine, UserMachine } from '../../machines/UserMachine.js';
import { useGlobalStyles } from '../../helpers/styles.js';
import { BigTitle } from '../../frameworks/Typography.js';
import { DefaultModal } from '../../frameworks/Modal.js';

const useStyles = makeStyles(() => ({
  container: { flexBasis: '100%' },
  modal: {
    width: '500px',
    minHeight: '500px',
    padding: '48px',
  },
  update: {
    width: '500px',
    minHeight: '350px',
    padding: '48px',
  },
}));

export const InstructorManagement = ({
  authService,
  user,
  adminPermission,
}) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const [create, setCreate] = useState(false);
  const [state, send] = useMachine(UsersMachine);

  const refresh = () => {
    send({ type: 'REFRESH', params: { admin_id: user.getId() } });
  };

  useEffect(() => {
    send({ type: 'GET_INSTRUCTORS', params: { admin_id: user.getId() } });
  });

  return (
    <>
      {adminPermission ? (
        <div className={classes.container}>
          <div className={global.horizontal}>
            <BigTitle title='Your Instructors' />
            {state.matches('loaded') && (
              <div style={{ marginLeft: '32px' }}>
                <Button variant='contained' onClick={() => setCreate(true)}>
                  Create Instructor
                </Button>
              </div>
            )}
          </div>
          {state.matches('loaded') && (
            <div style={{ marginTop: '32px' }}>
              {state.context.users.length > 0 ? (
                <div>
                  <UserTable
                    authService={authService}
                    user={user}
                    users={state.context.users}
                    edit={true}
                    remove={true}
                    removeParams={{ role: user.permission_type }}
                    refresh={refresh}
                  />
                </div>
              ) : (
                <EmptyError />
              )}
            </div>
          )}
          {state.matches('failure') && (
            <ServerError
              authService={authService}
              error={state.context.error}
            />
          )}
          {state.matches('get_instructors') && <Loading />}
        </div>
      ) : (
        <div>
          <NotPermissionError />
        </div>
      )}
      {create && (
        <CreateInstructor
          open={create}
          setOpen={setCreate}
          user={user}
          refresh={refresh}
        />
      )}
    </>
  );
};

const CreateInstructor = ({ open, setOpen, user, refresh }) => {
  const classes = useStyles();

  const [state, send] = useMachine(UserMachine);

  const initialValues = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    passwordConfirm: '',
  };

  useEffect(() => {
    if (state.matches('done')) {
      setTimeout(() => {
        setOpen(false);
        refresh();
      }, 1000);
    }
  }, [state]);

  return (
    <DefaultModal
      header='Create New Instructor'
      open={open}
      setOpen={setOpen}
      className={classes.modal}
    >
      <RegisterForm
        initialValues={initialValues}
        register={(values) => {
          values.admin_id = user.getId();
          send({ type: 'CREATE_INSTRUCTOR', value: values });
        }}
        failure={state.matches('failure')}
        success={state.matches('done')}
        loading={state.matches('create_instructor')}
        error={state.context.error}
        successMessage='Successully created! Refreshing...'
      />
    </DefaultModal>
  );
};

export const UpdateInstructor = ({
  open,
  setOpen,
  user,
  instructor,
  refresh,
}) => {
  const classes = useStyles();

  const [state, send] = useMachine(UserMachine);

  const initialValues = {
    email: instructor.email,
    password: '1q2w3E*1q2w3E*',
    first_name: instructor.first_name,
    last_name: instructor.last_name,
    passwordConfirm: '1q2w3E*1q2w3E*',
  };

  useEffect(() => {
    if (state.matches('done')) {
      setTimeout(() => {
        setOpen(false);
        refresh();
      }, 1000);
    }
  }, [state]);

  return (
    <DefaultModal
      header='Update Instructor'
      open={open}
      setOpen={setOpen}
      className={classes.update}
    >
      <UpdateForm
        initialValues={initialValues}
        update={(values) => {
          values.role = user.permission_type;
          values.user_id = instructor.user_id;
          send({ type: 'UPDATE_INSTRUCTOR', value: values });
        }}
        failure={state.matches('failure')}
        success={state.matches('done')}
        loading={state.matches('update_instructor')}
        error={state.context.error}
      />
    </DefaultModal>
  );
};

const columns = [
  { field: 'id', headerName: 'User Id', width: 70, hide: true },
  { field: 'first_name', headerName: 'First name', width: 130 },
  { field: 'last_name', headerName: 'Last name', width: 130 },
  {
    field: 'email',
    headerName: 'Email',
    width: 160,
  },
];

export const InstructorGrid = ({
  authService,
  user,
  users,
  event_id,
  refresh,
}) => {
  const [rows, setRows] = useState([]);
  const [selection, setSelection] = useState([]);
  const [loading, setLoading] = useState(false);

  const [state, send] = useMachine(EventMembersMachine);

  useEffect(() => {
    setLoading(true);
    let temp = [];
    users.map((user) => {
      temp.push({
        id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    });
    setRows(temp);
    setLoading(false);
  }, [users]);

  useEffect(() => {
    if (state.matches('done')) {
      setTimeout(() => {
        refresh();
      }, 1000);
    }
  }, [state]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      {state.matches('failure') && (
        <>
          <Alert severity='error'>{state.context.error}</Alert>{' '}
          <ServerError
            authService={authService}
            error={state.context.error}
            hide
          />
        </>
      )}
      {state.matches('done') && (
        <Alert severity='success' style={{ marginBottom: '24px' }}>
          Successully Added.
        </Alert>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        loading={loading}
        components={{
          LoadingOverlay: LinearProgress,
        }}
        checkboxSelection
        onSelectionModelChange={(newSelection) => {
          setSelection(newSelection);
        }}
      />
      <br />
      <LoadingButton
        loading={state.matches('add_event_instructors')}
        variant='contained'
        style={{ width: '100px' }}
        disabled={state.matches('done') || selection.length == 0}
        onClick={() => {
          send({
            type: 'ADD_EVENT_INSTRUCTORS',
            value: {
              role: user.permission_type,
              event_id: event_id,
              instructor_ids: selection,
            },
          });
        }}
      >
        Add
      </LoadingButton>
    </div>
  );
};
