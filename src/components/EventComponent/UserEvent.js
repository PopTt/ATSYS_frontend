import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useActor, useMachine } from '@xstate/react';
import { Button } from '@mui/material';

import { CreateModal } from './Create.js';
import { JoinModal } from './Join.js';
import { Loading } from '../LoadingComponent/CircularLoading.js';
import { ServerError } from '../FailureComponent/ServerFailure.js';
import { EventsMachine } from '../../machines/EventMachine.js';
import { useGlobalStyles } from '../../helpers/styles.js';
import * as PermissionChecker from '../../helpers/permission.js';
import { ListItem } from '../../frameworks/ListItem.js';
import { SmallTitle, BigTitle, Text } from '../../frameworks/Typography.js';

require('dotenv').config();

const useStyles = makeStyles(() => ({
  container: {
    flexBasis: '100%',
  },
  item: {
    display: 'inline-block',
    minWidth: '295px',
    maxWidth: '295px',
    minHeight: '200px',
    maxHeight: '250px',
    marginRight: '12px',
  },
}));

export const UserEvent = ({ authService, user }) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const adminPermission = PermissionChecker.AdminLevelPermission(
    user.permission_type
  );

  const [create, setCreate] = useState(false);
  const [join, setJoin] = useState(false);

  const [_, toggle_expire] = useActor(authService);
  const [state, send] = useMachine(EventsMachine);

  useEffect(() => {
    send({ type: 'GET_EVENTS', params: { user_id: user.getId() } });
  }, [user]);

  return (
    <div className={classes.container}>
      <div className={global.horizontal}>
        <BigTitle title='Your Events' />
        <div style={{ marginLeft: '32px' }}>
          {adminPermission ? (
            <Button variant='contained' onClick={() => setCreate(true)}>
              Create Event
            </Button>
          ) : (
            <Button variant='contained' onClick={() => setJoin(true)}>
              Join Event
            </Button>
          )}
        </div>
      </div>
      {state.matches('loaded') && (
        <div style={{ marginTop: '32px' }}>
          <ListItem className={classes.item}>
            <SmallTitle title='Event 01' weight='600' />
            <Text
              text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at tempus justo, in eleifend dui. Mauris consequat nibh at nunc varius consequat. Proin egestas justo quis lacus porttitor viverra. Duis et auctor lorem, nec tincidunt tortor. Suspendisse sem libero, fringilla sed imperdiet in, viverra a mi. Ut in venenatis magna. Nulla facilisi. Donec sit amet viverra tortor. Proin tellus felis, ultrices ac enim in, lobortis eleifend felis. Etiam pretium lacinia eros. Mauris dictum quam ut nibh faucibus eleifend. Nullam ornare metus sit amet tortor consequat, vitae luctus dui gravida. Fusce eu dapibus lectus. Duis tristique ligula erat, ut mattis augue aliquam non. Pellentesque quam ex, ornare in vehicula vel, euismod sit amet libero. Donec sed libero velit.'
              readmore
            />
            <Button variant='outlined' style={{ float: 'right' }}>
              Open
            </Button>
          </ListItem>
        </div>
      )}
      {state.matches('failure') && <ServerError error={state.context.error} />}
      {state.matches('get_events') && <Loading />}
      {join && <JoinModal open={join} setOpen={setJoin} />}
      {create && (
        <CreateModal
          authService={authService}
          open={create}
          setOpen={setCreate}
          user={user}
          refresh={() => {
            send({ type: 'GET_EVENTS', params: { user_id: user.getId() } });
          }}
        />
      )}
    </div>
  );
};
