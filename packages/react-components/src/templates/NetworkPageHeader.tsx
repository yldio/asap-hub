import { css } from '@emotion/react';
import { TeamRole, Role, UserTagType } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Display, Paragraph, TabLink } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import { SearchAndFilter } from '../organisms';
import { Option } from '../organisms/CheckboxGroup';
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

interface NetworkTeamsOrGroupsPageHeaderProps {
  page: 'teams' | 'groups';
  filters?: undefined;
  onChangeFilter?: undefined;
}
interface NetworkPeoplePageHeaderProps {
  page: 'users';
  filters?: Set<string>;
  onChangeFilter?: (filter: string) => void;
}
type NetworkPageHeaderProps = (
  | NetworkTeamsOrGroupsPageHeaderProps
  | NetworkPeoplePageHeaderProps
) & {
  searchQuery: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
};

const userFilters: Option<TeamRole | Role | UserTagType>[] = [
  { label: 'Lead PI', value: 'Lead PI (Core Leadership)' },
  { label: 'Co-PI', value: 'Co-PI (Core Leadership)' },
  { label: 'Project Manager', value: 'Project Manager' },
  { label: 'Collaborating PI', value: 'Collaborating PI' },
  { label: 'Key Personnel', value: 'Key Personnel' },
  { label: 'ASAP Staff', value: 'ASAP Staff' },
  { label: 'SAB', value: 'Scientific Advisory Board' },
  { label: 'CRN Member', value: 'CRN Member' },
  { label: 'Alumni Member', value: 'Alumni Member' },
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
          filterTitle="TEAM ROLES"
          filters={filters}
        />
      ) : (
        <SearchField
          placeholder={
            page === 'teams'
              ? 'Enter name, keyword, method, …'
              : 'Enter a group, keyword, …'
          }
          value={searchQuery}
          onChange={onChangeSearchQuery}
        />
      )}
    </div>
  </header>
);

export default NetworkPageHeader;
