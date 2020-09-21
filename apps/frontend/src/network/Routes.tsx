import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
  Redirect,
} from 'react-router-dom';
import { NetworkPage } from '@asap-hub/react-components';

import ProfileList from './ProfileList';
import Profile from './Profile';
import TeamList from './TeamList';
import Team from './Team';

const Network: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { search } = useLocation();
  const history = useHistory();
  const currentUrlParams = new URLSearchParams(search);

  const onChangeToggle = (pathname: string) => () => {
    history.push({ pathname, search: currentUrlParams.toString() });
  };
  const onChangeSearch = (newQuery: string) => {
    currentUrlParams.set('query', newQuery);
    history.replace({ search: currentUrlParams.toString() });
  };
  return (
    <Switch>
      <Route exact path={`${path}/users`}>
        <NetworkPage
          page="users"
          onChangeToggle={onChangeToggle('teams')}
          onChangeSearch={onChangeSearch}
          query={currentUrlParams.get('query') || ''}
        >
          <ProfileList />
        </NetworkPage>
      </Route>
      <Route path={`${path}/users/:id`} component={Profile} />
      <Route exact path={`${path}/teams`}>
        <NetworkPage
          page="teams"
          onChangeToggle={onChangeToggle('users')}
          onChangeSearch={onChangeSearch}
          query={currentUrlParams.get('query') || ''}
        >
          <TeamList />
        </NetworkPage>
      </Route>
      <Route path={`${path}/teams/:id`} component={Team} />
      <Redirect to={`${path}/users`} />
    </Switch>
  );
};

export default Network;
