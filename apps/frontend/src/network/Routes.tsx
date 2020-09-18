import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { NetworkPage } from '@asap-hub/react-components';

import ProfileList from './ProfileList';
import TeamList from './TeamList';

const Network: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { search } = useLocation();
  const history = useHistory();
  const currentUrlParams = new URLSearchParams(search);

  const toggleOnChange = (pathname: string) => () => {
    history.push({ pathname, search: currentUrlParams.toString() });
  };
  const searchOnChange = (newQuery: string) => {
    currentUrlParams.set('query', newQuery);
    history.replace({ search: currentUrlParams.toString() });
  };
  return (
    <Switch>
      <Route
        exact
        path={`${path}/users`}
        render={() => (
          <NetworkPage
            page="users"
            toggleOnChange={toggleOnChange('teams')}
            searchOnChange={searchOnChange}
            query={currentUrlParams.get('query') || ''}
          >
            <ProfileList />
          </NetworkPage>
        )}
      />
      <Route
        exact
        path={`${path}/teams`}
        render={() => (
          <NetworkPage
            page="teams"
            toggleOnChange={toggleOnChange('users')}
            searchOnChange={searchOnChange}
            query={currentUrlParams.get('query') || ''}
          >
            <TeamList />
          </NetworkPage>
        )}
      />
      <Route>Not Found</Route>
    </Switch>
  );
};

export default Network;
