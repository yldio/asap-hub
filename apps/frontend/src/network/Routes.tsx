import React from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';

import ProfileList from './ProfileList';
import TeamList from './TeamList';
import { NetworkPage } from '@asap-hub/react-components';

const Network: React.FC<{}> = () => {
  const { path, params } = useRouteMatch();
  const history = useHistory();

  const currentUrlParams = new URLSearchParams(params);

  const toggleOnChange = (path: string) => () => {
    history.push({ pathname: path, search: currentUrlParams.toString() });
  };
  return (
    <Switch>
      <Route
        exact
        path={`${path}/users`}
        render={() => (
          <NetworkPage page="users" toggleOnChange={toggleOnChange('teams')}>
            <ProfileList />
          </NetworkPage>
        )}
      />
      <Route
        exact
        path={`${path}/teams`}
        render={() => (
          <NetworkPage page="teams" toggleOnChange={toggleOnChange('users')}>
            <TeamList />
          </NetworkPage>
        )}
      />
      <Route>Not Found</Route>
    </Switch>
  );
};

export default Network;
