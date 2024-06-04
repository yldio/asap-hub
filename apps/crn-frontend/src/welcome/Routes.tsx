import { Routes, Route, useLocation } from 'react-router-dom';
import { NotFoundPage } from '@asap-hub/react-components';
import { welcome } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

import Welcome from './Welcome';

const WelcomeRoutes: React.FC<Record<string, never>> = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path={location.pathname + welcome({}).invited.template}
        element={
          <Frame title="Register">
            <Welcome />
          </Frame>
        }
      ></Route>
      <Route element={<NotFoundPage />} />
    </Routes>
  );
};

export default WelcomeRoutes;
