import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { OutputsPage } from '@asap-hub/gp2-components';

const Events: FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <OutputsPage />
      </Route>
    </Switch>
  );
};

export default Events;
