import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import {
  Grid,
  Typography,
  Alert,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { string, object } from 'yup';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Lock';

import { Google } from './Google.js';
import { register } from '../../links/url.js';
import { useGlobalStyles } from '../../helpers/styles.js';
import { ContainedButton, TextBox } from '../../frameworks/Form.js';
import { MediumTitle } from '../../frameworks/Title.js';

require('dotenv').config();

var logoutMessage = 'You have logged out successfully.';
var incorrectInfo = 'Your email or password is incorrect.';
var tokenExpireMessage = 'Your session is expired. Please login again.';

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
    minHeight: '600px',
    backgroundColor: 'white',
    boxShadow: theme.shadows[0],
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

export const validationSignInSchema = object({
  email: string().required('Email is required'),
  password: string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const Login = ({}) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const initialValues = {
    email: '',
    password: '',
  };

  return (
    <div className={classes.paper} style={{ padding: '32px' }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSignInSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
        }}
      >
        {({ isValid, isSubmitting }) => (
          <Form className={classes.form}>
            <div className={classes.header} style={{ marginBottom: '48px' }}>
              <MediumTitle title='Login' />
            </div>
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
            <div className={global.sameLine} style={{ marginBottom: '-20px' }}>
              <Grid item justifyContent='left'>
                <FormControlLabel control={<Checkbox />} label='Remember Me' />
              </Grid>
            </div>
            <div style={{ marginTop: '32px', marginBottom: '32px' }}>
              <ContainedButton
                text='Login'
                onClick={() => console.log('hello')}
                fullWidth
              />
            </div>
            <Divider flexItem>OR</Divider>
            <Google send={() => console.log('sign in')} />
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
