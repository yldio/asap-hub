import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  Redirect,
} from 'react-router-dom';
import { NetworkPage } from '@asap-hub/react-components';
import { useDebounce } from 'use-debounce';

import ProfileList from './ProfileList';
import Profile from './Profile';
import TeamList from './TeamList';
import Team from './Team';
import ErrorBoundary from '../errors/ErrorBoundary';
import { useSearch } from '../hooks';

const Network: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { filters, searchQuery, toggleFilter, setSearchQuery } = useSearch();
  const history = useHistory();
  const [searchQueryDebounce] = useDebounce(searchQuery, 400);

  const onChangeToggle = (pathname: string) => () => {
    const newUrlParams = new URLSearchParams();
    searchQuery && newUrlParams.set('searchQuery', searchQuery);
    history.push({ pathname, search: newUrlParams.toString() });
  };

  return (
    <Switch>
      <Route exact path={`${path}/users`}>
        <NetworkPage
          page="users"
          onChangeToggle={onChangeToggle('teams')}
          onChangeSearch={setSearchQuery}
          onChangeFilter={toggleFilter}
          filters={filters}
          searchQuery={searchQuery}
        >
          <ErrorBoundary>
            <ProfileList filters={filters} searchQuery={searchQueryDebounce} />
          </ErrorBoundary>
        </NetworkPage>
      </Route>
      <Route path={`${path}/users/:id`} component={Profile} />
      <Route exact path={`${path}/teams`}>
        <NetworkPage
          page="teams"
          onChangeToggle={onChangeToggle('users')}
          onChangeSearch={setSearchQuery}
          onChangeFilter={toggleFilter}
          filters={filters}
          searchQuery={searchQuery}
        >
          <ErrorBoundary>
            <TeamList filters={filters} searchQuery={searchQueryDebounce} />
          </ErrorBoundary>
        </NetworkPage>
      </Route>
      <Route path={`${path}/teams/:id`} component={Team} />
      <Redirect to={`${path}/users`} />
    </Switch>
  );
};

export default Network;
