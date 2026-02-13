import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BasicLayout } from '@asap-hub/react-components';
import { getHubUrlFromRedirect } from '@asap-hub/auth-frontend-utils';

import Login from './login/Login';
import ForgotPassword from './forgot-password/ForgotPassword';

const App: React.FC<Record<string, never>> = () => {
  const [email, setEmail] = useState('');
  const hubUrl = getHubUrlFromRedirect();
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <BasicLayout logoHref={hubUrl}>
        <Routes>
          <Route
            path="/login"
            element={<Login email={email} setEmail={setEmail} />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword email={email} setEmail={setEmail} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BasicLayout>
    </HashRouter>
  );
};

export default App;
