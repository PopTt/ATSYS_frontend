import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useActor } from '@xstate/react';
import { Link } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, Alert } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { string, object } from 'yup';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Lock';

import { home, register } from '../../routes/route_paths.js';
import { TextBox } from '../../frameworks/Form.js';
import { MediumTitle } from '../../frameworks/Typography.js';

const initialValues = {
  email: '',
  password: '',
};

const validationSignInSchema = object({
  email: string().required('Email is required'),
  password: string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
  },
  form: {
    padding: '12px 48px',
    width: '100%',
    minHeight: '500px',
    backgroundColor: 'white',
    boxShadow: theme.shadows[25],
    borderRadius: '12px',
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
}));

export const Login = ({ authService }) => {
  const classes = useStyles();

  const [isExpire, setIsExpire] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [state, send] = useActor(authService);

  useEffect(() => {
    if (state.matches('expire')) setIsExpire(true);
    if (state.matches('logout')) setIsLogout(true);
    send({ type: 'UNAUTHORIZED' });
  }, []);

  useEffect(() => {
    if (state.matches('authorized')) {
      window.location.replace(home);
    }
  }, [state]);

  return (
    <div className={classes.paper} style={{ padding: '32px' }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSignInSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          send({ type: 'LOGIN', value: values });
        }}
      >
        {({ isValid, isSubmitting }) => (
          <Form className={classes.form}>
            <div className={classes.header} style={{ marginBottom: '48px' }}>
              <MediumTitle title='Login' />
            </div>
            {state.matches('failure') && (
              <Alert severity='error'>{state.context.error}</Alert>
            )}
            {isExpire && (
              <Alert severity='error'>
                Session Expired. Please login again.
              </Alert>
            )}
            {isLogout && (
              <Alert severity='success'>
                You have been successfully logged out.
              </Alert>
            )}
            <Field name='email'>
              {({ field, meta: { touched, error, value, initialValue } }) => (
                <TextBox
                  label='Email'
                  type='email'
                  Icon={EmailIcon}
                  iconClass={classes.icon}
                  field={field}
                  touched={touched}
                  value={value}
                  initialValue={initialValue}
                  error={error}
                />
              )}
            </Field>
            <Field name='password'>
              {({ field, meta: { touched, error, value, initialValue } }) => (
                <TextBox
                  label='Password'
                  type='password'
                  Icon={PasswordIcon}
                  iconClass={classes.icon}
                  field={field}
                  touched={touched}
                  value={value}
                  initialValue={initialValue}
                  error={error}
                />
              )}
            </Field>
            <div style={{ marginTop: '64px', marginBottom: '32px' }}>
              <LoadingButton
                type='submit'
                loading={state.matches('login')}
                variant='contained'
                fullWidth
              >
                Login
              </LoadingButton>
            </div>
            <Grid container justifyContent='center'>
              <Grid item>
                <Link to={register} className={classes.link}>
                  Need an account? Register here!
                </Link>
              </Grid>
            </Grid>
            <br />
          </Form>
        )}
      </Formik>
    </div>
  );
};
