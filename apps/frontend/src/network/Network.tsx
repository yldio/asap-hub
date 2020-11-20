import React, { Suspense, useEffect } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  Redirect,
} from 'react-router-dom';
import { NetworkPage } from '@asap-hub/react-components';
import { useDebounce } from 'use-debounce';

import ErrorBoundary from '../errors/ErrorBoundary';
import { useSearch } from '../hooks';
import { TEAMS_PATH } from './routes';

const loadProfileList = () =>
  import(/* webpackChunkName: "network-profile-list" */ './ProfileList');
const loadProfile = () =>
  import(/* webpackChunkName: "network-profile" */ './profile/Profile');
const loadTeamList = () =>
  import(/* webpackChunkName: "network-team-list" */ './TeamList');
const loadTeam = () =>
  import(/* webpackChunkName: "network-team" */ './team/Team');
const ProfileList = React.lazy(loadProfileList);
const Profile = React.lazy(loadProfile);
const TeamList = React.lazy(loadTeamList);
const Team = React.lazy(loadTeam);
loadTeamList();

const Network: React.FC<{}> = () => {
  useEffect(() => {
    loadTeamList()
      // Profile toggle can be pressed very quickly
      .then(loadProfileList)
      // Team can be clicked only after the list has been fetched
      .then(loadTeam)
      // Profile can be clicked only after clicking the toggle and the list has been fetched
      .then(loadProfile);
  }, []);

  const { path } = useRouteMatch();
  const {
    filters,
    searchQuery,
    toggleFilter,
    resetFilters,
    setSearchQuery,
  } = useSearch();
  const history = useHistory();
  const [searchQueryDebounce] = useDebounce(searchQuery, 400);

  const onChangeToggle = (pathname: string) => () => {
    history.push({ pathname, search: history.location.search });
    resetFilters();
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
            <Suspense fallback="Loading...">
              <ProfileList
                filters={filters}
                searchQuery={searchQueryDebounce}
              />
            </Suspense>
          </ErrorBoundary>
        </NetworkPage>
      </Route>
      <Route path={`${path}/users/:id`} component={Profile} />
      <Route exact path={`${path}/${TEAMS_PATH}`}>
        <NetworkPage
          page="teams"
          onChangeToggle={onChangeToggle('users')}
          onChangeSearch={setSearchQuery}
          onChangeFilter={toggleFilter}
          filters={filters}
          searchQuery={searchQuery}
        >
          <ErrorBoundary>
            <Suspense fallback="Loading...">
              <TeamList filters={filters} searchQuery={searchQueryDebounce} />
            </Suspense>
          </ErrorBoundary>
        </NetworkPage>
      </Route>
      <Route path={`${path}/${TEAMS_PATH}/:id`} component={Team} />
      <Redirect to={`${path}/${TEAMS_PATH}`} />
    </Switch>
  );
};

export default Network;
