import React, { useEffect, useState } from 'react';
import { AppBar, Box, Button, Toolbar, Tab } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useMachine } from '@xstate/react';

import { AttendanceRecords } from './AttendanceRecords.js';
import { UpdateModal } from './Update.js';
import { Flash } from '../FlashComponent/index.js';
import { Loading } from '../LoadingComponent/CircularLoading.js';
import { EmptyError, ServerError } from '../FailureComponent/ServerFailure.js';
import {
  defineAttendance,
  AttendanceMachine,
} from '../../machines/AttendanceMachine.js';
import { useGlobalStyles } from '../../helpers/styles.js';
import * as PermissionChecker from '../../helpers/permission.js';
import { SmallTitle, BigTitle } from '../../frameworks/Typography.js';
import { TabsPanel, TabPanel } from '../../frameworks/Tab.js';
import { ListItem } from '../../frameworks/ListItem.js';
import { DefaultModal } from '../../frameworks/Modal.js';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    marginTop: '40px',
  },
  modal: {
    width: '420px',
    minHeight: '400px',
    padding: '32px 48px',
  },
}));

export const Attendance = ({ authService, user }) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const [value, setValue] = useState(0);

  const attendance_id = window.location.pathname.split('/')[2];

  const adminInstructorPermission =
    PermissionChecker.AdminInstructorLevelPermission(user.permission_type);

  return (
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
          <BigTitle title='AtAttendance Management' weight='500' />
        </Toolbar>
      </AppBar>
      <Box component='main' className={classes.container}>
        <Toolbar />
        <AttendanceCard
          authService={authService}
          user={user}
          attendance_id={attendance_id}
          adminInstructorPermission={adminInstructorPermission}
        />
        <TabsPanel value={value} setValue={setValue} width='800px'>
          <Tab label='Attendances' />
          {adminInstructorPermission && <Tab label='Flash' />}
        </TabsPanel>
        <TabPanel value={value} index={0}>
          <AttendanceRecords
            authService={authService}
            user={user}
            adminInstructorPermission={adminInstructorPermission}
            attendance_id={attendance_id}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Flash
            authService={authService}
            user={user}
            adminInstructorPermission={adminInstructorPermission}
            attendance_id={attendance_id}
          />
        </TabPanel>
      </Box>
    </Box>
  );
};

const AttendanceCard = ({
  authService,
  user,
  attendance_id,
  adminInstructorPermission,
}) => {
  const [attendance, setAttendance] = useState();

  const [update, setUpdate] = useState(false);
  const [show, setShow] = useState(false);

  const [state, send] = useMachine(AttendanceMachine(undefined));

  const refresh = () => {
    send({
      type: 'REFRESH',
      params: { attendance_id: attendance_id },
    });
  };

  useEffect(() => {
    send({
      type: 'GET_ATTENDANCE',
      params: { attendance_id: attendance_id },
    });
  }, [attendance_id]);

  useEffect(() => {
    let temp = state.context.attendance;
    if (temp != undefined)
      setAttendance(defineAttendance(state.context.attendance));
  }, [state.context.attendance]);

  return (
    <ListItem
      style={{
        width: '800px',
        height: '260px',
        padding: '32px',
        margin: '0 auto',
        cursor: 'default',
      }}
    >
      {state.matches('loaded') && (
        <>
          {attendance ? (
            <>
              <BigTitle title={attendance.getName()} />
              <div style={{ marginBottom: '8px' }}></div>
              <div style={{ height: '130px' }}>
                <SmallTitle
                  title={'Start Time: ' + attendance.getStartTime()}
                  weight={400}
                  size={18}
                />
                <SmallTitle
                  title={'End Time: ' + attendance.getEndTime()}
                  weight={400}
                  size={18}
                />
                <SmallTitle
                  title={'Status: ' + attendance.getStatus()}
                  weight={400}
                  size={18}
                />
                <SmallTitle
                  title={'Type: ' + attendance.getType()}
                  weight={400}
                  size={18}
                />
              </div>
              {adminInstructorPermission && (
                <div className={global.horizontal}>
                  <Button variant='contained' onClick={() => setUpdate(true)}>
                    Update Attendance
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={() => setShow(true)}
                    style={{ marginLeft: '12px' }}
                  >
                    Show QR Code
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyError flexCenter />
          )}
        </>
      )}
      {state.matches('failure') && (
        <ServerError
          authService={authService}
          error={state.context.error}
          flexCenter
        />
      )}
      {state.matches('get_attendance') && <Loading flexCenter />}
      {update && (
        <UpdateModal
          authService={authService}
          open={update}
          setOpen={setUpdate}
          user={user}
          attendance={attendance}
          refresh={refresh}
        />
      )}
      {show && (
        <QRCode
          authService={authService}
          open={show}
          setOpen={setShow}
          attendance_id={attendance_id}
        />
      )}
    </ListItem>
  );
};

const QRCode = ({ authService, open, setOpen, attendance_id }) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const [state, send] = useMachine(AttendanceMachine(undefined));

  useEffect(() => {
    send({
      type: 'GET_QR_CODE',
      params: { attendance_id: attendance_id },
    });
  }, [attendance_id]);

  return (
    <DefaultModal
      header='Attendance QR Code'
      open={open}
      setOpen={setOpen}
      className={classes.modal}
    >
      {state.matches('loaded') && (
        <>
          {state.context.QRCode ? (
            <>
              <img
                src={state.context.QRCode}
                height={250}
                width={250}
                className={global.center}
              />
            </>
          ) : (
            <EmptyError flexCenter />
          )}
        </>
      )}
      {state.matches('failure') && (
        <ServerError
          authService={authService}
          error={state.context.error}
          flexCenter
        />
      )}
      {state.matches('get_qr_code') && <Loading flexCenter />}
    </DefaultModal>
  );
};
