import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Toolbar,
  Tab,
  TextField,
  List,
  ListItem as ListItemMUI,
  ListItemText,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import * as XLSX from 'xlsx';
import { useMachine } from '@xstate/react';

import { UpdateModal } from './Update.js';
import { InstructorGrid } from '../AdminComponent/Instructor.js';
import { EventAttendance } from '../AttendanceComponent/EventAttendance.js';
import { UserAttendanceHistory } from '../AttendanceComponent/History.js';
import { UserTable } from '../UserComponent/Table.js';
import { Loading } from '../LoadingComponent/CircularLoading.js';
import { EmptyError, ServerError } from '../FailureComponent/ServerFailure.js';
import {
  defineEvent,
  EventMachine,
  EventMembersMachine,
} from '../../machines/EventMachine.js';
import { useGlobalStyles } from '../../helpers/styles.js';
import * as PermissionChecker from '../../helpers/permission.js';
import { TabsPanel, TabPanel } from '../../frameworks/Tab.js';
import { SmallTitle, BigTitle, Text } from '../../frameworks/Typography.js';
import { DefaultModal } from '../../frameworks/Modal.js';
import { ListItem } from '../../frameworks/ListItem.js';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    marginTop: '40px',
  },
  dialog: {
    minWidth: '600px',
    maxWidth: '600px',
    minHeight: '250px',
    padding: '32px',
  },
  modal: {
    width: '660px',
    minHeight: '650px',
    padding: '32px 48px',
  },
  modal2: {
    width: '450px',
    minHeight: '260px',
    padding: '32px 48px',
  },
  list: {
    width: '100%',
    maxHeight: '200px',
    overflow: 'auto',
    boxShadow: theme.shadows[26],
  },
}));

export const Event = ({ authService, user }) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const [event, setEvent] = useState(undefined);
  const [update, setUpdate] = useState(false);
  const [invite, setInvite] = useState(false);
  const [value, setValue] = useState(0);

  const [state, send] = useMachine(EventMachine(undefined));

  const event_id = window.location.pathname.split('/')[2];

  const adminPermission = PermissionChecker.AdminLevelPermission(
    user.permission_type
  );

  const adminInstructorPermission =
    PermissionChecker.AdminInstructorLevelPermission(user.permission_type);

  const instructorLevelPermission = PermissionChecker.InstructorLevelPermission(
    user.permission_type
  );

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
              <div className={global.iconBox}>
                <div className={global.icon}>
                  <ion-icon
                    name='arrow-back-outline'
                    onClick={() => window.history.back()}
                  ></ion-icon>
                </div>
              </div>
              <BigTitle title='AtClass Management' weight='500' />
            </Toolbar>
          </AppBar>
          <Box component='main' className={classes.container}>
            <Toolbar />
            <div>
              <ListItem
                style={{
                  width: '1000px',
                  height:
                    adminPermission || adminInstructorPermission
                      ? '330px'
                      : '240px',
                  padding: '32px',
                  margin: '0 auto',
                  cursor: 'default',
                }}
              >
                <BigTitle title={event.getEventName()} />
                <div style={{ marginBottom: '4px' }}></div>
                <SmallTitle
                  title={'Type: ' + event.getEventType()}
                  size={16}
                  weight={500}
                />
                <div style={{ marginBottom: '4px' }}></div>
                <div style={{ height: '160px' }}>
                  {event.getEventDescription() !== '' ? (
                    <Text text={event.getEventDescription()} />
                  ) : (
                    <i>
                      <Text text='No description provided.' />
                    </i>
                  )}
                </div>
                <div className={global.horizontal}>
                  {adminPermission && (
                    <Button variant='contained' onClick={() => setUpdate(true)}>
                      Update Class
                    </Button>
                  )}
                  {adminInstructorPermission && (
                    <Button
                      variant='outlined'
                      onClick={() => setInvite(true)}
                      style={{ marginLeft: adminPermission ? '12px' : '0px' }}
                    >
                      Invite Users
                    </Button>
                  )}
                </div>
              </ListItem>
            </div>
            <TabsPanel value={value} setValue={setValue}>
              <Tab label='Attendances' />
              {adminInstructorPermission && <Tab label='Members' />}
            </TabsPanel>
            <TabPanel value={value} index={0}>
              {adminInstructorPermission ? (
                <EventAttendance
                  authService={authService}
                  user={user}
                  event_id={event_id}
                  adminInstructorPermission={adminInstructorPermission}
                  instructorLevelPermission={instructorLevelPermission}
                />
              ) : (
                <UserAttendanceHistory
                  authService={authService}
                  user={user}
                  event_id={event_id}
                />
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Members
                authService={authService}
                user={user}
                event_id={event_id}
                adminPermission={adminPermission}
                instructorLevelPermission={instructorLevelPermission}
              />
            </TabPanel>
          </Box>
        </Box>
      )}
      {state.matches('failure') && (
        <ServerError authService={authService} error={state.context.error} />
      )}
      {state.matches('get_event') && <Loading />}
      {invite && (
        <InviteModal
          authService={authService}
          open={invite}
          setOpen={setInvite}
          event_id={event_id}
        />
      )}
      {update && (
        <UpdateModal
          authService={authService}
          open={update}
          setOpen={setUpdate}
          user={user}
          event={event}
          refresh={() => {
            send({ type: 'REFRESH', params: { event_id: event_id } });
          }}
        />
      )}
    </>
  );
};

