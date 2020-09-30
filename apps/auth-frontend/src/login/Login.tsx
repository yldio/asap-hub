import React, { useState } from 'react';
import { SigninPage } from '@asap-hub/react-components';

import {
  authorizeWithSso,
  authorizeWithEmailPassword,
} from '../auth0/web-auth';
import { extractErrorMessage, WebAuthError } from '../auth0/errors';

interface LoginProps {
  readonly email: string;
  readonly setEmail: (newEmail: string) => void;
}
const Login: React.FC<LoginProps> = ({ email, setEmail }) => {
  // DO NOT use the react-router location for Auth0.
  // In a HashRouter, it will not give us the actual query params.
  const signup =
    new URLSearchParams(window.location.search).get('screen_hint') === 'signup';

  const [password, setPassword] = useState('');

  const [error, setError] = useState<WebAuthError | Error>();

  return (
    <SigninPage
      signup={signup}
      termsHref="#TODO"
      privacyPolicyHref="#TODO"
      forgotPasswordHref="/forgot-password"
      onGoogleSignin={() => authorizeWithSso(window.location, 'google-oauth2')}
      onOrcidSignin={() => authorizeWithSso(window.location, 'ORCID')}
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
        authorizeWithEmailPassword(
          window.location,
          email,
          password,
          signup,
        ).catch(setError)
      }
      customValidationMessage={error && extractErrorMessage(error)}
    />
  );
};

export default Login;
