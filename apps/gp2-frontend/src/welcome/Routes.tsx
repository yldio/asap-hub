import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NotFoundPage } from '@asap-hub/react-components';
import { welcome } from '@asap-hub/routing';

import Welcome from './Welcome';
import Frame from '../structure/Frame';

const Routes: React.FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path + welcome({}).invited.template}>
        <Frame title="Register">
          <Welcome />
        </Frame>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
