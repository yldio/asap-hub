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

  const [error, setError] = useState<WebAuthError | Error>();

  return (
    <Routes>
      <Route path='/' element={
        <ForgotPasswordPage
                email={email}
                onChangeEmail={(newEmail) => {
                  setEmail(newEmail);
                  setError(undefined);
                }}
                onSubmit={() => {
                  sendPasswordResetLink(email)
                    .then(() => navigate('completed'))
                    .catch(setError);
                }}
                customValidationMessage={error && extractErrorMessage(error).text}
                onGoBack={() => navigate(-1)}
              />
      } />
      <Route path="completed" element={<PasswordResetEmailSentPage signInHref="/" />}/>
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
};

export default ForgotPassword;