const InviteModal = ({ authService, open, setOpen, event_id }) => {
  const classes = useStyles();

  const [button, setButton] = useState('Copy');

  const [state, send] = useMachine(EventMachine(undefined));

  useEffect(() => {
    send({
      type: 'GET_INVITATION_CODE',
      params: { event_id: event_id },
    });
  }, [event_id]);

  return (
    <DefaultModal
      open={open}
      onClose={() => setOpen(false)}
      className={classes.dialog}
    >
      <BigTitle title='Class Invitation' />
      {state.matches('loaded') && (
        <div style={{ marginTop: '12px' }}>
          <Text text='Copy the invitation code below and send it to your students or instructors to join this class.' />
          <input
            style={{
              marginTop: '10px',
              resize: 'none',
              background: '#f5f5f5',
              border: '0 solid transparent',
              borderRadius: '5px',
              width: '100%',
              padding: '12px',
              fontSize: '16px',
            }}
            value={state.context.event.invitation_code}
            readOnly
          />
          <div style={{ marginTop: '24px' }}>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  state.context.event.invitation_code
                );
                setButton('Copied!');
              }}
              variant='contained'
              disabled={button === 'Copied!' ? true : false}
            >
              {button}
            </Button>
            <Button
              style={{ marginLeft: '12px' }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
          <br />
        </div>
      )}
      {state.matches('failure') && (
        <ServerError authService={authService} error={state.context.error} />
      )}
      {state.matches('get_invitation_code') && <Loading />}
    </DefaultModal>
  );
};

