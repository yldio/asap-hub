import React from 'react';
import css from '@emotion/css';
import { Display, Paragraph, Button } from '../atoms';
import { perRem, tabletScreen } from '../pixels';
import { paper, steel } from '../colors';
import { filterIcon } from '../icons';
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

const controlsStyles = css({
  display: 'flex',
  justifyContent: 'flex-end',
});

const buttonTextStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'unset',
  },
});

const NetworkPageHeader: React.FC = () => {
  return (
    <header css={containerStyles}>
      <Display styleAsHeading={2}>Network</Display>
      <Paragraph>
        Explore the ASAP Network where the collaboration begins! Search and
        browse and then connect with individuals and teams across the ASAP
        Network.
      </Paragraph>
      <div css={controlsStyles}>
        <Button enabled={false}>
          {filterIcon}
          <span css={buttonTextStyles}>Filters</span>
        </Button>
      </div>
    </header>
  );
};

export default NetworkPageHeader;
