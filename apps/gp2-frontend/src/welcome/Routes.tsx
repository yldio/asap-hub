import { Routes, Route, useLocation } from 'react-router-dom';
import { NotFoundPage } from '@asap-hub/react-components';
import { welcome } from '@asap-hub/routing';

import Welcome from './Welcome';
import Frame from '../Frame';

const WelcomeRoutes: React.FC<Record<string, never>> = () => {
  // const { path } = useMatch();
  const location = useLocation();

  return (
    <Routes>
      <Route
        path={location + welcome({}).invited.template}
        element={
          <Frame title="Register">
            <Welcome />
          </Frame>
        }
      />
      <Route element={<NotFoundPage />} />
    </Routes>
  );
};

export default WelcomeRoutes;
