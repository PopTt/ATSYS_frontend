import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useMachine } from '@xstate/react';
import { Button } from '@mui/material';

import { CreateModal } from './Create.js';
import { JoinModal } from './Join.js';
import { Loading } from '../LoadingComponent/CircularLoading.js';
import { EmptyError, ServerError } from '../FailureComponent/ServerFailure.js';
import { EventsMachine } from '../../machines/EventMachine.js';
import { event as event_path } from '../../routes/route_paths.js';
import { useGlobalStyles } from '../../helpers/styles.js';
import { ListItem } from '../../frameworks/ListItem.js';
import { SmallTitle, BigTitle, Text } from '../../frameworks/Typography.js';

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
    verticalAlign: 'top',
  },
}));

export const UserEvent = ({ authService, user, adminPermission }) => {
  const classes = useStyles();
  const global = useGlobalStyles();

  const [create, setCreate] = useState(false);
  const [join, setJoin] = useState(false);

  const [state, send] = useMachine(EventsMachine);

  useEffect(() => {
    if (adminPermission)
      send({ type: 'GET_EVENTS', params: { admin_id: user.getId() } });
    else send({ type: 'GET_USER_EVENTS', params: { user_id: user.getId() } });
  }, [user]);

  return (
    <div className={classes.container}>
      <div className={global.horizontal}>
        <BigTitle title='Your Events' />
        {state.matches('loaded') && (
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
        )}
      </div>
      {state.matches('loaded') && (
        <div style={{ marginTop: '32px' }}>
          {state.context.events.length > 0 ? (
            <div>
              {state.context.events.map((event) => (
                <ListItem className={classes.item} key={event.event_id}>
                  <SmallTitle title={event.event_name} weight='600' />
                  <div style={{ height: '120px' }}>
                    <Text
                      text={
                        event.event_description == ''
                          ? 'No description provided.'
                          : event.event_description
                      }
                      readmore
                    />
                  </div>
                  <Button
                    variant='outlined'
                    style={{ float: 'right' }}
                    onClick={() =>
                      (window.location.href = event_path + '/' + event.event_id)
                    }
                  >
                    Open
                  </Button>
                </ListItem>
              ))}
            </div>
          ) : (
            <EmptyError />
          )}
        </div>
      )}
      {state.matches('failure') && (
        <ServerError authService={authService} error={state.context.error} />
      )}
      {(state.matches('get_events') || state.matches('get_user_events')) && (
        <Loading />
      )}
      {join && (
        <JoinModal
          authService={authService}
          open={join}
          setOpen={setJoin}
          user={user}
          refresh={() => {
            send({ type: 'GET_EVENTS', params: { user_id: user.getId() } });
          }}
        />
      )}
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
