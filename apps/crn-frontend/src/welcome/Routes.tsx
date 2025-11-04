import { Routes, Route } from 'react-router-dom';
import { NotFoundPage } from '@asap-hub/react-components';
import { welcome } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

import Welcome from './Welcome';

const RoutesComponent: React.FC<Record<string, never>> = () => {
  return (
    <Routes>
      <Route path={welcome({}).invited.template} element={
        <Frame title="Register">
          <Welcome />
        </Frame>
      } />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default RoutesComponent;
