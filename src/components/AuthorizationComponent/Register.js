import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Formik, Form, Field } from 'formik';
import { useActor } from '@xstate/react';
import { Link } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Grid } from '@mui/material';
import { string, object, ref } from 'yup';

import { login } from '../../routes/route_paths.js';
import { MediumTitle } from '../../frameworks/Typography.js';
import { TextBox } from '../../frameworks/Form.js';

const initialValues = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  passwordConfirm: '',
};

const validationSignUpSchema = object({
  email: string().required('Email is required'),
  password: string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Your password must contain at least 8 characters with at least one Uppercase, one Lowercase, one Number and one Symbol.'
    ),
  password_confirm: string()
    .oneOf([ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  first_name: string().required('First Name is required'),
  last_name: string().required('Last Name is required'),
});

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
  },
  container: {
    width: '100%',
    minHeight: '500px',
    backgroundColor: 'white',
    boxShadow: theme.shadows[25],
    borderRadius: '12px',
    padding: '12px 48px',
  },
  form: {
    '& .MuiFormHelperText-root': {
      display: 'block',
      marginTop: '0px',
      marginBottom: '0px',
    },
    '& > *': { margin: '24px 0' },
  },
  header: {
    marginTop: '48px',
    textAlign: 'center',
  },
  icon: {
    marginRight: '12px',
  },
  link: {
    textDecoration: 'None',
    color: 'black',
    '&:hover': {
      color: 'blue',
    },
  },
  flexFieldBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    '& > *': {
      flex: '1 0',
      marginRight: '5px',
    },
    '&:last-child': {
      marginRight: '-5px',
    },
  },
}));

export const Register = ({ authService }) => {
  const classes = useStyles();

  const [state, send] = useActor(authService);

  useEffect(() => {
    send({ type: 'UNAUTHORIZED' });
  }, []);

  useEffect(() => {
    if (state.matches('done')) {
      setTimeout(() => window.location.replace(login), 1000);
    }
  }, [state]);

  return (
    <div className={classes.paper} style={{ width: '650px' }}>
      <div className={classes.container}>
        <div className={classes.header}>
          <MediumTitle title='Register' />
        </div>
        <RegisterForm
          register={(values) => send({ type: 'REGISTER', value: values })}
          failure={state.matches('failure')}
          success={state.matches('done')}
          loading={state.matches('register')}
          error={state.context.error}
        />
        <Grid container justifyContent='center'>
          <Grid item>
            <Link to={login} className={classes.link}>
              Have an account? Login here!
            </Link>
          </Grid>
        </Grid>
        <br />
        <br />
      </div>
    </div>
  );
};

export const RegisterForm = ({
  register,
  failure,
  success,
  loading,
  error,
  successMessage = 'Successully registered! Redirecting...',
}) => {
  const classes = useStyles();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSignUpSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        register(values);
      }}
    >
      {() => (
        <Form className={classes.form}>
          {failure && <Alert severity='error'>{error}</Alert>}
          {success && <Alert severity='success'>{successMessage}</Alert>}
          <Field name='email'>
            {({ field, meta: { touched, error, value, initialValue } }) => (
              <TextBox
                label='Email'
                type='email'
                iconClass={classes.icon}
                field={field}
                touched={touched}
                value={value}
                initialValue={initialValue}
                error={error}
              />
            )}
          </Field>
          <div className={classes.flexFieldBox}>
            <div>
              <Field name='first_name'>
                {({ field, meta: { touched, error, value, initialValue } }) => (
                  <TextBox
                    label='First Name'
                    field={field}
                    touched={touched}
                    value={value}
                    initialValue={initialValue}
                    error={error}
                  />
                )}
              </Field>
            </div>
            <div style={{ marginLeft: '10px' }}>
              <Field name='last_name'>
                {({ field, meta: { touched, error, value, initialValue } }) => (
                  <TextBox
                    label='Last Name'
                    field={field}
                    touched={touched}
                    value={value}
                    initialValue={initialValue}
                    error={error}
                  />
                )}
              </Field>
            </div>
          </div>
          <Field name='password'>
            {({ field, meta: { touched, error, value, initialValue } }) => (
              <TextBox
                label='Password'
                type='password'
                field={field}
                touched={touched}
                value={value}
                initialValue={initialValue}
                error={error}
              />
            )}
          </Field>
          <Field name='password_confirm'>
            {({ field, meta: { touched, error, value, initialValue } }) => (
              <TextBox
                label='Confirm Password'
                type='password'
                field={field}
                touched={touched}
                value={value}
                initialValue={initialValue}
                error={error}
              />
            )}
          </Field>
          <div style={{ marginTop: '32px', marginBottom: '32px' }}>
            <LoadingButton
              type='submit'
              loading={loading || success}
              variant='contained'
              fullWidth
            >
              Register
            </LoadingButton>
          </div>
        </Form>
      )}
    </Formik>
  );
};
