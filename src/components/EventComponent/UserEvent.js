import React from 'react';
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';

import { useGlobalStyles } from '../../helpers/styles.js';
import { ListItem } from '../../frameworks/ListItem.js';
import { SmallTitle, BigTitle } from '../../frameworks/Title.js';

const useStyles = makeStyles((theme) => ({
  container: {
    flexBasis: '100%',
  },
  item: {
    display: 'inline-block',
    minWidth: '295px',
    maxWidth: '295px',
    minHeight: '200px',
    maxHeight: '200px',
    marginRight: '12px',
  },
}));

export const UserEvent = ({ authService }) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  return (
    <div className={classes.container}>
      <div className={global.horizontal}>
        <BigTitle title='Your Events' />
        <div style={{ marginLeft: '32px' }}>
          <Button variant='contained'>Join Event</Button>
        </div>
      </div>
      <div style={{ marginTop: '32px' }}>
        <ListItem className={classes.item}>
          <SmallTitle title='Event 01' weight='600' />
        </ListItem>
        <ListItem className={classes.item}>qwq</ListItem>
        <ListItem className={classes.item}>qwq</ListItem>
        <ListItem className={classes.item}>qwq</ListItem>
        <ListItem className={classes.item}>qwq</ListItem>
        <ListItem className={classes.item}>qwq</ListItem>
        <ListItem className={classes.item}>qwq</ListItem>
        <ListItem className={classes.item}>qwq</ListItem>
        <ListItem className={classes.item}>qwq</ListItem>
        <ListItem className={classes.item}>qwq</ListItem>
        <ListItem className={classes.item}>qwq</ListItem>
        <ListItem className={classes.item}>qwq</ListItem>
      </div>
    </div>
  );
};
