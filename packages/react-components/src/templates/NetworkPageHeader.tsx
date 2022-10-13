import { css } from '@emotion/react';
import { TeamRole, Role, UserTag } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Display, Paragraph, TabLink } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import { SearchAndFilter } from '../organisms';
import { Option, Title } from '../organisms/CheckboxGroup';
import { TabNav, SearchField } from '../molecules';
import { teamIcon, userIcon, groupsIcon } from '../icons';
import { queryParamString } from '../routing';

const visualHeaderStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
  marginBottom: `${30 / perRem}em`,
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
  padding: `0 ${contentSidePaddingWithNavigation(8)}`,
});

interface NetworkTeamsPageHeaderProps {
  page: 'teams';
  filters?: undefined;
  onChangeFilter?: undefined;
}

interface NetworkPeopleOrGroupsPageHeaderProps {
  page: 'users' | 'groups';
  filters?: Set<string>;
  onChangeFilter?: (filter: string) => void;
}
type NetworkPageHeaderProps = (
  | NetworkTeamsPageHeaderProps
  | NetworkPeopleOrGroupsPageHeaderProps
) & {
  searchQuery: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
};

const userFilters: ReadonlyArray<Option<TeamRole | Role | UserTag> | Title> = [
  { title: 'TEAM ROLES' },
  { label: 'Lead PI', value: 'Lead PI (Core Leadership)' },
  { label: 'Co-PI', value: 'Co-PI (Core Leadership)' },
  { label: 'Project Manager', value: 'Project Manager' },
  { label: 'Collaborating PI', value: 'Collaborating PI' },
  { label: 'Key Personnel', value: 'Key Personnel' },
  { label: 'ASAP Staff', value: 'ASAP Staff' },
  { label: 'SAB', value: 'Scientific Advisory Board' },
  { title: 'TYPE OF USERS' },
  { label: 'CRN Member', value: 'CRN Member' },
  { label: 'Alumni Member', value: 'Alumni Member' },
];

const groupFilters: ReadonlyArray<Option<'Active' | 'Inactive'> | Title> = [
  { title: 'INTEREST GROUP STATUS' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

const NetworkPageHeader: React.FC<NetworkPageHeaderProps> = ({
  page,

  searchQuery,
  onChangeSearchQuery,

  filters,
  onChangeFilter,
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
          <span css={iconStyles}>{userIcon}</span>People
        </TabLink>
        <TabLink href={network({}).teams({}).$ + queryParamString(searchQuery)}>
          <span css={iconStyles}>{teamIcon}</span>Teams
        </TabLink>
        <TabLink
          href={network({}).groups({}).$ + queryParamString(searchQuery)}
        >
          <span css={iconStyles}>{groupsIcon}</span>Groups
        </TabLink>
      </TabNav>
    </div>
    <div css={controlsStyles}>
      {page === 'users' ? (
        <SearchAndFilter
          onChangeSearch={onChangeSearchQuery}
          searchPlaceholder="Enter name, keyword, institution, …"
          searchQuery={searchQuery}
          onChangeFilter={onChangeFilter}
          filterOptions={userFilters}
          filters={filters}
        />
      ) : page === 'groups' ? (
        <SearchAndFilter
          onChangeSearch={onChangeSearchQuery}
          searchPlaceholder="Enter a group, keyword, …"
          searchQuery={searchQuery}
          onChangeFilter={onChangeFilter}
          filterOptions={groupFilters}
          filters={filters}
        />
      ) : (
        <SearchField
          placeholder="Enter name, keyword, method, …"
          value={searchQuery}
          onChange={onChangeSearchQuery}
        />
      )}
    </div>
  </header>
);

export default NetworkPageHeader;
