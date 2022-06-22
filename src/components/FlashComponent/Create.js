import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { useMachine } from '@xstate/react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { string, object } from 'yup';

import { ServerError } from '../FailureComponent/ServerFailure.js';
import { FlashMachine } from '../../machines/FlashMachine.js';
import { DefaultModal } from '../../frameworks/Modal.js';
import { TextBox } from '../../frameworks/Form.js';

const initialValues = {
  flash_question: '',
  flash_ans: '',
};

const validationFlashSchema = object({
  flash_question: string().required('Question is required'),
  flash_ans: string().required('Answer is required'),
});

const useStyles = makeStyles(() => ({
  modal: {
    width: '420px',
    minHeight: '200px',
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

export const CreateModal = ({
  authService,
  open,
  setOpen,
  user,
  attendance_id,
  refresh,
}) => {
  const classes = useStyles();

  const [state, send] = useMachine(FlashMachine);

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
      header='Create New Flash Question'
      open={open}
      setOpen={setOpen}
      className={classes.modal}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationFlashSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          values.role = user.permission_type;
          values.creator_id = user.getId();
          values.attendance_id = attendance_id;
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
            <Field name='flash_question'>
              {({ field, meta: { touched, error, value, initialValue } }) => (
                <TextBox
                  label='Question'
                  field={field}
                  touched={touched}
                  value={value}
                  initialValue={initialValue}
                  error={error}
                />
              )}
            </Field>
            <Field name='flash_ans'>
              {({ field, meta: { touched, error, value, initialValue } }) => (
                <TextBox
                  label='Answer'
                  field={field}
                  touched={touched}
                  value={value}
                  initialValue={initialValue}
                  error={error}
                />
              )}
            </Field>
            <div style={{ marginTop: '48px' }}>
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
