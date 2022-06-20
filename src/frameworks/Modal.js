import React, { useEffect } from 'react';
import {
  Alert,
  Button,
  Box,
  Typography,
  Modal,
  Fade,
  Backdrop,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

import { ServerError } from '../components/FailureComponent/ServerFailure.js';
import { useGlobalStyles } from '../helpers/styles.js';

const useStyles = makeStyles(() => ({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    borderRadius: '4px',
    padding: '32px',
  },
}));

export const DefaultModal = ({
  header,
  open,
  setOpen,
  className,
  children,
}) => {
  const classes = useStyles();

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box className={clsx(classes.container, className)}>
          <Typography variant='h5' component='h1' fontWeight={600}>
            {header}
          </Typography>
          <br />
          {children}
        </Box>
      </Fade>
    </Modal>
  );
};

export const ConfirmationModal = ({
  authService,
  open,
  setOpen,
  onClick,
  failure,
  success,
  loading,
  error,
  successMessage,
  refresh,
}) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setOpen(false);
        refresh();
      }, 1000);
    }
  }, [success]);

  return (
    <Modal
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box className={classes.container}>
          <Typography
            variant='h5'
            component='h1'
            fontWeight={600}
            style={{ marginBottom: '12px' }}
          >
            Confirmation
          </Typography>
          {failure && (
            <>
              <Alert severity='error'>{error}</Alert>
              <ServerError authService={authService} error={error} hide />
            </>
          )}
          {success && <Alert severity='success'>{successMessage}</Alert>}
          <Typography style={{ marginTop: '12px' }}>
            Are you sure you want to continue?
          </Typography>
          <div className={global.horizontal} style={{ marginTop: '24px' }}>
            <LoadingButton
              loading={loading || success}
              variant='contained'
              onClick={() => onClick()}
            >
              Continue
            </LoadingButton>
            <Button
              style={{ marginLeft: '12px' }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
