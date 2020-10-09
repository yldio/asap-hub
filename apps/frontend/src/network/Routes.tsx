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
import { useDebounce } from 'use-debounce';

import ProfileList from './ProfileList';
import Profile from './Profile';
import TeamList from './TeamList';
import Team from './Team';

const Network: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { search } = useLocation();
  const history = useHistory();
  const currentUrlParams = new URLSearchParams(search);
  let filters = currentUrlParams.getAll('filter');
  const searchQuery = currentUrlParams.get('searchQuery') || '';
  const [searchQueryDebounce] = useDebounce(searchQuery, 400);
  const onChangeToggle = (pathname: string) => () => {
    currentUrlParams.delete('filter');
    history.push({ pathname, search: currentUrlParams.toString() });
  };
  const onChangeSearch = (newQuery: string) => {
    currentUrlParams.set('searchQuery', newQuery);
    history.replace({ search: currentUrlParams.toString() });
  };
  const onChangeFilter = (filter: string) => {
    currentUrlParams.delete('filter');
    if (filters.includes(filter)) {
      filters = filters.filter((f) => f !== filter);
    } else {
      filters.push(filter);
    }
    filters.forEach((f) => currentUrlParams.append('filter', f));
    history.replace({ search: currentUrlParams.toString() });
  };
  return (
    <Switch>
      <Route exact path={`${path}/users`}>
        <NetworkPage
          page="users"
          onChangeToggle={onChangeToggle('teams')}
          onChangeSearch={onChangeSearch}
          onChangeFilter={onChangeFilter}
          filters={filters}
          searchQuery={searchQuery}
        >
          <ProfileList filters={filters} searchQuery={searchQueryDebounce} />
        </NetworkPage>
      </Route>
      <Route path={`${path}/users/:id`} component={Profile} />
      <Route exact path={`${path}/teams`}>
        <NetworkPage
          page="teams"
          onChangeToggle={onChangeToggle('users')}
          onChangeSearch={onChangeSearch}
          onChangeFilter={onChangeFilter}
          filters={filters}
          searchQuery={searchQuery}
        >
          <TeamList filters={filters} searchQuery={searchQueryDebounce} />
        </NetworkPage>
      </Route>
      <Route path={`${path}/teams/:id`} component={Team} />
      <Redirect to={`${path}/users`} />
    </Switch>
  );
};

export default Network;
