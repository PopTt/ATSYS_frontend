import React from 'react';
import { Grid } from '@mui/material';
import GoogleLogin from 'react-google-login';

import { IconBox } from '../../frameworks/Icon.js';
import GoogleIcon from '../../static/img/Google.png';

export const Google = ({ send }) => {
  const responseGoogle = (response) => {
    const user = {
      googleId: response['profileObj'].googleId,
      email: response['profileObj'].email,
      firstName: response['profileObj'].familyName,
      lastName: response['profileObj'].givenName,
      profileImage: response['profileObj'].imageUrl,
    };
    send(user);
  };

  return (
    <Grid container justifyContent='center' style={{ textAlign: 'center' }}>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        render={(renderProps) => (
          <IconBox
            source={GoogleIcon}
            width={25}
            height={25}
            title='Continue With Google'
            isAnimation={false}
            onClick={renderProps.onClick}
          />
        )}
        buttonText='Continue with Google'
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </Grid>
  );
};
