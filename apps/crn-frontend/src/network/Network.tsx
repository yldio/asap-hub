import { Frame, SearchFrame } from '@asap-hub/frontend-utils';
import { NetworkPage, Paragraph } from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import { FC, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSearch } from '../hooks';
import { useResearchThemes } from '../shared-state/shared-research';
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

  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch();

  const researchThemes = useResearchThemes();
  const [currentTime] = useState(new Date());
  return (
    <Routes>
      <Route
        path="users"
        element={
          <NetworkPage
            page="users"
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
            filters={filters}
            onChangeFilter={toggleFilter}
            pageDescription={
              <Paragraph noMargin accent="lead">
                Members of our research community who contribute to Parkinson's
                disease research as part of the Collaborative Research Network
                (CRN).
              </Paragraph>
            }
          >
            <SearchFrame title="People">
              <UserList filters={filters} searchQuery={debouncedSearchQuery} />
            </SearchFrame>
          </NetworkPage>
        }
      />
      <Route
        path="users/:userId/*"
        element={
          <Frame title="User Profile">
            <UserProfile currentTime={currentTime} />
          </Frame>
        }
      />
      <Route
        path="discovery-teams"
        element={
          <NetworkPage
            page="discovery-teams"
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
            filters={filters}
            onChangeFilter={toggleFilter}
            researchThemes={researchThemes}
            pageDescription={
              <Paragraph noMargin accent="lead">
                Discovery Teams conduct collaborative research projects focused
                on advancing scientific understanding within a defined theme or
                area of inquiry.
              </Paragraph>
            }
          >
            <SearchFrame title="Discovery Teams">
              <TeamList filters={filters} searchQuery={debouncedSearchQuery} />
            </SearchFrame>
          </NetworkPage>
        }
      />
      <Route
        path="resource-teams"
        element={
          <NetworkPage
            page="resource-teams"
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
            filters={filters}
            onChangeFilter={toggleFilter}
            pageDescription={
              <Paragraph noMargin accent="lead">
                Resource Teams support the development of tools, services, and
                shared resources to enable the CRN and ultimately strengthen the
                broader research community.
              </Paragraph>
            }
          >
            <SearchFrame title="Resource Teams">
              <TeamList filters={filters} searchQuery={debouncedSearchQuery} />
            </SearchFrame>
          </NetworkPage>
        }
      />
      <Route
        path="teams/:teamId/*"
        element={
          <Frame title="Team Profile">
            <TeamProfile currentTime={currentTime} />
          </Frame>
        }
      />
      <Route
        path="interest-groups"
        element={
          <NetworkPage
            page="interest-groups"
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
            filters={filters}
            onChangeFilter={toggleFilter}
            pageDescription={
              <Paragraph noMargin accent="lead">
                Interest Groups serve as a forum for exchanging ideas, sharing
                preliminary findings, and fostering collaboration across teams
                working on related scientific themes.
              </Paragraph>
            }
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
        path="interest-groups/:interestGroupId/*"
        element={
          <Frame title="Interest Group Profile">
            <InterestGroupProfile currentTime={currentTime} />
          </Frame>
        }
      />
      <Route
        path="working-groups"
        element={
          <NetworkPage
            page="working-groups"
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
            filters={filters}
            onChangeFilter={toggleFilter}
            pageDescription={
              <Paragraph noMargin accent="lead">
                Working Groups are time-bound, ad hoc groups formed by CRN members
                to address specific needs in the PD field.Their work includes due
                diligence, scoping, and thought leadership aimed at addressing the
                identified need. A Working Group may conclude with a
                recommendation that evolves into a formal project.
              </Paragraph>
            }
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
        path="working-groups/:workingGroupId/*"
        element={
          <Frame title="Working Group Profile">
            <WorkingGroupProfile currentTime={currentTime} />
          </Frame>
        }
      />
      <Route index element={<Navigate to="users" replace />} />
    </Routes>
  );
};

export default Network;
