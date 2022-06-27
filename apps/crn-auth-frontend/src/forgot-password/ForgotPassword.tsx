import { useState } from 'react';
import {
  ForgotPasswordPage,
  PasswordResetEmailSentPage,
} from '@asap-hub/react-components';
import {
  useHistory,
  Switch,
  useRouteMatch,
  Route,
  Redirect,
} from 'react-router-dom';
import { extractErrorMessage, WebAuthError } from '@asap-hub/frontend-utils';

import { sendPasswordResetLink } from '../auth0/web-auth';

interface ForgotPasswordProps {
  readonly email: string;
  readonly setEmail: (newEmail: string) => void;
}
const ForgotPassword: React.FC<ForgotPasswordProps> = ({ email, setEmail }) => {
  const history = useHistory();
  const { path } = useRouteMatch();

  const [error, setError] = useState<WebAuthError | Error>();

  return (
    <Switch>
      <Route exact path={path}>
        <ForgotPasswordPage
          email={email}
          onChangeEmail={(newEmail) => {
            setEmail(newEmail);
            setError(undefined);
          }}
          onSubmit={() => {
            sendPasswordResetLink(email)
              .then(() => history.replace(`${path}/completed`))
              .catch(setError);
          }}
          customValidationMessage={error && extractErrorMessage(error).text}
          onGoBack={() => history.goBack()}
        />
      </Route>
      <Route exact path={`${path}/completed`}>
        <PasswordResetEmailSentPage signInHref="/" />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};

export default ForgotPassword;
