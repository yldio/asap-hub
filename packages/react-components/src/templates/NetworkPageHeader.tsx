import React from 'react';
import css from '@emotion/css';
import { TeamRole, Role } from '@asap-hub/model';

import { Display, Paragraph, TabLink } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import { SearchControls } from '../organisms';
import { Option } from '../organisms/CheckboxGroup';
import { TabNav } from '../molecules';
import { teamIcon, userIcon } from '../icons';

const containerStyles = css({
  alignSelf: 'stretch',
});

const visualHeaderStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
  marginBottom: `${36 / perRem}em`,
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

type NetworkPageHeaderProps = {
  page: 'teams' | 'users';
  teamsHref: string;
  usersHref: string;

  onChangeSearch?: (newQuery: string) => void;
  onChangeFilter?: (filter: string) => void;
  searchQuery?: string;
  filters?: Set<string>;
};

const userFilters: Option<TeamRole | Role>[] = [
  { label: 'Lead PI', value: 'Lead PI (Core Leadership)' },
  { label: 'Co-PI', value: 'Co-PI (Core Leadership)' },
  { label: 'Project Manager', value: 'Project Manager' },
  { label: 'Collaborating PI', value: 'Collaborating PI' },
  { label: 'Key Personnel', value: 'Key Personnel' },
  { label: 'ASAP Staff', value: 'Staff' },
];

const NetworkPageHeader: React.FC<NetworkPageHeaderProps> = ({
  page,
  teamsHref,
  usersHref,

  onChangeSearch,
  onChangeFilter,
  searchQuery,
  filters,
}) => (
  <header css={containerStyles}>
    <div css={visualHeaderStyles}>
      <Display styleAsHeading={2}>Network</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          Explore the ASAP Network and collaborate! Search for teams or
          individuals by keyword or name.
        </Paragraph>
      </div>
      <TabNav>
        <TabLink href={usersHref}>
          <span css={iconStyles}>{userIcon}</span>People
        </TabLink>
        <TabLink href={teamsHref}>
          <span css={iconStyles}>{teamIcon}</span>Teams
        </TabLink>
      </TabNav>
    </div>
    <div css={controlsStyles}>
      <SearchControls
        onChangeSearch={onChangeSearch}
        placeholder={
          page === 'users'
            ? 'Enter name, keyword, institution, …'
            : 'Enter name, keyword, method, …'
        }
        searchQuery={searchQuery}
        onChangeFilter={onChangeFilter}
        filterEnabled={page === 'users'}
        filterOptions={page === 'users' ? userFilters : []}
        filterTitle={page === 'users' ? 'TEAM ROLES' : ''}
        filters={filters}
      />
    </div>
  </header>
);

export default NetworkPageHeader;
