import React from 'react';
import { Box, Typography, Modal, Fade, Backdrop } from '@mui/material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
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
