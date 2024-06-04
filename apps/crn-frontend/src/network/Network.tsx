import { Frame, SearchFrame } from '@asap-hub/frontend-utils';
import { NetworkPage } from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import { FC, lazy, useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useMatch,
} from 'react-router-dom';
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

  const { pathname: path } = useLocation();
  console.log('path', path);
  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch();

  console.log('*', path + network({}).users.template);
  const [currentTime] = useState(new Date());
  return (
    <Routes>
      <Route
        path={path + network({}).users.template}
        element={
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
        }
      />
      <Route
        path={
          path +
          network({}).users.template +
          network({}).users({}).user.template
        }
        element={
          <Frame title="User Profile">
            <UserProfile currentTime={currentTime} />
          </Frame>
        }
      />
      <Route
        path={path + network({}).teams.template}
        element={
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
        }
      />
      <Route
        path={
          path +
          network({}).teams.template +
          network({}).teams({}).team.template
        }
        element={
          <Frame title="Team Profile">
            <TeamProfile currentTime={currentTime} />
          </Frame>
        }
      />
      <Route
        path={path + network({}).interestGroups.template}
        element={
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
        }
      />
      <Route
        path={
          path +
          network({}).interestGroups.template +
          network({}).interestGroups({}).interestGroup.template
        }
        element={
          <Frame title="Interest Group Profile">
            <InterestGroupProfile currentTime={currentTime} />
          </Frame>
        }
      />
      <Route
        path={path + network({}).workingGroups.template}
        element={
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
        }
      />
      <Route
        path={
          path +
          network({}).workingGroups.template +
          network({}).workingGroups({}).workingGroup.template
        }
        element={
          <Frame title="Working Group Profile">
            <WorkingGroupProfile currentTime={currentTime} />
          </Frame>
        }
      />
      <Route path="*" element={<Navigate to={network({}).users({}).$} />} />
    </Routes>
  );
};

export default Network;
