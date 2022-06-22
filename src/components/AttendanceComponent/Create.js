import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { useMachine } from '@xstate/react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { string, object, date } from 'yup';

import { ServerError } from '../FailureComponent/ServerFailure.js';
import { AttendanceMachine } from '../../machines/AttendanceMachine.js';
import { AttendanceType } from '../../models/Attendance.js';
import { GetCurrentDateTime24Format } from '../../helpers/time.js';
import { DefaultModal } from '../../frameworks/Modal.js';
import { TextBox } from '../../frameworks/Form.js';

const initialValues = {
  attendance_name: '',
  start_time: '',
  end_time: '',
  attendance_type: AttendanceType.QRCode,
};

const validationAttendanceSchema = object({
  attendance_name: string().required('Name is required'),
  start_time: date().required('Start time is required'),
  end_time: date().required('End time is required'),
  attendance_type: string(),
});

const useStyles = makeStyles(() => ({
  modal: {
    width: '420px',
    minHeight: '400px',
    padding: '32px 48px',
  },
  form: {
    width: '100%',
    '& .MuiFormHelperText-root': {
      display: 'block',
      marginTop: '0px',
      marginBottom: '0px',
    },
    '& > *': { margin: '10px 0' },
  },
  label: {
    marginTop: '5px',
    marginBottom: '10px',
  },
}));

export const CreateModal = ({
  authService,
  open,
  setOpen,
  user,
  event_id,
  refresh,
}) => {
  const classes = useStyles();

  const [state, send] = useMachine(AttendanceMachine(undefined));

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
      header='Create New Attendance'
      open={open}
      setOpen={setOpen}
      className={classes.modal}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationAttendanceSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          values.role = user.permission_type;
          values.user_id = user.getId();
          values.event_id = event_id;
          send({ type: 'CREATE', value: values });
        }}
      >
        {() => (
          <Form className={classes.form}>
            {state.matches('failure') && (
              <>
                <Alert severity='error'>{state.context.error}</Alert>
                <ServerError
                  authService={authService}
                  error={state.context.error}
                  hide
                />
              </>
            )}
            {state.matches('done') && (
              <Alert severity='success'>Successully Created.</Alert>
            )}
            <label className={classes.label}>Name</label>
            <Field name='attendance_name'>
              {({ field, meta: { touched, error, value, initialValue } }) => (
                <TextBox
                  variant='outlined'
                  field={field}
                  touched={touched}
                  value={value}
                  initialValue={initialValue}
                  error={error}
                />
              )}
            </Field>
            <label className={classes.label}>Start Time</label>
            <Field name='start_time'>
              {({ field, meta: { touched, error, value, initialValue } }) => (
                <TextBox
                  type='datetime-local'
                  inputProps={{ min: GetCurrentDateTime24Format() }}
                  variant='outlined'
                  field={field}
                  touched={touched}
                  value={value}
                  initialValue={initialValue}
                  error={error}
                />
              )}
            </Field>
            <label className={classes.label}>End Time</label>
            <Field name='end_time'>
              {({ field, meta: { touched, error, value, initialValue } }) => (
                <TextBox
                  type='datetime-local'
                  inputProps={{ min: GetCurrentDateTime24Format() }}
                  variant='outlined'
                  field={field}
                  touched={touched}
                  value={value}
                  initialValue={initialValue}
                  error={error}
                />
              )}
            </Field>
            <div style={{ marginTop: '48px', marginBottom: '32px' }}>
              <LoadingButton
                type='submit'
                loading={state.matches('creating')}
                variant='contained'
                fullWidth
                disabled={state.matches('done')}
              >
                Create
              </LoadingButton>
            </div>
          </Form>
        )}
      </Formik>
    </DefaultModal>
  );
};
