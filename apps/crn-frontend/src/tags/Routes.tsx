import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NotFoundPage } from '@asap-hub/react-components';
import { Frame } from '@asap-hub/frontend-utils';

import Tags from './Tags';

const Routes: React.FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Frame title="Tag Search">
          <Tags />
        </Frame>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
