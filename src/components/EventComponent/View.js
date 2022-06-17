import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { AppBar, Box, Button, Toolbar, Tabs, Tab } from '@mui/material';
import { useMachine } from '@xstate/react';

import { InstructorGrid } from '../AdminComponent/Instructor.js';
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
import { SmallTitle, BigTitle, Text } from '../../frameworks/Typography.js';
import { DefaultModal } from '../../frameworks/Modal.js';
import { ListItem } from '../../frameworks/ListItem.js';

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
}));

export const Event = ({ authService, user }) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const [event, setEvent] = useState(undefined);
  const [invite, setInvite] = useState(false);
  const [value, setValue] = React.useState(0);

  const [state, send] = useMachine(EventMachine(undefined));

  const event_id = window.location.pathname.split('/')[2];

  const adminPermission = PermissionChecker.AdminLevelPermission(
    user.permission_type
  );

  const adminInstructorPermission =
    PermissionChecker.AdminInstructorLevelPermission(user.permission_type);

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
              <ListItem
                style={{
                  width: '1000px',
                  height: '290px',
                  padding: '32px',
                  margin: '0 auto',
                  cursor: 'default',
                }}
              >
                <BigTitle title={event.getEventName()} />
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
                    <Button variant='contained'>Update Event</Button>
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
                <Tab label='Attendances' />
                {adminInstructorPermission && <Tab label='Members' />}
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <></>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Members
                authService={authService}
                user={user}
                event_id={event_id}
                adminPermission={adminPermission}
                adminInstructorPermission={adminInstructorPermission}
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
      <BigTitle title='Event Invitation' />
      {state.matches('loaded') && (
        <div style={{ marginTop: '12px' }}>
          <Text text='Copy the invitation code below and send it to your students or instructors to join this event.' />
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
  adminInstructorPermission,
}) => {
  const global = useGlobalStyles();

  const [add, setAdd] = useState(false);

  const [state, send] = useMachine(EventMembersMachine);

  useEffect(() => {
    send({ type: 'GET_EVENT_MEMBERS', params: { event_id: event_id } });
  }, [event_id]);

  return (
    <div>
      <br />
      <div className={global.horizontal} style={{ marginBottom: '10px' }}>
        <SmallTitle title='Event Member List' weight={500} size={16} />
        {state.matches('loaded') && adminPermission && (
          <Button
            variant='contained'
            style={{ marginLeft: 'auto' }}
            onClick={() => setAdd(true)}
          >
            Add Instructors
          </Button>
        )}
      </div>
      {state.matches('loaded') && (
        <div style={{ marginTop: '32px' }}>
          {state.context.members.length > 0 ? (
            <div>
              <UserTable
                users={state.context.members}
                remove={adminInstructorPermission}
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
      {add && (
        <AddInstructor
          authService={authService}
          open={add}
          setOpen={setAdd}
          user={user}
          event_id={event_id}
          refresh={() =>
            send({ type: 'REFRESH', params: { event_id: event_id } })
          }
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
