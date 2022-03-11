import { FC, lazy, useEffect } from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { NetworkPage } from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';

import { useSearch } from '../hooks';
import Frame, { SearchFrame } from '../structure/Frame';
import GroupProfile from './groups/GroupProfile';

const loadUserList = () =>
  import(/* webpackChunkName: "network-user-list" */ './users/UserList');
const loadUserProfile = () =>
  import(/* webpackChunkName: "network-user-profile" */ './users/UserProfile');
const loadTeamList = () =>
  import(/* webpackChunkName: "network-team-list" */ './teams/TeamList');
const loadTeamProfile = () =>
  import(/* webpackChunkName: "network-team-profile" */ './teams/TeamProfile');
const loadGroupList = () =>
  import(/* webpackChunkName: "network-group-list" */ './groups/GroupList');
const loadGroupProfile = () =>
  import(
    /* webpackChunkName: "network-group-profile" */ './groups/GroupProfile'
  );
const UserList = lazy(loadUserList);
const UserProfile = lazy(loadUserProfile);
const TeamList = lazy(loadTeamList);
const TeamProfile = lazy(loadTeamProfile);
const GroupList = lazy(loadGroupList);

const Network: FC<Record<string, never>> = () => {
  useEffect(() => {
    loadTeamList()
      // Tab can be changed very quickly
      .then(loadUserList)
      .then(loadGroupList)
      // Can be clicked only after the list has been fetched
      .then(loadTeamProfile)
      // Can be clicked only after changing tabs and the list has been fetched
      .then(loadUserProfile)
      .then(loadGroupProfile);
  }, []);

  const { path } = useRouteMatch();
  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch();

  return (
    <Switch>
      <Route exact path={path + network({}).users.template}>
        <NetworkPage
          page="users"
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
          filters={filters}
          onChangeFilter={toggleFilter}
        >
          <SearchFrame title="People">
            <UserList filters={filters} searchQuery={debouncedSearchQuery} />
          </SearchFrame>
        </NetworkPage>
      </Route>
      <Route
        path={
          path +
          network({}).users.template +
          network({}).users({}).user.template
        }
      >
        <Frame title="User Profile">
          <UserProfile />
        </Frame>
      </Route>
      <Route exact path={path + network({}).teams.template}>
        <NetworkPage
          page="teams"
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
        >
          <SearchFrame title="Teams">
            <TeamList searchQuery={debouncedSearchQuery} />
          </SearchFrame>
        </NetworkPage>
      </Route>
      <Route
        path={
          path +
          network({}).teams.template +
          network({}).teams({}).team.template
        }
      >
        <Frame title="Team Profile">
          <TeamProfile />
        </Frame>
      </Route>
      <Route exact path={path + network({}).groups.template}>
        <NetworkPage
          page="groups"
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
        >
          <SearchFrame title="Groups">
            <GroupList searchQuery={debouncedSearchQuery} />
          </SearchFrame>
        </NetworkPage>
      </Route>
      <Route
        path={
          path +
          network({}).groups.template +
          network({}).groups({}).group.template
        }
      >
        <Frame title="Group Profile">
          <GroupProfile />
        </Frame>
      </Route>
      <Redirect to={network({}).teams({}).$} />
    </Switch>
  );
};

export default Network;
