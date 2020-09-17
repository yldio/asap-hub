import React from 'react';
import css from '@emotion/css';
import { useLocation, useHistory } from 'react-router-dom';

import { Display, Paragraph, Button, Toggle } from '../atoms';
import { SearchField } from '../molecules';
import { perRem, tabletScreen, smallDesktopScreen } from '../pixels';
import { paper, steel } from '../colors';
import { filterIcon, userIcon, teamIcon } from '../icons';
import { contentSidePaddingWithNavigation } from '../layout';

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
  [`@media (min-width: ${smallDesktopScreen.min}px)`]: {
    paddingTop: `${2 / perRem}em`,
    gridTemplateColumns: '230px auto',
  },
});

const searchContainerStyles = css({
  display: 'grid',
  gridTemplateColumns: 'auto min-content',
  gridColumnGap: `${18 / perRem}em`,
  alignItems: 'center',
});

const buttonTextStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'unset',
  },
});

type NetworkPageHeaderProps = {
  toggleOnChange: () => undefined;
  page: 'teams' | 'users';
};

const NetworkPageHeader: React.FC<NetworkPageHeaderProps> = ({
  toggleOnChange,
  page,
}) => {
  const location = useLocation();
  const history = useHistory();
  const currentUrlParams = new URLSearchParams(location.search);
  const handleSearchOnChange = (newQuery: string) => {
    currentUrlParams.set('query', newQuery);
    history.replace({ search: currentUrlParams.toString() });
  };
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
          onChange={toggleOnChange}
          position={page === 'teams' ? 'left' : 'right'}
        />
        <div css={searchContainerStyles}>
          <SearchField
            value={currentUrlParams.get('query') || ''}
            placeholder={
              page === 'users' ? 'Search for someone…' : 'Search for a team…'
            }
            onChange={handleSearchOnChange}
          />
          <Button enabled={false}>
            {filterIcon}
            <span css={buttonTextStyles}>Filters</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NetworkPageHeader;
