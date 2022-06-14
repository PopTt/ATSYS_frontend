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
import { string, object, ref } from 'yup';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

import { register } from '../../links/url.js';
import { useGlobalStyles } from '../../helpers/styles.js';

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
    width: '550px',
    [theme.breakpoints.down('sm')]: {
      width: '350px',
    },
  },
  form: {
    padding: '12px 48px',
    width: '100%',
    minHeight: '480px',
    border: '1px solid black',
    backgroundColor: 'white',
    '& .MuiFormHelperText-root': {
      display: 'block',
      marginTop: '0px',
      marginBottom: '0px',
    },
    '& > *': { margin: '8px 0' },
    [theme.breakpoints.down('sm')]: {
      padding: '30px',
      '& > *': {
        margin: '0',
      },
    },
  },
  header: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  icon: {
    marginRight: '5px',
    fontSize: '36px',
  },
  flexInput: {
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
  submit: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
  link: {
    textDecoration: 'None',
    color: 'black',
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
            <div className={classes.header} style={{ marginBottom: '24px' }}>
              <Typography component='h1' variant='h4' fontWeight={500}>
                Sign In
              </Typography>
            </div>
            <div className={global.sameLine} style={{ marginBottom: '-20px' }}>
              <Grid item justifyContent='left'>
                <FormControlLabel control={<Checkbox />} label='Remember Me' />
              </Grid>
            </div>
            <Divider flexItem>OR</Divider>
            <Grid container justifyContent='center'>
              <Grid item>
                <Link to={register} className={classes.link}>
                  New to URoom? Join Now!
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
