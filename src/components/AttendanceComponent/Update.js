import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { useMachine } from '@xstate/react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Select, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { string, object } from 'yup';

import { ServerError } from '../FailureComponent/ServerFailure.js';
import { AttendanceMachine } from '../../machines/AttendanceMachine.js';
import { AttendanceType } from '../../models/Attendance.js';
import { GetCurrentDateTime24Format } from '../../helpers/time.js';
import { DefaultModal } from '../../frameworks/Modal.js';
import { TextBox } from '../../frameworks/Form.js';

const validationAttendanceSchema = object({
  attendance_name: string().required('Name is required'),
  attendance_type: string(),
});

const useStyles = makeStyles(() => ({
  modal: {
    width: '420px',
    minHeight: '300px',
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

export const UpdateModal = ({
  authService,
  open,
  setOpen,
  user,
  attendance,
  refresh,
}) => {
  const classes = useStyles();

  const [state, send] = useMachine(AttendanceMachine(attendance));

  const initialValues = {
    attendance_name: attendance.attendance_name,
    attendance_type: attendance.attendance_type,
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
      header='Update Attendance'
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
          send({ type: 'UPDATE', value: values });
        }}
      >
        {({ setFieldValue }) => (
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
              <Alert severity='success'>Successully Updated.</Alert>
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
            <label className={classes.label}>Attendance Type</label>
            <br />
            <Field name='attendance_type'>
              {({ field, meta: { touched, error, value, initialValue } }) => (
                <Select
                  defaultValue={attendance.attendance_type}
                  onChange={(event) =>
                    setFieldValue('attendance_type', event.target.value)
                  }
                  fullWidth
                >
                  <MenuItem value={'0'}>QR Code</MenuItem>
                  <MenuItem value={'1'}>Flash</MenuItem>
                </Select>
              )}
            </Field>
            <div style={{ marginTop: '48px', marginBottom: '32px' }}>
              <LoadingButton
                type='submit'
                loading={state.matches('updating')}
                variant='contained'
                fullWidth
                disabled={state.matches('done')}
              >
                Update
              </LoadingButton>
            </div>
          </Form>
        )}
      </Formik>
    </DefaultModal>
  );
};
