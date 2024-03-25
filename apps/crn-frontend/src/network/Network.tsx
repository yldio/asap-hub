import { Frame, SearchFrame } from '@asap-hub/frontend-utils';
import { NetworkPage } from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import { FC, lazy, useEffect, useState } from 'react';
import { Redirect, Route, Routes, useMatch } from 'react-router-dom';
import { useSearch } from '../hooks';
import InterestGroupProfile from './interest-groups/InterestGroupProfile';
import WorkingGroupProfile from './working-groups/WorkingGroupProfile';

const loadUserList = () =>
  import(/* webpackChunkName: "network-user-list" */ './users/UserList');
const loadUserProfile = () =>
  import(/* webpackChunkName: "network-user-profile" */ './users/UserProfile');
const loadTeamList = () =>
  import(/* webpackChunkName: "network-team-list" */ './teams/TeamList');
const loadTeamProfile = () =>
  import(/* webpackChunkName: "network-team-profile" */ './teams/TeamProfile');
const loadInterestGroupList = () =>
  import(
    /* webpackChunkName: "network-group-list" */ './interest-groups/InterestGroupList'
  );
const loadGroupProfile = () =>
  import(
    /* webpackChunkName: "network-group-profile" */ './interest-groups/InterestGroupProfile'
  );
const loadWorkingGroupList = () =>
  import(
    /* webpackChunkName: "network-working-group-list" */ './working-groups/WorkingGroupList'
  );
const loadWorkingGroupProfile = () =>
  import(
    /* webpackChunkName: "network-working-group-profile" */ './working-groups/WorkingGroupProfile'
  );

const UserList = lazy(loadUserList);
const UserProfile = lazy(loadUserProfile);
const TeamList = lazy(loadTeamList);
const TeamProfile = lazy(loadTeamProfile);
const InterestGroupList = lazy(loadInterestGroupList);
const WorkingGroupList = lazy(loadWorkingGroupList);

const Network: FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadTeamList()
      // Tab can be changed very quickly
      .then(loadUserList)
      .then(loadInterestGroupList)
      .then(loadWorkingGroupList)
      // Can be clicked only after the list has been fetched
      .then(loadTeamProfile)
      // Can be clicked only after changing tabs and the list has been fetched
      .then(loadUserProfile)
      .then(loadGroupProfile)
      // Can only be loaded by navigating to the URL
      .then(loadWorkingGroupProfile);
  }, []);

  const { path } = useMatch();
  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch();

  const [currentTime] = useState(new Date());
  return (
    <Routes>
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
          <UserProfile currentTime={currentTime} />
        </Frame>
      </Route>
      <Route exact path={path + network({}).teams.template}>
        <NetworkPage
          page="teams"
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
          filters={filters}
          onChangeFilter={toggleFilter}
        >
          <SearchFrame title="Teams">
            <TeamList filters={filters} searchQuery={debouncedSearchQuery} />
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
          <TeamProfile currentTime={currentTime} />
        </Frame>
      </Route>
      <Route exact path={path + network({}).interestGroups.template}>
        <NetworkPage
          page="interest-groups"
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
          filters={filters}
          onChangeFilter={toggleFilter}
        >
          <SearchFrame title="Interest Groups">
            <InterestGroupList
              filters={filters}
              searchQuery={debouncedSearchQuery}
            />
          </SearchFrame>
        </NetworkPage>
      </Route>
      <Route
        path={
          path +
          network({}).interestGroups.template +
          network({}).interestGroups({}).interestGroup.template
        }
      >
        <Frame title="Interest Group Profile">
          <InterestGroupProfile currentTime={currentTime} />
        </Frame>
      </Route>
      <Route exact path={path + network({}).workingGroups.template}>
        <NetworkPage
          page="working-groups"
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
          filters={filters}
          onChangeFilter={toggleFilter}
        >
          <SearchFrame title="Working Groups">
            <WorkingGroupList
              filters={filters}
              searchQuery={debouncedSearchQuery}
            />
          </SearchFrame>
        </NetworkPage>
      </Route>
      <Route
        path={
          path +
          network({}).workingGroups.template +
          network({}).workingGroups({}).workingGroup.template
        }
      >
        <Frame title="Working Group Profile">
          <WorkingGroupProfile currentTime={currentTime} />
        </Frame>
      </Route>
      <Redirect to={network({}).users({}).$} />
    </Routes>
  );
};

export default Network;
