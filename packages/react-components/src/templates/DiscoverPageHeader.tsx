import React from 'react';
import css from '@emotion/css';

import { Display, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

const containerStyles = css({
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

const DashboardPageHeader: React.FC = () => (
  <header css={containerStyles}>
    <Display styleAsHeading={2}>Discover ASAP</Display>
    <div css={textStyles}>
      <Paragraph accent="lead">
        Guidance and resources about ASAP’s programs and policies as well as the
        ASAP and MJFF team.
      </Paragraph>
    </div>
  </header>
);

export default DashboardPageHeader;
