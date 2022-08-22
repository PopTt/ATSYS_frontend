import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useMachine } from '@xstate/react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Select, MenuItem, InputLabel, TextField } from '@mui/material';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Formik, Form, Field } from 'formik';
import { string, object, date } from 'yup';

import { ServerError } from '../FailureComponent/ServerFailure.js';
import { EventMachine } from '../../machines/EventMachine.js';
import { EventType } from '../../models/Event.js';
import { DefaultModal } from '../../frameworks/Modal.js';
import { TextBox } from '../../frameworks/Form.js';

const initialValues = {
  event_name: '',
  event_description: '',
  start_date: '',
  end_date: '',
};

const validationEventSchema = object({
  event_name: string().required('Name is required'),
  event_description: string(),
  start_date: date().required('Start time is required'),
  end_date: date().required('End time is required'),
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
}));

export const CreateModal = ({ authService, open, setOpen, user, refresh }) => {
  const classes = useStyles();

  const [eventType, setEventType] = useState(0);

  const [state, send] = useMachine(EventMachine(undefined));

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
      header='Create New Class'
      open={open}
      setOpen={setOpen}
      className={classes.modal}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationEventSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          values.event_type = eventType;
          values.role = user.permission_type;
          values.admin_id = user.getId();
          send({ type: 'CREATE', value: values });
        }}
      >
        {({ setFieldValue }) => (
          <Form className={classes.form}>
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
              <Alert severity='success'>Successully Created.</Alert>
            )}
            <Field name='event_name'>
              {({ field, meta: { touched, error, value, initialValue } }) => (
                <TextBox
                  label='Name'
                  field={field}
                  touched={touched}
                  value={value}
                  initialValue={initialValue}
                  error={error}
                />
              )}
            </Field>
            <Field name='event_description'>
              {({ field, meta: { touched, error, value, initialValue } }) => (
                <TextBox
                  label='Description'
                  field={field}
                  touched={touched}
                  value={value}
                  initialValue={initialValue}
                  error={error}
                  row={3}
                />
              )}
            </Field>
            <div style={{ marginTop: '15px' }}></div>
            <InputLabel>Start Date</InputLabel>
            <Field name='start_date'>
              {({ field, meta: { touched, error, value, initialValue } }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    type='date'
                    variant='outlined'
                    value={value}
                    onChange={(newValue) => {
                      setFieldValue('start_date', newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={error}
                        helperText={
                          touched || value !== initialValue ? error : ''
                        }
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            </Field>
            <div style={{ marginTop: '15px' }}></div>
            <InputLabel>End Date</InputLabel>
            <Field name='end_date'>
              {({ field, meta: { touched, error, value, initialValue } }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    type='date'
                    variant='outlined'
                    value={value}
                    onChange={(newValue) => {
                      setFieldValue('end_date', newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={error}
                        helperText={
                          touched || value !== initialValue ? error : ''
                        }
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            </Field>
            <div style={{ marginTop: '15px' }}></div>
            <InputLabel>Type</InputLabel>
            <Select
              value={eventType}
              onChange={(event) => setEventType(event.target.value)}
              variant='standard'
              sx={{ width: '100%' }}
            >
              <MenuItem value={0}>{EventType[0]}</MenuItem>
              <MenuItem value={1}>{EventType[1]}</MenuItem>
              <MenuItem value={2}>{EventType[2]}</MenuItem>
            </Select>
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
            <br />
          </Form>
        )}
      </Formik>
    </DefaultModal>
  );
};
