import React from 'react';
import css from '@emotion/css';

import { Display, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
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

type DashboardPageHeaderProps = {
  readonly firstName?: string;
};

const DashboardPageHeader: React.FC<DashboardPageHeaderProps> = ({
  firstName,
}) => {
  return (
    <header css={containerStyles}>
      <Display styleAsHeading={2}>{`Welcome to the Hub${
        firstName ? `, ${firstName}` : ''
      }!`}</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          The ASAP Hub is the private meeting point for grantees to share
          research ideas, outputs, learn what others are working on, and keep up
          with ASAP’s news and events. Each team has a private workspace and a
          listing of their shared research.
        </Paragraph>
      </div>
    </header>
  );
};

export default DashboardPageHeader;
