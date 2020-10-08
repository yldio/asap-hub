import React from 'react';
import css from '@emotion/css';

import { Display, Paragraph, Toggle } from '../atoms';
import { perRem, tabletScreen } from '../pixels';
import { paper, steel } from '../colors';
import { userIcon, teamIcon } from '../icons';
import { contentSidePaddingWithNavigation } from '../layout';
import { SearchControls } from '../organisms';

const containerStyles = css({
  alignSelf: 'stretch',
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
  marginBottom: '2px',
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
});

const textStyles = css({
  maxWidth: `${610 / perRem}em`,
});

const controlsStyles = css({
  display: 'grid',
  gridRowGap: `${8 / perRem}em`,
  gridColumnGap: `${18 / perRem}em`,
  alignItems: 'center',
  paddingTop: `${18 / perRem}em`,
  [`@media (min-width: ${tabletScreen.max + 1}px)`]: {
    paddingTop: `${2 / perRem}em`,
    gridTemplateColumns: 'min-content auto',
  },
});

type NetworkPageHeaderProps = {
  onChangeToggle?: () => void;
  onChangeSearch?: (newQuery: string) => void;
  query: string;
  page: 'teams' | 'users';
};

const NetworkPageHeader: React.FC<NetworkPageHeaderProps> = ({
  onChangeSearch,
  query,
  onChangeToggle,
  page,
}) => {
  return (
    <header css={containerStyles}>
      <Display styleAsHeading={2}>Network</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          Explore the ASAP Network where the collaboration begins! Search and
          browse and then connect with individuals and teams across the ASAP
          Network.
        </Paragraph>
      </div>
      <div css={controlsStyles}>
        <Toggle
          leftButtonText="Teams"
          leftButtonIcon={teamIcon}
          rightButtonText="People"
          rightButtonIcon={userIcon}
          onChange={onChangeToggle}
          position={page === 'teams' ? 'left' : 'right'}
        />
        <SearchControls
          onChangeSearch={onChangeSearch}
          placeholder={
            page === 'users' ? 'Search for someone…' : 'Search for a team…'
          }
          query={query}
          filterEnabled={page === 'users'}
          filterOptions={
            page === 'users'
              ? [
                  { label: 'Lead PI', value: '' },
                  { label: 'Co-investigator', value: '' },
                  { label: 'Key Personnel', value: '' },
                  { label: 'Advisor', value: '' },
                  { label: 'Staff', value: '' },
                  { label: 'Staff', value: '' },
                  { label: 'Guest', value: '' },
                ]
              : []
          }
          filterTitle={page === 'users' ? 'TEAM ROLES' : ''}
        />
      </div>
    </header>
  );
};

export default NetworkPageHeader;
