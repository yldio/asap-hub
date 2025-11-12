import { css } from '@emotion/react';
import {
  TeamRole,
  Role,
  UserMembershipStatus,
  activeUserMembershipStatus,
  inactiveUserMembershipStatus,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { ReactNode } from 'react';

import { Display, Paragraph, TabLink } from '../atoms';
import { rem } from '../pixels';
import { SearchAndFilter } from '../organisms';
import { Option, Title } from '../organisms/CheckboxGroup';
import { TabNav } from '../molecules';
import {
  UserIcon,
  InterestGroupsIcon,
  WorkingGroupsIcon,
  DiscoveryTeamIcon,
  ResourceTeamIcon,
} from '../icons';
import { queryParamString } from '../routing';
import PageInfoContainer from './PageInfoContainer';
import PageContraints from './PageConstraints';

const textStyles = css({
  maxWidth: rem(610),
});

type Page =
  | 'users'
  | 'interest-groups'
  | 'discovery-teams'
  | 'resource-teams'
  | 'working-groups';

type NetworkPageHeaderProps = {
  page: Page;
  filters?: Set<string>;
  onChangeFilter?: (filter: string) => void;
  searchQuery: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
  showSearch?: boolean;
  pageDescription?: ReactNode;
};

const userFilters: ReadonlyArray<
  Option<TeamRole | Role | UserMembershipStatus> | Title
> = [
  { title: 'TEAM ROLES' },
  { label: 'Lead PI', value: 'Lead PI (Core Leadership)' },
  { label: 'Co-PI', value: 'Co-PI (Core Leadership)' },
  { label: 'Project Manager', value: 'Project Manager' },
  { label: 'Data Manager', value: 'Data Manager' },
  { label: 'Collaborating PI', value: 'Collaborating PI' },
  { label: 'Key Personnel', value: 'Key Personnel' },
  { label: 'ASAP Staff', value: 'ASAP Staff' },
  { label: 'SAB', value: 'Scientific Advisory Board' },
  { title: 'TYPE OF USERS' },
  { label: activeUserMembershipStatus, value: activeUserMembershipStatus },
  { label: inactiveUserMembershipStatus, value: inactiveUserMembershipStatus },
];

const groupFilters: ReadonlyArray<Option<'Active' | 'Inactive'> | Title> = [
  { title: 'INTEREST GROUP STATUS' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

const workingGroupFilters: ReadonlyArray<
  Option<'Active' | 'Complete'> | Title
> = [
  { title: 'WORKING GROUP STATUS' },
  { label: 'Active', value: 'Active' },
  { label: 'Complete', value: 'Complete' },
];

const teamFilters: ReadonlyArray<Option<'Active' | 'Inactive'> | Title> = [
  { title: 'TEAM STATUS' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

const getFilterOptionsAndPlaceholder = (page: Page) => {
  switch (page) {
    case 'users':
      return {
        filterOptions: userFilters,
        searchPlaceholder: 'Enter name, keyword, institution, …',
      };

    case 'interest-groups':
      return {
        filterOptions: groupFilters,
        searchPlaceholder: 'Enter an interest group, keyword, …',
      };

    case 'working-groups':
      return {
        filterOptions: workingGroupFilters,
        searchPlaceholder: 'Enter name, keyword, …',
      };

    case 'resource-teams':
      return {
        filterOptions: teamFilters,
        searchPlaceholder: 'Enter name, keyword, method, …',
      };
    case 'discovery-teams':
      return {
        filterOptions: teamFilters,
        searchPlaceholder: 'Enter name, keyword, method, …',
      };
    default:
      throw new Error('Invalid page');
  }
};

const NetworkPageHeader: React.FC<NetworkPageHeaderProps> = ({
  page,

  searchQuery,
  onChangeSearchQuery,

  filters,
  onChangeFilter,
  showSearch = true,
  pageDescription,
}) => (
  <header>
    <PageInfoContainer
      nav={
        <TabNav>
          <TabLink
            href={network({}).users({}).$ + queryParamString(searchQuery)}
            Icon={UserIcon}
          >
            People
          </TabLink>
          <TabLink
            href={
              network({}).discoveryTeams({}).$ + queryParamString(searchQuery)
            }
            Icon={DiscoveryTeamIcon}
          >
            Discovery Teams
          </TabLink>
          <TabLink
            href={
              network({}).resourceTeams({}).$ + queryParamString(searchQuery)
            }
            Icon={ResourceTeamIcon}
          >
            Resource Teams
          </TabLink>
          <TabLink
            href={
              network({}).interestGroups({}).$ + queryParamString(searchQuery)
            }
            Icon={InterestGroupsIcon}
          >
            Interest Groups
          </TabLink>
          <TabLink
            href={
              network({}).workingGroups({}).$ + queryParamString(searchQuery)
            }
            Icon={WorkingGroupsIcon}
          >
            Working Groups
          </TabLink>
        </TabNav>
      }
    >
      <Display styleAsHeading={2}>Network</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          Explore the ASAP Network and collaborate!
        </Paragraph>
      </div>
    </PageInfoContainer>
    {pageDescription && (
      <PageContraints noPaddingBottom>{pageDescription}</PageContraints>
    )}
    {showSearch && (
      <PageContraints noPaddingBottom>
        <SearchAndFilter
          onChangeSearch={onChangeSearchQuery}
          searchQuery={searchQuery}
          onChangeFilter={onChangeFilter}
          filters={filters}
          {...getFilterOptionsAndPlaceholder(page)}
        />
      </PageContraints>
    )}
  </header>
);

export default NetworkPageHeader;
