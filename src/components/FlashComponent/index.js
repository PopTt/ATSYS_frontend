import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useMachine } from '@xstate/react';
import { Button } from '@mui/material';

import { CreateModal } from './Create.js';
import { UpdateModal } from './Update.js';
import { Loading } from '../LoadingComponent/CircularLoading.js';
import { FlashMachine } from '../../machines/FlashMachine.js';
import { EmptyError, ServerError } from '../FailureComponent/ServerFailure.js';
import { useGlobalStyles } from '../../helpers/styles.js';
import { SmallTitle, BigTitle, Text } from '../../frameworks/Typography.js';
import { ListItem } from '../../frameworks/ListItem.js';

export const Flash = ({
  authService,
  user,
  adminInstructorPermission,
  attendance_id,
}) => {
  const global = useGlobalStyles();

  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [target, setTarget] = useState(undefined);

  const [state, send] = useMachine(FlashMachine);

  const refresh = () => {
    setTarget(undefined);
    send({
      type: 'REFRESH',
      params: { attendance_id: attendance_id },
    });
  };

  useEffect(() => {
    send({
      type: 'GET_FLASHES',
      params: { attendance_id: attendance_id },
    });
  }, [attendance_id]);

  return (
    <>
      {!state.matches('failure') && (
        <div
          style={{
            width: '800px',
            margin: '0 auto',
          }}
        >
          <br />
          <div className={global.horizontal}>
            <SmallTitle title='Flash Question' />
            {state.matches('loaded') && (
              <Button
                variant='contained'
                onClick={() => setCreate(true)}
                style={{ marginLeft: 'auto' }}
              >
                Create Flash
              </Button>
            )}
          </div>
          <br />
          {state.matches('loaded') && (
            <>
              {state.context.flashes !== undefined &&
              state.context.flashes.length > 0 ? (
                <>
                  {state.context.flashes.map((flash) => (
                    <ListItem
                      style={{
                        width: '800px',
                        padding: '32px',
                        margin: '0 auto',
                        cursor: 'default',
                        marginBottom: '10px',
                      }}
                    >
                      <BigTitle title={flash.flash_question} size={24} />
                      <div style={{ marginBottom: '8px' }}></div>
                      <div>
                        <SmallTitle
                          title={'Answer: ' + flash.flash_ans}
                          weight={400}
                          size={18}
                        />
                      </div>
                      <div style={{ marginBottom: '8px' }}></div>
                      {adminInstructorPermission && (
                        <div className={global.horizontal}>
                          <Button
                            variant='contained'
                            onClick={() => {
                              setUpdate(true);
                              setTarget(flash);
                            }}
                          >
                            Update Question
                          </Button>
                        </div>
                      )}
                    </ListItem>
                  ))}
                  <br />
                </>
              ) : (
                <EmptyError flexCenter />
              )}
            </>
          )}
          {state.matches('get_flashes') && <Loading flexCenter />}
        </div>
      )}
      {state.matches('failure') && (
        <ServerError
          authService={authService}
          error={state.context.error}
          flexCenter
        />
      )}
      {create && (
        <CreateModal
          authService={authService}
          user={user}
          open={create}
          setOpen={setCreate}
          attendance_id={attendance_id}
          refresh={refresh}
        />
      )}
      {update && (
        <UpdateModal
          authService={authService}
          user={user}
          open={update}
          setOpen={setUpdate}
          flash={target}
          refresh={refresh}
        />
      )}
    </>
  );
};