const Members = ({
  authService,
  user,
  event_id,
  adminPermission,
  instructorLevelPermission,
}) => {
  const global = useGlobalStyles();

  const [addInstructor, setAddInstructor] = useState(false);
  const [importStudents, setImportStudents] = useState(false);

  const [state, send] = useMachine(EventMembersMachine);

  const refresh = () => {
    send({ type: 'REFRESH', params: { event_id: event_id } });
  };

  useEffect(() => {
    send({ type: 'GET_EVENT_MEMBERS', params: { event_id: event_id } });
  }, [event_id]);

  return (
    <div>
      <br />
      <div className={global.horizontal} style={{ marginBottom: '10px' }}>
        <SmallTitle title='Class Member List' weight={500} size={16} />
        {state.matches('loaded') && (
          <div style={{ marginLeft: 'auto' }}>
            {instructorLevelPermission && (
              <Button
                variant='contained'
                onClick={() => setImportStudents(true)}
              >
                Import Students
              </Button>
            )}
            {adminPermission && (
              <Button
                variant='contained'
                onClick={() => setAddInstructor(true)}
              >
                Add Instructors
              </Button>
            )}
          </div>
        )}
      </div>
      {state.matches('loaded') && (
        <div style={{ marginTop: '32px' }}>
          {state.context.members.length > 0 ? (
            <div>
              <UserTable
                authService={authService}
                user={user}
                users={state.context.members}
                remove={adminPermission}
                removeParams={{
                  role: user.permission_type,
                  event_id: event_id,
                }}
                refresh={refresh}
              />
            </div>
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
      {state.matches('get_event_members') && <Loading flexCenter />}
      {addInstructor && (
        <AddInstructor
          authService={authService}
          open={addInstructor}
          setOpen={setAddInstructor}
          user={user}
          event_id={event_id}
          refresh={refresh}
        />
      )}
      {importStudents && (
        <ImportStudents
          authService={authService}
          open={importStudents}
          setOpen={setImportStudents}
          user={user}
          event_id={event_id}
          refresh={refresh}
        />
      )}
      <br />
    </div>
  );
};

const AddInstructor = ({
  authService,
  open,
  setOpen,
  user,
  event_id,
  refresh,
}) => {
  const classes = useStyles();

  const [state, send] = useMachine(EventMembersMachine);

  useEffect(() => {
    send({
      type: 'GET_NOT_IN_EVENT_INSTRUCTORS',
      params: { admin_id: user.user_id, event_id: event_id },
    });
  }, [event_id]);

  return (
    <DefaultModal
      header='Add Instructors'
      open={open}
      setOpen={setOpen}
      className={classes.modal}
    >
      {state.matches('loaded') && (
        <>
          {state.context.instructors.length > 0 ? (
            <div>
              <InstructorGrid
                authService={authService}
                user={user}
                users={state.context.instructors}
                event_id={event_id}
                refresh={() => {
                  setOpen(false);
                  refresh();
                }}
              />
            </div>
          ) : (
            <EmptyError />
          )}
        </>
      )}
      {state.matches('failure') && (
        <ServerError authService={authService} error={state.context.error} />
      )}
      {state.matches('get_event_members') && <Loading />}
    </DefaultModal>
  );
};

const ImportStudents = ({
  authService,
  open,
  setOpen,
  user,
  event_id,
  refresh,
}) => {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const [state, send] = useMachine(EventMembersMachine);

  const handleUpload = ({ target }) => {
    setError('');
    setFileName('');

    if (target.files.length > 0) {
      let fileUploadedName = target.files[0].name;
      var acceptedFormats = new Array('.xlsx', '.xls', '.csv');
      let uploadedFormat = fileUploadedName.substring(
        fileUploadedName.lastIndexOf('.')
      );
      if (acceptedFormats.indexOf(uploadedFormat) < 0) {
        setError(
          'You are uploaded invalid format of document. Document with ' +
            acceptedFormats.toString() +
            ' only are supported.'
        );
      } else {
        var document = target.files[0];
        setFileName(document.name);
        var reader = new FileReader();
        reader.onload = function (event) {
          var content = event.target.result;
          var workBook = XLSX.read(content, { type: 'binary' });
          var workSheet = workBook.Sheets[workBook.SheetNames[0]];
          var csv = XLSX.utils.sheet_to_csv(workSheet, { header: 1 });
          var emails = csv.slice(0).split('\n');
          setData(emails);
        };
        reader.readAsBinaryString(document);
      }
    } else {
      setError('No Files Uploaded.');
    }
  };

  useEffect(() => {
    if (state.matches('done')) {
      setTimeout(() => {
        refresh();
        setOpen(false);
      }, 1000);
    }
  }, [state]);

  return (
    <DefaultModal
      header='Import Students'
      open={open}
      setOpen={setOpen}
      className={classes.modal2}
    >
      <div style={{ textAlign: 'justify' }}>
        {state.matches('done') && (
          <Alert severity='success' style={{ marginBottom: '10px' }}>
            Successfully Imported
          </Alert>
        )}
        {state.matches('failure') && (
          <Alert severity='error' style={{ marginBottom: '10px' }}>
            {state.context.error}
          </Alert>
        )}
        <SmallTitle
          title='You can import students with a list of emails in a document with xlsx/xls/csv
          format.'
          size={14}
          weight={400}
        />
        <TextField
          style={{ marginTop: '10px', marginBottom: '5px' }}
          value={fileName}
          fullWidth
          error={error !== ''}
        />
        {error !== '' ? (
          <SmallTitle title={error} color='red' size={12} weight={400} />
        ) : (
          <>
            <br />
          </>
        )}
        <br />
        <Button variant='contained' component='label'>
          Upload File
          <input
            type='file'
            accept='.xlsx, .xls, .csv'
            hidden
            onChange={(value) => handleUpload(value)}
          />
        </Button>
        {data && data.length > 0 && (
          <>
            <br />
            <br />
            <SmallTitle title='Emails to Import' size={18} weight={500} />
            <br />
            <List className={classes.list}>
              {data.map((value, index) => (
                <ListItemMUI key={index}>
                  <ListItemText primary={value} />
                </ListItemMUI>
              ))}
            </List>
            <br />
            <LoadingButton
              loading={state.matches('add_event_students')}
              variant='contained'
              style={{ width: '100px' }}
              disabled={state.matches('done')}
              onClick={() => {
                send({
                  type: 'ADD_EVENT_STUDENTS',
                  value: {
                    role: user.permission_type,
                    emails: data,
                    event: event_id,
                  },
                });
              }}
            >
              Import
            </LoadingButton>
            <br />
          </>
        )}
      </div>
    </DefaultModal>
  );
};
