import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import ProfileList from './ProfileList';
import TeamList from './TeamList';
import { NetworkPage } from '@asap-hub/react-components';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <NetworkPage>
      <Switch>
        <Route exact path={`${path}/users`} component={ProfileList} />
        <Route exact path={`${path}/teams`} component={TeamList} />
        <Route>Not Found</Route>
      </Switch>
    </NetworkPage>
  );
};

export default Users;
