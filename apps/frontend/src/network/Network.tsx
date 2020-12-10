import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  Redirect,
} from 'react-router-dom';
import { NetworkPage } from '@asap-hub/react-components';
import { useDebounce } from 'use-debounce';

import { useSearch } from '../hooks';
import { TEAMS_PATH } from './routes';
import Frame from '../structure/Frame';

const loadUserList = () =>
  import(/* webpackChunkName: "network-user-list" */ './UserList');
const loadUserProfile = () =>
  import(/* webpackChunkName: "network-user-profile" */ './users/UserProfile');
const loadTeamList = () =>
  import(/* webpackChunkName: "network-team-list" */ './TeamList');
const loadTeamProfile = () =>
  import(/* webpackChunkName: "network-team-profile" */ './teams/TeamProfile');
const UserList = React.lazy(loadUserList);
const UserProfile = React.lazy(loadUserProfile);
const TeamList = React.lazy(loadTeamList);
const TeamProfile = React.lazy(loadTeamProfile);
loadTeamList();

const Network: React.FC<{}> = () => {
  useEffect(() => {
    loadTeamList()
      // Toggle can be pressed very quickly
      .then(loadUserList)
      // Team can be clicked only after the list has been fetched
      .then(loadTeamProfile)
      // User can be clicked only after clicking the toggle and the list has been fetched
      .then(loadUserProfile);
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
          <Frame
            boundaryProps={{
              description:
                "We're sorry, we couldn't load the page due to an error.",
              refreshLink: true,
            }}
          >
            <UserList filters={filters} searchQuery={searchQueryDebounce} />
          </Frame>
        </NetworkPage>
      </Route>
      <Route path={`${path}/users/:id`} component={UserProfile} />
      <Route exact path={`${path}/${TEAMS_PATH}`}>
        <NetworkPage
          page="teams"
          onChangeToggle={onChangeToggle('users')}
          onChangeSearch={setSearchQuery}
          onChangeFilter={toggleFilter}
          filters={filters}
          searchQuery={searchQuery}
        >
          <Frame
            boundaryProps={{
              description:
                "We're sorry, we couldn't load the page due to an error.",
              refreshLink: true,
            }}
          >
            <TeamList filters={filters} searchQuery={searchQueryDebounce} />
          </Frame>
        </NetworkPage>
      </Route>
      <Route path={`${path}/${TEAMS_PATH}/:id`} component={TeamProfile} />
      <Redirect to={`${path}/${TEAMS_PATH}`} />
    </Switch>
  );
};

export default Network;
