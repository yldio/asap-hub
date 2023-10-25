import { css } from '@emotion/react';
import {
  TeamRole,
  Role,
  UserMembershipStatus,
  activeUserMembershipStatus,
  inactiveUserMembershipStatus,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Display, Paragraph, TabLink } from '../atoms';
import { perRem } from '../pixels';
import { charcoal, lead, paper, steel } from '../colors';
import {
  contentSidePaddingWithNavigation,
  networkContentTopPadding,
} from '../layout';
import { SearchAndFilter } from '../organisms';
import { Option, Title } from '../organisms/CheckboxGroup';
import { TabNav } from '../molecules';
import {
  TeamIcon,
  UserIcon,
  InterestGroupsIcon,
  WorkingGroupsIcon,
} from '../icons';
import { queryParamString } from '../routing';

const visualHeaderStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});
const textStyles = css({
  maxWidth: `${610 / perRem}em`,
});
const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: `${6 / perRem}em`,
});

const controlsStyles = css({
  padding: `${networkContentTopPadding} ${contentSidePaddingWithNavigation(
    8,
  )} 0`,
});

type Page = 'users' | 'interest-groups' | 'teams' | 'working-groups';

type NetworkPageHeaderProps = {
  page: Page;
  filters?: Set<string>;
  onChangeFilter?: (filter: string) => void;
  searchQuery: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
  showSearch?: boolean;
};

const userFilters: ReadonlyArray<
  Option<TeamRole | Role | UserMembershipStatus> | Title
> = [
  { title: 'TEAM ROLES' },
  { label: 'Lead PI', value: 'Lead PI (Core Leadership)' },
  { label: 'Co-PI', value: 'Co-PI (Core Leadership)' },
  { label: 'Project Manager', value: 'Project Manager' },
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

    case 'teams':
    default:
      return {
        filterOptions: teamFilters,
        searchPlaceholder: 'Enter name, keyword, method, …',
      };
  }
};

const NetworkPageHeader: React.FC<NetworkPageHeaderProps> = ({
  page,

  searchQuery,
  onChangeSearchQuery,

  filters,
  onChangeFilter,
  showSearch = true,
}) => (
  <header>
    <div css={visualHeaderStyles}>
      <Display styleAsHeading={2}>Network</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          Explore the ASAP Network and collaborate!
        </Paragraph>
      </div>
      <TabNav>
        <TabLink href={network({}).users({}).$ + queryParamString(searchQuery)}>
          <span css={iconStyles}>
            <UserIcon color={page === 'users' ? charcoal.rgb : lead.rgb} />
          </span>
          People
        </TabLink>
        <TabLink href={network({}).teams({}).$ + queryParamString(searchQuery)}>
          <span css={iconStyles}>
            <TeamIcon color={page === 'teams' ? charcoal.rgb : lead.rgb} />
          </span>
          Teams
        </TabLink>
        <TabLink
          href={
            network({}).interestGroups({}).$ + queryParamString(searchQuery)
          }
        >
          <span css={iconStyles}>
            <InterestGroupsIcon
              color={page === 'interest-groups' ? charcoal.rgb : lead.rgb}
            />
          </span>
          Interest Groups
        </TabLink>
        <TabLink
          href={network({}).workingGroups({}).$ + queryParamString(searchQuery)}
        >
          <span css={iconStyles}>
            <WorkingGroupsIcon
              color={page === 'working-groups' ? charcoal.rgb : lead.rgb}
            />
          </span>
          Working Groups
        </TabLink>
      </TabNav>
    </div>
    {showSearch && (
      <div css={controlsStyles}>
        <SearchAndFilter
          onChangeSearch={onChangeSearchQuery}
          searchQuery={searchQuery}
          onChangeFilter={onChangeFilter}
          filters={filters}
          {...getFilterOptionsAndPlaceholder(page)}
        />
      </div>
    )}
  </header>
);

export default NetworkPageHeader;
