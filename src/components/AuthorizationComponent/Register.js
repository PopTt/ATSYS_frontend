import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { useActor } from '@xstate/react';
import { Link } from 'react-router-dom';
import {
  CssBaseline,
  Alert,
  Grid,
  Divider,
  Typography,
  Container,
} from '@mui/material';
import _ from 'lodash';

import { authorized, unauthorized } from '../../machines/AuthenticationMachine';
import { CircularLoading } from '../LoadingComponents';
import { Google } from './SocialMedia';
import { home } from '../../links/url';
import { useGlobalStyles } from '../../helpers/Styles';
import { TextFieldBox, ButtonDefault } from '../../framework/Form';
import { GetFirstObjectKey } from '../../helpers/Converter';
import {
  useStyles,
  Props,
  validationSignUpSchema,
} from './AuthenticationConfig';
import { User, CreateUser } from '../../models';
import { signIn } from '../../links/url';
import Wave from '../../static/svg/Wave.svg';

const DuplicateEmail = 'Your email has already been registered.';

export const SignUp: React.FC<Props> = ({ authService }) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const [error, setError] = useState('');

  const [state, send] = useActor(authService);

  const initialValues: CreateUser | { passwordConfirm: string } = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    passwordConfirm: '',
  };

  const sendAuthorized = () => send({ type: authorized });
  const sendUnauthorized = () => send({ type: unauthorized });
  const signUp = (user: CreateUser | { passwordConfirm: string }) => {
    send({ type: 'SIGNUP', value: user });
  };
  const googleSignUp = (user: User) => send({ type: 'SIGNIN', value: user });

  useEffect(() => {
    //@ts-ignore
    if (state.value['failure'] !== undefined) {
      setError(state.meta[GetFirstObjectKey(state.meta)]?.message);
      sendUnauthorized();
    } else {
      switch (state.value) {
        case 'redirect':
          if (state.context.user === undefined || state.context.user === null) {
            setError(DuplicateEmail);
            sendUnauthorized();
          } else {
            window.location.replace(home);
            sendAuthorized();
          }
          break;
      }
    }
  }, [state.value]);

  return (
    <>
      <img src={Wave} alt='wave' width='100%' height='100%' />
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper} style={{ width: '650px' }}>
          {state.matches(unauthorized) && (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSignUpSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                signUp(values);
              }}
            >
              {({ setFieldValue, isValid, isSubmitting }) => (
                <Form className={classes.form}>
                  <div className={classes.header}>
                    <Typography component='h1' variant='h4' fontWeight={500}>
                      Sign Up
                    </Typography>
                    <Typography component='p' variant='subtitle1'>
                      Help us to get know about you.
                    </Typography>
                  </div>
                  {error !== null && error !== '' && (
                    <Alert severity='error'>{error}</Alert>
                  )}
                  <div className={classes.flexInput}>
                    <div>
                      <Field name='firstName'>
                        {({
                          field,
                          meta: { touched, error, value, initialValue },
                        }: FieldProps) => (
                          <TextFieldBox
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
                      <Field name='lastName'>
                        {({
                          field,
                          meta: { touched, error, value, initialValue },
                        }: FieldProps) => (
                          <TextFieldBox
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
                  <div className={classes.flexInput}>
                    <div>
                      <Field name='email'>
                        {({
                          field,
                          meta: { touched, error, value, initialValue },
                        }: FieldProps) => (
                          <TextFieldBox
                            label='Email'
                            type='email'
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
                  <div>
                    <Field name='password'>
                      {({
                        field,
                        meta: { touched, error, value, initialValue },
                      }: FieldProps) => (
                        <TextFieldBox
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
                  </div>
                  <div>
                    <Field name='passwordConfirm'>
                      {({
                        field,
                        meta: { touched, error, value, initialValue },
                      }: FieldProps) => (
                        <TextFieldBox
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
                  </div>
                  <ButtonDefault
                    text='Sign Up'
                    buttonClass={classes.submit}
                    isValid={true}
                    isSubmitting={isSubmitting}
                  />
                  <Divider flexItem>OR</Divider>
                  <Google send={googleSignUp} />
                  <Grid container justifyContent='center'>
                    <Grid item>
                      <Link to={signIn} className={classes.link}>
                        {'One of us? Sign in now!'}
                      </Link>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          )}
          {(state.matches('signup') || state.matches('redirect')) && (
            <div className={classes.form}>
              <CircularLoading />
            </div>
          )}
        </div>
      </Container>
    </>
  );
};
