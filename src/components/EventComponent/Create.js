import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { useActor, useMachine } from '@xstate/react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { string, object } from 'yup';

import { ServerError } from '../FailureComponent/ServerFailure.js';
import { EventMachine } from '../../machines/EventMachine.js';
import { DefaultModal } from '../../frameworks/Modal.js';
import { TextBox } from '../../frameworks/Form.js';

const initialValues = {
  event_name: '',
  event_description: '',
};

const validationEventSchema = object({
  event_name: string().required('Name is required'),
  event_description: string(),
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
      header='Create New Event'
      open={open}
      setOpen={setOpen}
      className={classes.modal}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationEventSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          values.role = user.permission_type;
          values.admin_id = user.getId();
          send({ type: 'CREATE', value: values });
        }}
      >
        {() => (
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
