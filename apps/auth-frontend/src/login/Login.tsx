import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Auth0Error } from 'auth0-js';
import { SigninPage } from '@asap-hub/react-components';

import {
  authorizeWithSso,
  authorizeWithEmailPassword,
} from '../auth0/web-auth';

const Login: React.FC<{}> = () => {
  const location = useLocation();
  const signup =
    new URLSearchParams(location.search).get('screen_hint') === 'signup';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<Auth0Error | Error>();

  return (
    <SigninPage
      signup={signup}
      termsHref="#TODO"
      privacyPolicyHref="#TODO"
      forgotPasswordHref="#TODO"
      onGoogleSignin={() => authorizeWithSso(location, 'google-oauth2')}
      onOrcidSignin={() => authorizeWithSso(location, 'ORCID')}
      email={email}
      onChangeEmail={(newEmail) => {
        setEmail(newEmail);
        setError(undefined);
      }}
      password={password}
      onChangePassword={(newPassword) => {
        setPassword(newPassword);
        setError(undefined);
      }}
      onSignin={() =>
        authorizeWithEmailPassword(location, email, password, signup).catch(
          setError,
        )
      }
      customValidationMessage={
        error &&
        // Auth0 API has very inconsistent error formats
        ('error_description' in error
          ? error.error_description
          : 'errorDescription' in error
          ? error.errorDescription
          : 'description' in error
          ? error.description
          : `Unknown authentication error. ${error}`)
      }
    />
  );
};

export default Login;
