import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
  Redirect,
} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { NetworkPage, ErrorCard } from '@asap-hub/react-components';
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
  const filters = new Set(currentUrlParams.getAll('filter'));
  const searchQuery = currentUrlParams.get('searchQuery') || undefined;
  const [searchQueryDebounce] = useDebounce(searchQuery, 400);
  const onChangeToggle = (pathname: string) => () => {
    const newUrlParams = new URLSearchParams();
    searchQuery && newUrlParams.set('searchQuery', searchQuery);
    history.push({ pathname, search: newUrlParams.toString() });
  };
  const onChangeSearch = (newQuery: string) => {
    newQuery
      ? currentUrlParams.set('searchQuery', newQuery)
      : currentUrlParams.delete('searchQuery');
    history.replace({ search: currentUrlParams.toString() });
  };
  const onChangeFilter = (filter: string) => {
    currentUrlParams.delete('filter');
    filters.has(filter) ? filters.delete(filter) : filters.add(filter);
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
          <ErrorBoundary FallbackComponent={ErrorCard}>
            <ProfileList filters={filters} searchQuery={searchQueryDebounce} />
          </ErrorBoundary>
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
          <ErrorBoundary FallbackComponent={ErrorCard}>
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
