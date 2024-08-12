import { useState } from 'react';
import {
  ForgotPasswordPage,
  PasswordResetEmailSentPage,
} from '@asap-hub/react-components';
import {
  useNavigate,
  Routes,
  Route,
  Navigate,
  useResolvedPath,
} from 'react-router-dom';
import {
  extractErrorMessage,
  WebAuthError,
} from '@asap-hub/auth-frontend-utils';

import { sendPasswordResetLink } from '../auth0/web-auth';

interface ForgotPasswordProps {
  readonly email: string;
  readonly setEmail: (newEmail: string) => void;
}
const ForgotPassword: React.FC<ForgotPasswordProps> = ({ email, setEmail }) => {
  const navigate = useNavigate();
  const path = useResolvedPath('').pathname;

  const [error, setError] = useState<WebAuthError | Error>();

  return (
    <Routes>
      <Route path={path}>
        <ForgotPasswordPage
          email={email}
          onChangeEmail={(newEmail) => {
            setEmail(newEmail);
            setError(undefined);
          }}
          onSubmit={() => {
            sendPasswordResetLink(email)
              .then(() => navigate(`${path}/completed`, { replace: true }))
              .catch(setError);
          }}
          customValidationMessage={error && extractErrorMessage(error).text}
          onGoBack={() => navigate(-1)}
        />
      </Route>
      <Route path={`${path}/completed`}>
        <PasswordResetEmailSentPage signInHref="/" />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ForgotPassword;
